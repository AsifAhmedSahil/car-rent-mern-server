const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.quaequt.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db("rentCar").collection("services");
        const bookingCollection = client.db("rentCar").collection("bookings");

        app.get("/services",async(req,res)=>{
                const query = {}
                const cursor = serviceCollection.find(query);
                const services  = await cursor.toArray();
                res.send(services);
        })

        app.get("/services/:id",async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // bookings api

        app.post("/bookings",async(req,res)=>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);

        })
    }
    finally{

    }

}

run().catch(err => console.error(err));



app.get("/",(req,res) =>{
    res.send(" car rent server is running")
})

app.listen(port,()=>{
    console.log(`car rent server in runnign on ${port} `);
})