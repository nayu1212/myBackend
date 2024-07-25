const mongoose = require('mongoose');

const permanentInSchema = new mongoose.Schema({
    truckNumber: { type: String, required: true },
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    quality: { type: String },
    comments: { type: String },
    trade:{type:String},

},{
    timestamps:true
});

const permanentIn = mongoose.models.PermanentIn || mongoose.model('PermanentIn', permanentInSchema);
module.exports = permanentIn;