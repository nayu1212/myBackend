const mongoose = require('mongoose');

const inventoryRecordBuySchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    truckNumber: { type: String, required: true },
    rstNo: { type: String, unique: true },
    batch:{type:String}
},{
    timestamps:true
});

const inventoryRecordBuy =mongoose.models.InventoryRecordBuy || mongoose.model('InventoryRecordBuy', inventoryRecordBuySchema);
module.exports = inventoryRecordBuy;


