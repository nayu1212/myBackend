const Truck = require('../database/db'); // Correct path
const permanentIn = require('../database/permanentIn');
const permanentOut = require('../database/permanentOut');
const Truckout = require('../database/outSchema');
const Inventory = require('../database/inventory');
const inventoryRecordBuy=require('../database/inventoryRecordBuy');
const inventoryRecordSell=require("../database/inventoryRecordSell");
const Batch = require('../database/batch');
const printInvoice=require('../database/print');
const inController = async (req, res) => {
    try {
        const { truckNumber, weight, item, quality, comments } = req.body;

        // Validate mandatory fields
        if (!truckNumber || !weight || !item) {
            return res.status(400).json({ error: 'Truck Number, Weight, and Item are required.' });
        }

        const newTruck = new Truck({
            truckNumber,
            weight,
            item,
            quality,
            comments,
            trade:"BUY"
        });

        await newTruck.save();

        const newPermanentInTruck = new permanentIn({
            truckNumber,
            weight,
            item,
            quality,
            comments,
            trade:"BUY"
        });
        await newPermanentInTruck.save();

        res.status(201).json(newTruck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const outController = async (req, res) => {
    try {
        const { truckNumber, weight, item } = req.body;
        if (!truckNumber || !weight || !item) {
            return res.status(400).json({ error: 'Truck Number, Weight, and Item are required.' });
        }
        const inTruck = await Truck.findOne({ truckNumber, item, status: 'in',  trade: 'BUY'});
        if (!inTruck) {
            return res.status(400).json({ message: 'No such truck is in the factory' });
        }

        if(weight>inTruck.weight)
            {
               return res.status(400).json({ message:'weight of out truck cannot be gretter than in truck'});
            }
            const inweight=inTruck.weight;
            const myRst=inTruck.rstNo;
            const inDate=inTruck.createdAt;
            
     

        const outTruck = new permanentOut({
            truckNumber,
            weight,
            item,
            trade:"BUY",

        });
        await outTruck.save();

        const newPermanentOutTruck = new Truckout({
            truckNumber,
            weight,
            item,
            trade:"BUY",
            rstNo:myRst,
        });
        await newPermanentOutTruck.save();
    

        if (inTruck) {
           try{ 
            const newWeight =inTruck.weight - weight;
            const printData=new printInvoice({
                truckNumber:truckNumber,
                inweight:inweight,
                outweight:weight,
                grossweight:newWeight,
                item:item,
                rstNo:myRst,
                indate:inDate,
                outdate:newPermanentOutTruck.createdAt,
            });

            await printData.save();
        
            const recordBuyAdd=new inventoryRecordBuy({
                weight : newWeight,
                item,
                truckNumber,
                rstNo:inTruck.rstNo,
                batch: item === "Cotton" ? "no" : undefined,
            });
        

            await recordBuyAdd.save();
        
            const inventoryCategory=await Inventory.findOne({item});
            if (!inventoryCategory) {
                const inventoryAdd = new Inventory({
                    weight: newWeight,
                    item
                });
                await inventoryAdd.save();
            } else {
                inventoryCategory.weight += newWeight;
                await inventoryCategory.save();
            }

                inTruck.status = 'out'; 
            await inTruck.save();

        
            
            return res.status(201).json({ message: 'Data saved successfully' });
        }
        catch(err)
        {
           return res.status(400).json({ messsage: 'no such truck is in the factory'});
        }
        }
        else{
           return res.status(400).json({message:'no such truck is in the factory'});
        }

    } catch (err) 
    {
       return res.status(400).json({ error: err.message });
    }
};

const sellinController = async (req, res) => {
    try {
        const { truckNumber, weight, item, quality, comments } = req.body;

        // Validate mandatory fields
        if (!truckNumber || !weight || !item) {
            return res.status(400).json({ error: 'Truck Number, Weight, and Item are required.' });
        }

        const newTruck = new Truck({
            truckNumber,
            weight,
            item,
            quality,
            comments,
            trade:"SELL"
        });

        await newTruck.save();

        const newPermanentInTruck = new permanentIn({
            truckNumber,
            weight,
            item,
            quality,
            comments,
            trade:"SELL"
        });
        await newPermanentInTruck.save();

        res.status(201).json(newTruck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const selloutController = async (req, res) => {
    try {
        const { truckNumber, weight, item } = req.body;
        if (!truckNumber || !weight || !item) {
            return res.status(400).json({ error: 'Truck Number, Weight, and Item are required.' });
        }
        const inTruck = await Truck.findOne({ truckNumber, item, status: 'in', trade: 'SELL' });
  
        if (!inTruck) {
            return res.status(400).json({ message: 'No such truck is in the factory' });
        }

        if(weight<inTruck.weight)
            {
               return res.status(400).json({ message:'weight of out truck cannot be lesser than in truck okokoko'});
            }
            const inventoryCategory=await Inventory.findOne({item});
            const newWeight = weight - inTruck.weight ;
            if(inventoryCategory.weight<newWeight){
                return res.status(400).json({ message:'not in inventory'});
            }
        const outTruck = new permanentOut({
            truckNumber,
            weight,
            item,
            trade:"SELL"
        });
        await outTruck.save();
   const myRstSell=inTruck.rstNo;
        const newPermanentOutTruck = new Truckout({
            truckNumber,
            weight,
            item,
            trade:"SELL",
            rstNo:myRstSell,
        });
        await newPermanentOutTruck.save();
        const inweight=inTruck.weight;
        const myRst=inTruck.rstNo;
        const inDate=inTruck.createdAt;
        const printData=new printInvoice({
            truckNumber:truckNumber,
            inweight:inweight,
            outweight:weight,
            grossweight:newWeight,
            item:item,
            rstNo:myRst,
            indate:inDate,
            outdate:newPermanentOutTruck.createdAt,
        });

        await printData.save();

    if(item!=="Bales")
    {
        if (inTruck) {
           try{  
            const recordSellOut=new inventoryRecordSell({
                weight: newWeight,
                item,
                truckNumber,
                rstNo:inTruck.rstNo
            });
            await recordSellOut.save();
            if (!inventoryCategory) {
                const inventoryAdd = new Inventory({
                    weight: newWeight,
                    item
                });
                await inventoryAdd.save();
            } else {
                inventoryCategory.weight -= newWeight;
                await inventoryCategory.save();
            }
                inTruck.status = 'out'; 
            await inTruck.save();
            return res.status(201).json({ message: 'Data saved successfully' });
        }
        catch(err)
        {
           return res.status(400).json({ messsage: 'no such truck is in the factory'});
        }
        }
        else{
           return res.status(400).json({message:'no such truck is in the factory'});
        }
    }

    } catch (err) 
    {
       return res.status(400).json({ error: err.message });
    }
};

const getInTruckList=async(req,res)=>{
    try{
      const inTruckList=await Truck.find({}).sort({createdAt: -1})
     return res.status(200).json(inTruckList)
    }
    catch(err)
    {
        return res.status(400).json({error:err.message})
    }
}


module.exports = { inController, outController,sellinController,selloutController,getInTruckList };

