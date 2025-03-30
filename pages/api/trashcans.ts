import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../mongodb'; // Adjust path to your MongoDB utility file
import bcrypt from 'bcryptjs';
import { debugPort } from 'process';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API Request: ${req.method} /api/users`);

  try{
  const client = await clientPromise; // Connect to MongoDB
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection('trashcans');

  if (req.method === 'GET') {
    // Fetch all trashcan data
    const trashcanData = await collection.findOne({});
    res.status(200).json({ success: true, data: trashcanData });
  } else if (req.method === 'POST') {
    // Create a new trashcan entry
    const { lastObjects, capacity, dateTime } = req.body;

    // Validate input
    if (!Array.isArray(lastObjects) || typeof capacity !== 'number' || !Array.isArray(dateTime)) {
      return res.status(400).json({ success: false, message: 'Invalid input format' });
    }

    // Insert into MongoDB
    const result = await collection.insertOne({
      lastObjects,
      capacity,
      dateTime,
    });

    res.status(201).json({
      success: true,
      data: { _id: result.insertedId.toString(), lastObjects, capacity, dateTime },
    });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
} catch (error) {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : 'Internal Server Error',
  });
}
}