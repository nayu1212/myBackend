const mongoose = require('mongoose');

const printSchema = new mongoose.Schema({
    truckNumber: { type: String, required: true },
    inweight: { type: Number, required: true },
    outweight: { type: Number, required: true },
    grossweight: { type: Number, required: true },
    item: { type: String, required: true },
    rstNo: { type: String, unique: true,required:true },
    indate:{type:Date, required:true},
    outdate:{type:Date, required:true},
},
{
    timestamps:true
});

const printInvoice = mongoose.models.printInvoice || mongoose.model('printInvoice', printSchema);
module.exports = printInvoice;