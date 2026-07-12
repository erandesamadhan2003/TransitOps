import * as settingsService from './settings.service.js';
import { response } from '../../utils/response.js';

export const getSettings = async (req, res, next) => {
    try {
        const settings = await settingsService.getSettings();
        response.success(res, { data: settings });
    } catch (err) {
        next(err);
    }
};

export const updateSettings = async (req, res, next) => {
    try {
        const settings = await settingsService.updateSettings(req.body);
        response.success(res, { message: 'Settings updated successfully', data: settings });
    } catch (err) {
        next(err);
    }
};
