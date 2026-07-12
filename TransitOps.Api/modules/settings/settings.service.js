import * as settingsModel from './settings.model.js';

export const getSettings = async () => {
    return settingsModel.getSettings();
};

export const updateSettings = async (data) => {
    return settingsModel.updateSettings(data);
};
