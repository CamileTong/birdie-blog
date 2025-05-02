import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are supported' });
  }

  try {
    const { name, email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }
    
    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
}