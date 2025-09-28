import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

async function testDB() {
  const client = new MongoClient(uri as string);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Select the database and collection
    const db = client.db('banking_db');
    const collection = db.collection('test_collection');

    // Insert a test document
    const insertResult = await collection.insertOne({ name: process.env.DB_TEST_NAME });
    console.log('Inserted document ID:', insertResult.insertedId);

    // Query documents
    const docs = await collection.find().toArray();
    console.log('Documents in collection:', docs);

  } catch (err) {
    console.error('DB connection error:', err);
  } finally {
    // Disconnect
    await client.close();
    console.log('Disconnected');
  }
}

testDB();
