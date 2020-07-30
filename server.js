import express from 'express';
import { urlencoded, json } from 'body-parser';
import morgan from 'morgan';
// Imports the Google Cloud client libraries
import vision from '@google-cloud/vision';

// express setup
const app = express();

app.use(morgan('dev'));

app.use(urlencoded({ extended: true }));
app.use(json());

// Creates a client
const client = new vision.ImageAnnotatorClient();

// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
// const fileName = 'Path to file within bucket, e.g. path/to/image.png';
// Performs label detection on the gcs file
async function testVision(uri) {
  const [result] = await client.labelDetection(uri);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach((label) => { console.log(label.description); });
  return labels;
}

// routes

// test a hardcoded photo
app.get('/', async (req, res) => {
  try {
    const results = await testVision(
      'gs://cs52-firebase-ml-demo.appspot.com/photos/second album/dogs.jpg',
    );
    const cleanedResults = results.map((label) => { return label.description; });
    res.json(cleanedResults);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// get a dynamic google cloud bucket URI
app.post('/api', async (req, res) => {
  try {
    const { uri } = req.body;
    console.log(req.body);
    const results = await testVision(uri);
    const cleanedResults = results.map((label) => { return label.description; });
    res.json(cleanedResults);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT || 3000, () => { return console.log('Listening to port 3000'); });
