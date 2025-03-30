import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`API Request: ${req.method} /api/getUser`);

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('users');

    if (req.method === 'POST') {
      // Proper body parsing for Pages Router
      const { username, password } = req.body;

      const user = await collection.findOne({ username });

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({ 
        success: true, 
        data: userWithoutPassword 
      });
    }

    // Handle unsupported methods
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
}

