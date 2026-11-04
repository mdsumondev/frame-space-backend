
import express from "express";
import cors from "cors"
import 'dotenv/config'
import { MongoClient , ObjectId} from 'mongodb';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// ----------- mongodb connection ------------

const client = new MongoClient(`${process.env.MONGODB_URI}`);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const db = await connectToMongoDB();

const database = db.db("frame-space");
const studio = database.collection("studios");
const category = database.collection("category");

// --------------- studio data post method --------------


app.post("/add-studio" , async(req,res) =>{

    const studioData = req.body;

    try{

        const result = await studio.insertOne(studioData);

        console.log(result);
        res.send({status:200 , message:"success"})

    }catch(error){
        console.log(error);
    }


    res.send("server is running");
})


// -------------------------- studio data get -------------------------

app.get("/studios", async (req , res) =>{
    try{
        const result =  await studio.find();
        res.send({status:200 , message:"success" , data: await result.toArray()});
    }catch(error){
        console.dir(error);
    }
})



// ----------------- single studio data get -------------------------

app.get("/studios/:id" , async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    try{
        const result = await studio.findOne(query);
        res.send({status:200 , message:"success" , data: result});
    }catch(error){
        console.dir(error);
    }
})

// ----------------------- studio data update -------------------------



app.put("/studios/:id" , async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const updateData = req.body;
    try{
        const result = await studio.updateOne(query, {$set:updateData});
        res.send({status:200 , message:"success" , data: result});
    }catch(error){
        console.dir(error);
    }
})


// ---------------- my listing  -----------------

app.get("/my-listings/:email",async(req, res)=>{

    const email = req.params.email;
   
    try{

        const result = await studio.find({ownerEmail:email}).toArray();
         res.send({status:200, message:"success", data:result})
    }catch(error){
        console.dir(error)
    }

})


// ------------------- update my listing -------------------

app.put("/my-listings/:id",async(req, res)=>{

    const id = req.params.id;
    const updateData = req.body;
   
    try{

        const query = {_id: new ObjectId(id)}

        const result = await studio.updateOne( query, {$set:updateData});
         res.send({status:200, message:"success"})
    }catch(error){
        console.dir(error)
    }

})

// ----------------- delete myListing ---------------------------



app.delete("/my-listings/:id",async(req, res)=>{

    const id = req.params.id;
    
   
    try{

        const query = {_id: new ObjectId(id)}

           const result = await studio.deleteOne(query);
         res.send({status:200, message:"success"})

    }catch(error){
        console.dir(error)
    }

})


// --------------------- category data -----------------------

app.get("/category" , async(req ,res)=>{
    try{

        const result = await category.find().toArray();
        res.send({status:200 , message:"success" , data:result})

    }catch(error){
        console.log(error);
    }
})



// ----------------- all studio lists ------------------

app.get("/studioListings" , async(req ,res) =>{
    try{
        
        const result =  await studio.find().toArray();

        res.send({status:200 , message:"success" , data:result})

    }catch(error){
        console.log(error)
    }
})


    

app.listen(PORT,() =>{
    console.log("Server is running on port " + PORT);
})