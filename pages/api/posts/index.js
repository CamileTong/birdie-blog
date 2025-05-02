import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const {authorId} = req.query;

      const where = authorId ? { authorId } : {};

      const posts = await prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Get posts failed:', error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  } else if (req.method === 'POST') {
    // need authentication to create post
    try {
      const { title, content, published = false } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }
      
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published,
          author: { connect: { id: req.user.id } },
        },
      });
      
      return res.status(201).json(post);
    } catch (error) {
      console.error('Create post failed:', error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  } else {
    return res.status(405).json({ message: 'Unsupported request method' });
  }
}

// apply authentication middleware to POST requests, and GET requests do not need authentication
export default function postsHandler(req, res) {
  if (req.method === 'POST') {
    return authMiddleware(handler)(req, res);
  } else {
    return handler(req, res);
  }
}