const mongoose = require('mongoose');

const outSchema = new mongoose.Schema({
    truckNumber: { type: String, required: true },
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    trade:{type:String},
    rstNo: { type: String, unique: true } 
},
{
    timestamps:true
});

const outTruck = mongoose.models.Truckout || mongoose.model('outTruck', outSchema);
module.exports = outTruck;