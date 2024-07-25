const mongoose = require('mongoose');

const inventoryCottonBuySchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    truckNumber: { type: String, required: true },
    rstNo: { type: String, unique: true },
    batched:{type:String, default:"No"},
},{
    timestamps:true
});

const inventoryRecordBuyCotton =mongoose.models.InventoryRecordBuyCotton || mongoose.model('InventoryRecordBuyCotton', inventoryCottonBuySchema);
module.exports = inventoryRecordBuyCotton;