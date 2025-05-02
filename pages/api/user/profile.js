import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          posts: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Get user profile failed:', error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { name, image } = req.body;
      
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(name !== undefined && { name }),
          ...(image !== undefined && { image }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      });
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update user profile failed:', error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  } else {
    return res.status(405).json({ message: 'Unsupported request method' });
  }
}

// apply authentication middleware
export default authMiddleware(handler);