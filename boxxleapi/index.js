const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// Parse incoming requests
app.use(bodyParser.json());

// Ajouter le middleware pour autoriser les requêtes CORS depuis tous les domaines
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the data
const DataSchema = new mongoose.Schema({
  username: String,
  steps: Number,
  date: String,
});

// Define a model for the data
const DataModel = mongoose.model('Data', DataSchema);

// Define the POST endpoint
app.post('/data', async (req, res) => {
  try {
    const { username, steps, date } = req.body;
    const data = new DataModel({ username, steps, date });
    await data.save();
    res.status(201).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while saving the data');
  }
});

// Define the GET endpoint
app.get('/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving the data');
  }
});

https.createServer(options, app).listen(3000, () => {
  console.log('Server is running on port 3000');
});
