// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://sandeep200418:123@cluster0.57neiuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('inventoryDB');
    collection = db.collection('products');
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
connectDB();

app.get('/api/products', async (req, res) => {
  try {
    const products = await collection.find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await collection.findOne({ _id: new ObjectId(id) });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product by ID' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const result = await collection.insertOne(product);
    res.json({ _id: result.insertedId, ...product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body;
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    );
    const product = await collection.findOne({ _id: new ObjectId(id) });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
