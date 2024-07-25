const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    totalWeight: Number,
    cottonSeed: Number,
    rstWeightList: [
      {
        rstNo: String,
        weight: Number,
      },
    ],
    balesProduced: Number,
    shortage: Number,
    batchNumber: { type: Number, unique: true },
   
}, {
    timestamps: true
});


batchSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const lastBatch = await this.constructor.findOne().sort({ createdAt: -1 });
            if (lastBatch && lastBatch.batchNumber) {
                this.batchNumber = lastBatch.batchNumber + 1;
            } else {
                this.batchNumber = 1;
            }
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

  const Batch = mongoose.models.batch || mongoose.model('batch', batchSchema);
module.exports = Batch;
