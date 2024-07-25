const mongoose = require('mongoose');

const inventoryModifySchema = new mongoose.Schema({
    item: { type: String, required: true },
    weight: { type: Number, required: true },
},{
    timestamps:true
});

const InventoryModify = mongoose.model('InventoryModify', inventoryModifySchema);
module.exports = InventoryModify;
