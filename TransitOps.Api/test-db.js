import db from './config/db.js';
import * as expensesModel from './modules/expenses/expenses.model.js';
import * as fuelModel from './modules/fuel/fuel.model.js';

(async () => {
  try {
    console.log("Testing expenses.findAll...");
    await expensesModel.findAll({});
    console.log("expenses OK");
  } catch (e) {
    console.error("Expenses error:", e);
  }
  
  try {
    console.log("Testing fuelLogs.findAll...");
    await fuelModel.findAll({});
    console.log("fuel logs OK");
  } catch (e) {
    console.error("Fuel logs error:", e);
  }
  
  process.exit(0);
})();
