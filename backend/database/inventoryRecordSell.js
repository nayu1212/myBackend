const mongoose = require('mongoose');

const inventoryRecordSellSchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    truckNumber: { type: String, required: true },
    rstNo: { type: String, unique: true }
},{
    timestamps:true
});

const inventoryRecordSell = mongoose.models.InventoryRecordSell || mongoose.model('InventoryRecordSell', inventoryRecordSellSchema);
module.exports = inventoryRecordSell;
