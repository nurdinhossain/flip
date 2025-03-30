import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../mongodb'; // Adjust path to your MongoDB utility file
import bcrypt from 'bcryptjs';
import { debugPort } from 'process';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API Request: ${req.method} /api/users`);

  try{
  const client = await clientPromise; // Connect to MongoDB
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection('users')

  if (req.method === 'GET') {
    // Fetch all users (excluding passwords for security)
    const users = await collection
      .find({}, { projection: { password: 0 } }) // Exclude passwords in response
      .toArray();

    res.status(200).json({ success: true, data: users });
  } else if (req.method === 'POST') {
    // Create a new user
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if the username already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await collection.insertOne({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        username,
      },
    });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
}
}


