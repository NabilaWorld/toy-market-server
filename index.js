const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleWare
// app.use(cors());
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.use(express.json());


console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zx1pf4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    client.connect((err)=>{
      if(err){
        console.error(err);
        return;
      }
    })


    const toyCollection = client.db('cookingToy').collection('girlsToy');
    const addToy = client.db('cookingToy').collection('addToy');

    // all data load
    app.get('/toy', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // single data load 1
    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: {
          picture_1: 1,
          name_1: 1,
          seller_name_1: 1,
          seller_email_1: 1,
          price_1: 1,
          rating_1: 1,
          available_quantity_1: 1,
          detail_discription_1: 1,

          picture_2: 1,
          name_2: 1,
          seller_name_2: 1,
          seller_email_2: 1,
          price_2: 1,
          rating_2: 1,
          available_quantity_2: 1,
          detail_discription_2: 1,


          picture_3: 1,
          name_3: 1,
          seller_name_3: 1,
          seller_email_3: 1,
          price_3: 1,
          rating_3: 1,
          available_quantity_3: 1,
          detail_discription_3: 1,

        }
      }

      const result = await toyCollection.findOne(query, options);
      res.send(result);
    })



    // single data load 2
    app.get('/myToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        projection: {
          photoUrl: 1,
          name: 1,
          seller_name: 1,
          email: 1,
          price: 1,
          rating: 1,
          quantity: 1,
          description: 1,



        }
      }

      const result = await addToy.findOne(query, options);
      res.send(result);
    });


    // limit data
    app.get('/myToy', async (req, res) => {
      const query = {}
      const cursor = addToy.find(query).limit(20)
      const product = await cursor.toArray()
      res.send(product)
    })

    // accending
    app.get('/myToy1', async (req, res) => {
      const query = {}
      const cursor = addToy.find(query).sort({ price: 1 })
      const product = await cursor.toArray()
      res.send(product)
    })


    // decending
    app.get('/myToy2', async (req, res) => {
      const query = {}
      const cursor = addToy.find(query).sort({ price: -1 })
      const product = await cursor.toArray()
      res.send(product)
    })

    // add toy
    app.get('/myToy', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await addToy.find(query).toArray();
      res.send(result);
    })


    // post data
    app.post('/myToy', async (req, res) => {
      const myToy = req.body;
      console.log(myToy);
      const result = await addToy.insertOne(myToy);
      res.send(result);
    });



    // update data
    app.put('/myToy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updated = req.body;
      const updateToy = {
        $set: {
          price: updated.price,
          quantity: updated.quantity,
          description: updated.description
        }
      };
      const result = await addToy.updateOne(filter, updateToy, options);
      res.send(result);
    });

//name
const indexKey = {name:1}
const indexOptions = {name: "name_index"}
const result = await addToy.createIndex(indexKey,indexOptions)
// search /toySearch
 app.get("/toySearch/:text", async (req, res)=>{
  
  const searchText = req.params.text;
console.log(searchText)
  const result = await addToy.find(
      {name: {$regex: searchText, $options: "i"}}
  )
  .toArray();
 
  res.send(result)
 })



    // delete data
    app.delete('/myToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addToy.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('girls cooking toy')
})

app.listen(port, () => {
  console.log(`Girls are happy ${port}`)
})