import { listTrips } from './modules/trips/trips.service.js';
(async () => {
    try {
        const res = await listTrips({});
        console.log(res);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
