const mongoose = require('mongoose');

const cottonBalesRecordSchema = new mongoose.Schema({
    bales:{type: Number, required:true},
    batchNumber:{type:Number},
    cottonSeedQuantity:{type: Number, required:true},
},{
    timestamps:true
});

const cottonBalesRecord =mongoose.models.cottonStock || mongoose.model('cottonStock', cottonBalesRecordSchema);
module.exports = cottonBalesRecord;