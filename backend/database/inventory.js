const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    // truckNumber: { type: String, required: true },
},{
    timestamps:true
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
