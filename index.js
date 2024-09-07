// backend/server.js
const express = require('express');

const cors = require("cors")
const app = express();
const port = 8080;
require('dotenv').config();


app.use(cors())
app.use(express.json())
// Example API endpoint
app.get('/api/maps', async (req, res) => {
  const { origins, destinations } = req.query;
  const apiKey = process.env.API_KEY;

  try {
    const distanceMatrixResponse = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`
    );
    const distanceMatrixData = await distanceMatrixResponse.json();

    const snapToRoadsResponse = await fetch(
      `https://roads.googleapis.com/v1/snapToRoads?path=${origins}|${destinations}&key=${apiKey}`
    );
    const snapToRoadsData = await snapToRoadsResponse.json();
    console.log(distanceMatrixData)
    console.log(snapToRoadsResponse)

    res.json({
      distanceMatrix: distanceMatrixData,
      snapToRoads: snapToRoadsData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
