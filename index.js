const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tuf9wrv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const blogCollection = client.db('blogDB').collection('blog');
    const wishlistCollection = client.db('blogDB').collection('wishlist');
    const userCollection = client.db('blogDB').collection('users');

    // Blog Related Work

    app.get("/blog", async (req, res) => {
      // console.log("Pagination query",req.query);
      const result = await blogCollection.find().toArray();
      res.send(result);
    });

    // Getting single data
    app.get('/blog/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await blogCollection.findOne(query);
      res.send(result);
    })
  
    app.post('/blog', async(req, res) => {
      const newBlog = req.body;
      console.log("New User: ",newBlog); 
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    })

    app.put('/blog/:id', async(req,res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateBlog = {
        $set: {
           title: user.title,
           photo: user.photo,
           time: user.time,
           category: user.category,
           short_des: user.short_des,
           long_des: user.long_des
        }
      }
      
      const result = await blogCollection.updateOne(filter, updateBlog, options);
      res.send(result);
    })


    // Wishlist Collection

    app.get("/wishlist", async (req, res) => {
      const result = await wishlistCollection.find().toArray();
      res.send(result);
    });

    app.post('/wishlist', async(req, res) => {
      const newWishlist = req.body;
      console.log("New Wishlist: ",newWishlist); 
      const result = await wishlistCollection.insertOne(newWishlist);
      res.send(result);
    })

    app.delete('/wishlist/:id', async(req, res) => {
      const id = req.params.id;
      const query = {
        _id: id,
        // _id: new ObjectId(id),
      };
      const result = await wishlistCollection.deleteOne(query);
      // console.log(result);
      res.send(result);
    })

    // Comment Collection
    app.post('/users', async(req, res) => {
      const newUser = req.body;
      console.log("New User: ",newUser); 
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })


    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

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
  res.send('Moment Ink Server')
})

app.listen(port, () => {
  console.log(`Moment Ink listening on port ${port}`)
})