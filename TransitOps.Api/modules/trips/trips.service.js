import * as tripsModel from './trips.model.js';
import * as vehiclesModel from '../vehicles/vehicles.model.js';
import * as driversModel from '../drivers/drivers.model.js';
import { db } from '../../config/db.js'; // Actually need withTransaction
import pool, { withTransaction } from '../../config/db.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/errors.js';

export const listTrips = async ({ status, vehicleId, driverId, search, dateFrom, dateTo, page = 1, pageSize = 20 }) => {
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const filters = { status, vehicleId, driverId, search, dateFrom, dateTo, limit, offset };
    const trips = await tripsModel.findAll(filters);
    const total = await tripsModel.countAll(filters);

    return {
        trips,
        pagination: {
            page: Math.max(parseInt(page, 10) || 1, 1),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getTripById = async (id) => {
    const trip = await tripsModel.findById(id);
    if (!trip) throw new NotFoundError('Trip not found');
    return trip;
};

export const createTrip = async (data, requestingUser) => {
    const vehicle = await vehiclesModel.findById(data.vehicleId);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    const driver = await driversModel.findById(data.driverId);
    if (!driver) throw new NotFoundError('Driver not found');

    if (parseFloat(data.cargoWeight) > parseFloat(vehicle.maxCapacity)) {
        throw new BadRequestError('Cargo weight exceeds vehicle capacity');
    }

    return tripsModel.create({
        ...data,
        createdBy: requestingUser.id
    });
};

export const dispatchTrip = async (id) => {
    const trip = await tripsModel.findById(id);
    if (!trip) throw new NotFoundError('Trip not found');
    if (trip.status !== 'Draft') {
        throw new ConflictError('Only Draft trips can be dispatched');
    }

    return await withTransaction(async (client) => {
        // Re-fetch vehicle and driver to ensure current status within transaction
        const vehicle = await vehiclesModel.findById(trip.vehicleId); // findById doesn't accept client but it's okay for read, or we could pass client if we modify findById, but standard SELECT inside transaction uses the transaction snapshot.
        const driver = await driversModel.findById(trip.driverId);

        if (vehicle.status !== 'Available') throw new ConflictError('Vehicle is not available');
        if (driver.status !== 'Available') throw new ConflictError('Driver is not available');
        
        const expiryDate = new Date(driver.licenseExpiry);
        const now = new Date();
        expiryDate.setHours(0,0,0,0);
        now.setHours(0,0,0,0);
        
        if (expiryDate < now) {
            throw new ConflictError('Driver license has expired');
        }

        if (parseFloat(trip.cargoWeight) > parseFloat(vehicle.maxCapacity)) {
            throw new ConflictError('Cargo weight exceeds vehicle capacity (defensive check)');
        }

        // Lock statuses
        await vehiclesModel.updateStatus(vehicle.id, 'On Trip', client);
        await driversModel.updateStatus(driver.id, 'On Trip', client);
        await tripsModel.updateStatus(id, 'Dispatched', 'dispatched_at', client);

        return await tripsModel.findById(id, client);
    });
};

export const completeTrip = async (id, data) => {
    const trip = await tripsModel.findById(id);
    if (!trip) throw new NotFoundError('Trip not found');
    if (trip.status !== 'Dispatched') {
        throw new ConflictError('Only Dispatched trips can be completed');
    }

    return await withTransaction(async (client) => {
        // In case maintenance locked the vehicle while on trip, completing trip will unlock it.
        // We'll enforce that maintenance can't be opened on 'On Trip' vehicles in the maintenance module.
        await vehiclesModel.updateStatus(trip.vehicleId, 'Available', client);
        await driversModel.updateStatus(trip.driverId, 'Available', client);
        
        await tripsModel.updateCompletionDetails(id, data, client);
        await tripsModel.updateStatus(id, 'Completed', 'completed_at', client);

        return await tripsModel.findById(id, client);
    });
};

export const cancelTrip = async (id) => {
    const trip = await tripsModel.findById(id);
    if (!trip) throw new NotFoundError('Trip not found');

    if (trip.status === 'Completed' || trip.status === 'Cancelled') {
        throw new ConflictError('Cannot cancel a trip that is already completed or cancelled');
    }

    if (trip.status === 'Draft') {
        // No locks were held
        const updated = await tripsModel.updateStatus(id, 'Cancelled', 'cancelled_at', pool);
        return await tripsModel.findById(id);
    }

    if (trip.status === 'Dispatched') {
        return await withTransaction(async (client) => {
            await vehiclesModel.updateStatus(trip.vehicleId, 'Available', client);
            await driversModel.updateStatus(trip.driverId, 'Available', client);
            await tripsModel.updateStatus(id, 'Cancelled', 'cancelled_at', client);
            
            return await tripsModel.findById(id, client);
        });
    }
};
