
import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

// ---------------- Middleware ----------------

app.use(cors());
app.use(express.json());

// ---------------- MongoDB Connection ----------------

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is missing");
}

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

const connectToMongoDB = async () => {
  if (!clientPromise) {
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise;
};

const database = client.db("frame-space");

const studio = database.collection("studios");
const category = database.collection("category");
const studioBook = database.collection("studio-book");

// ---------------- Database Middleware ----------------

app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    console.error("MongoDB Connection Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Database connection failed",
    });
  }
});

// ---------------- Helper: Validate ObjectId ----------------

const isValidObjectId = (id) => ObjectId.isValid(id);

// ---------------- Root API ----------------

app.get("/", (req, res) => {
  res.status(200).send("FrameSpace API is running!");
});

// ---------------- Add Studio ----------------

app.post("/add-studio", async (req, res) => {
  try {
    const studioData = req.body;

    const result = await studio.insertOne(studioData);

    return res.send({
      status: 200,
      message: "success",
    });
  } catch (error) {
    console.error("Add Studio Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Get All Studios ----------------

app.get("/studios", async (req, res) => {
  try {
    const result = await studio.find().toArray();

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Get Studios Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Get Single Studio ----------------

app.get("/studios/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        status: 400,
        message: "Invalid studio ID",
      });
    }

    const query = { _id: new ObjectId(id) };

    const result = await studio.findOne(query);

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Get Single Studio Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Update Studio ----------------

app.put("/studios/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        status: 400,
        message: "Invalid studio ID",
      });
    }

    const query = { _id: new ObjectId(id) };
    const updateData = req.body;

    const result = await studio.updateOne(query, {
      $set: updateData,
    });

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Update Studio Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- My Listings ----------------

app.get("/my-listings/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const result = await studio
      .find({ ownerEmail: email })
      .toArray();

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("My Listings Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Update My Listing ----------------

app.put("/my-listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        status: 400,
        message: "Invalid listing ID",
      });
    }

    const query = { _id: new ObjectId(id) };

    await studio.updateOne(query, {
      $set: updateData,
    });

    return res.send({
      status: 200,
      message: "success",
    });
  } catch (error) {
    console.error("Update My Listing Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Delete My Listing ----------------

app.delete("/my-listings/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        status: 400,
        message: "Invalid listing ID",
      });
    }

    const query = { _id: new ObjectId(id) };

    await studio.deleteOne(query);

    return res.send({
      status: 200,
      message: "success",
    });
  } catch (error) {
    console.error("Delete My Listing Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Get Categories ----------------

app.get("/category", async (req, res) => {
  try {
    const result = await category.find().toArray();

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- All Studio Listings ----------------

app.get("/studioListings", async (req, res) => {
  try {
    const result = await studio.find().toArray();

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Studio Listings Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Newest Studios ----------------

app.get("/neweststudios", async (req, res) => {
  try {
    const result = await studio
      .find()
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Newest Studios Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Category Wise Studios ----------------

app.get("/category/:category", async (req, res) => {
  try {
    const categoryName = req.params.category;

    const filter = {
      category: categoryName,
    };

    const result = await studio.find(filter).toArray();

    return res.send(result);
  } catch (error) {
    console.error("Category Wise Studios Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Add Studio Booking ----------------

app.post("/studio-book", async (req, res) => {
  try {
    const bookingData = req.body;

    await studioBook.insertOne(bookingData);

    return res.send({
      status: 200,
      message: "success",
    });
  } catch (error) {
    console.error("Add Booking Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- My Booking Studios ----------------

app.get("/my-booking/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const query = {
      email: email,
    };

    const result = await studioBook.find(query).toArray();

    return res.send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("My Booking Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Delete Booking ----------------

app.delete("/studio-book/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        status: 400,
        message: "Invalid booking ID",
      });
    }

    const query = {
      _id: new ObjectId(id),
    };

    await studioBook.deleteOne(query);

    return res.send({
      status: 200,
      message: "success",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// ---------------- Export Express App ----------------

export default app;
