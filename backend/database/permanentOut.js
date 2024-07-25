const mongoose = require('mongoose');

const permanentOutSchema = new mongoose.Schema({
    truckNumber: { type: String, required: true },
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    trade:{type:String },
},
{
    timestamps:true
});

const permanentout = mongoose.models.PermanentOut || mongoose.model('PermanentOut', permanentOutSchema);
module.exports = permanentout;