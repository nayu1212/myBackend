const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    truckNumber: { type: String, required: true },
    weight: { type: Number, required: true },
    item: { type: String, required: true },
    quality: { type: String },
    comments: { type: String },
    status: { type: String, default: 'in' },
    trade: { type: String },
    rstNo: { type: String, unique: true },
}, {
    timestamps: true
});

// Pre-save hook to generate unique rstNo
TruckSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const lastTruck = await this.constructor.findOne().sort({ createdAt: -1 });
            if (lastTruck && lastTruck.rstNo) {
                const lastNumber = parseInt(lastTruck.rstNo.slice(1), 10);
                this.rstNo = `A${lastNumber + 1}`;
            } else {
                this.rstNo = 'A1';
            }
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Truck = mongoose.models.Truck || mongoose.model('Truck', TruckSchema);

module.exports = Truck;
