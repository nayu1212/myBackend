const Truck = require('../database/db'); // Ensure this path is correct
const permanentIn = require('../database/permanentIn');
const permanentOut = require('../database/permanentOut');
const Truckout = require('../database/outSchema');
const Inventory = require('../database/inventory');
const inventoryRecordBuy = require('../database/inventoryRecordBuy');
const inventoryRecordSell = require("../database/inventoryRecordSell");
const Batch=require('../database/batch');
const cottonBalesRecord=require('../database/cottonBales')
const InventoryModify=require('../database/modifyInventory');
const printInvoice=require('../database/print');
const finalInventoryData = async (req, res) => {
    try {
        const inventoryDataFinal = await Inventory.find({}).sort({ createdAt: -1 });
        res.status(200).json(inventoryDataFinal);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
}

const buyInventoryData=async(req,res)=>{
    try{
           const buyInventoryData= await inventoryRecordBuy.find({}).sort({createdAt:-1});
           res.status(200).json(buyInventoryData);
    }
    catch(e){
        return res.status(400).json({ error: e.message });

    }
}

const sellInventoryData=async(req,res)=>{
    try{
           const buyInventoryData= await inventoryRecordSell.find({}).sort({createdAt:-1});
           res.status(200).json(buyInventoryData);
    }
    catch(e){
        return res.status(400).json({ error: e.message });

    }
}

const getCottonRSTNumber = async (req, res) => {
    try {
      const CottonTrucks = await inventoryRecordBuy.find({ item: "Cotton" , batch:"no"}).sort({ createdAt: -1 });
  
      if (CottonTrucks && CottonTrucks.length > 0) {
        // Map each truck to an object containing rstNo, weight, and truckNumber
        const trucksDetails = CottonTrucks.map(truck => ({
          rstNo: truck.rstNo,
          weight: truck.weight,
          truckNumber: truck.truckNumber
        })).filter(truck => truck.rstNo != null); // Filter out trucks with null rstNo
  
        return res.status(200).json(trucksDetails);
      } else {
        return res.status(404).json({ message: 'No cotton trucks found' });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
  const getrstWeight = async (req, res) => {

    const { rstNo } = req.params;
    
    if (!rstNo) {
      return res.status(400).json({ error: 'RST number is required' });
    }
  
    try {
      const myTruck = await inventoryRecordBuy.findOne({ rstNo });
      if (!myTruck) {
        return res.status(404).json({ error: 'Weight not found for the provided RST number' });
      }
      
      const weight = myTruck.weight; // Access weight directly
      res.status(200).json({ weight });
    } catch (e) {
      console.error(e); // Log the error for debugging
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  const batchContoller=async (req, res) => {
    try {
      const { totalWeight, rstWeightList, balesProduced, shortage } = req.body;
  
      // Create a new batch record

      const rstNumbers = rstWeightList.map(rst => rst.rstNo);
      
      const cottonSeed=(totalWeight - (balesProduced*165)-(shortage/100)*totalWeight);
      if(cottonSeed<0)
        {
          return res.status(404).json({ error: 'not possible' });
        }
      await inventoryRecordBuy.updateMany(
        { rstNo: { $in: rstNumbers } },
        { $set: { batch: "yes" } }
      );
      const newBatch = new Batch({
        totalWeight,
        rstWeightList,
        balesProduced,
        shortage,
        cottonSeed:cottonSeed,
      });
  
      // Save the batch record to the database
      await newBatch.save();

      const batchNumber=newBatch.batchNumber;
      const cottonData=new cottonBalesRecord({
        bales:balesProduced,
        batchNumber:batchNumber,
        cottonSeedQuantity:cottonSeed,
      });
      await cottonData.save();
  
      const cottonInventory=await Inventory.findOne({item:"Cotton"});
      if(cottonInventory)
      {
      cottonInventory.weight=cottonInventory.weight-totalWeight;
      await cottonInventory.save();
      }
      else{
        return res.status(404).json({ error: 'not possible' });
      }

      const findBalesCategory=await Inventory.findOne({item:"Bales"});
      if(findBalesCategory)
      {
        findBalesCategory.weight=findBalesCategory.weight+balesProduced;
        await findBalesCategory.save();
      }
      else{
        const finalInventoryCottonData=await Inventory({
          item:"Bales",
          weight:balesProduced
        });
        await finalInventoryCottonData.save();
      }
      const findCottonSeedCategory=await Inventory.findOne({item:"Cotton Seed"});
      if(findCottonSeedCategory)
      {
        findCottonSeedCategory.weight=findCottonSeedCategory.weight+ cottonSeed;
        await findCottonSeedCategory.save();
      }
      else{
        const finalInventoryCottonSeedData=await Inventory({
          item:"Cotton Seed",
          weight:cottonSeed,
        });
        await finalInventoryCottonSeedData.save();
      }


      res.status(200).json({ message: 'Batch submitted successfully' });
    } catch (error) {
      console.error('Error submitting batch:', error);
      res.status(500).json({ message: 'Failed to submit batch' });
    }
  };
  


const getInTruckAdmin=async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
console.log(req.query.date);
    const trucks = await Truck.find({
      createdAt: {
        $gte: date,
        $lt: nextDay,
      },
    });
    if (trucks.length === 0) {
      return res.status(404).json({ error: "No data present for this date" });
    }
    res.status(200).json(trucks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 

const getOutTruckAdmin = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const trucks = await Truckout.find({
      createdAt: {
        $gte: date,
        $lt: nextDay,
      },
    });
    if (trucks.length === 0) {
      return res.status(404).json({ error: "No data present for this date" });
    }
    res.status(200).json(trucks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBatchDataAdmin = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const batchData = await Batch.find({
      createdAt: {
        $gte: date,
        $lt: nextDay,
      },
    });
    if (batchData.length === 0) {
      return res.status(404).json({ error: "No data present for this date" });
    }
    res.status(200).json(batchData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const inventoryModify=async(req,res)=>{
  try {
    const { item, addweight } = req.body;

    const selectedItem = await Inventory.findOne({ item });
    if (selectedItem) {
      selectedItem.weight = selectedItem.weight + addweight;
      await selectedItem.save();
      const modifiedInventory = new InventoryModify({
        item: item,
        weight: addweight,
      });
      await modifiedInventory.save();
      return res.status(200).json(selectedItem);
    } else {
      return res.status(400).json({ error: 'Item not present' });
    }
  }
  catch(error){
    return res.status(500).json({ error: error.message });
  }
}

const getInvoiceDetails=async(req,res)=>{
  try{
      const {reqrst}=req.params;

      const selectedPrint=await printInvoice.findOne({rstNo:reqrst});
      if(selectedPrint)
      {
        return res.status(200).json({selectedPrint});
      }
      else{
        return res.status(400).json({ error: 'No invoice present' });
      }

  }
  catch(error)
  {
    return res.status(500).json({error:error.message});
  }
}
module.exports = { finalInventoryData,buyInventoryData,sellInventoryData,getCottonRSTNumber,getrstWeight,batchContoller,getInTruckAdmin,getOutTruckAdmin,getBatchDataAdmin,inventoryModify,getInvoiceDetails};
