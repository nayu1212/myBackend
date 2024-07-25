const express = require('express');

const { inController, outController, sellinController, selloutController, getInTruckList } = require('../controller/truckController');
const { finalInventoryData,buyInventoryData,sellInventoryData,getCottonRSTNumber,getrstWeight,batchContoller,getInTruckAdmin,getOutTruckAdmin,getBatchDataAdmin, inventoryModify,getInvoiceDetails } = require('../controller/adminPanelController');
const truckRouter = express.Router();

truckRouter.post('/buy/addtruck', inController);
truckRouter.post('/buy/outtruck', outController);

truckRouter.post('/sell/addtruck', sellinController);
truckRouter.post('/sell/outtruck', selloutController);
truckRouter.get('/intrucklist', getInTruckList);

truckRouter.get('/finalinventory', finalInventoryData);
truckRouter.get('/buyinventory',buyInventoryData );
truckRouter.get('/sellinventory',sellInventoryData);

truckRouter.get('/getrstnumber',getCottonRSTNumber);
truckRouter.get('/getweight/:rstNo',getrstWeight);

truckRouter.post('/submitbatch',batchContoller)

truckRouter.get('/admin/intruck',getInTruckAdmin);

truckRouter.get('/admin/outtruck',getOutTruckAdmin);

truckRouter.get('/admin/batchdata',getBatchDataAdmin);

truckRouter.post('/admin/modifyinventory',inventoryModify);

truckRouter.get('/admin/invoice/:reqrst',getInvoiceDetails)

module.exports = truckRouter;
