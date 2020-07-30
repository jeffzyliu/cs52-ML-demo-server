import express from 'express';
import { urlencoded, json } from 'body-parser';
import morgan from 'morgan';
// Imports the Google Cloud client libraries
import vision from '@google-cloud/vision';

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
// const fileName = 'Path to file within bucket, e.g. path/to/image.png';

// Performs label detection on the gcs file

async function testVision() {
  const [result] = await client.labelDetection(
    // `gs://${bucketName}/${fileName}`
    'gs://cloud-samples-data/vision/label/setagaya.jpeg',
  );
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach((label) => { console.log(label.description); });
  return labels;
}

const app = express();

app.use(morgan('dev'));

app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/', async (req, res) => {
  try {
    const results = await testVision();
    const cleanedResults = results.map((label) => { return label.description; });
    res.json(cleanedResults);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(3000);
