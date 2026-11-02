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






    

app.listen(PORT,() =>{
    console.log("Server is running on port " + PORT);
})