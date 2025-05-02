import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are supported' });
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Can not find user with this email' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    
    // JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || 'my-secret-key',
      { expiresIn: '7d' }
    );
    
    // remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
}