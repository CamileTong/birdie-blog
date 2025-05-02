import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../lib/auth';

async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
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
      });
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      return res.status(200).json(post);
    } catch (error) {
      console.error('Get post failed:', error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      // find post
      const post = await prisma.post.findUnique({
        where: { id },
      });
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // check if post author is current user
      if (post.authorId !== req.user.id) {
        return res.status(403).json({ message: 'No permission to modify this post' });
      }
      
      // update post
      const { title, content, published } = req.body;
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(published !== undefined && { published }),
        },
      });
      
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Update post failed:', error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // find post
      const post = await prisma.post.findUnique({
        where: { id },
      });
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // check if post author is current user
      if (post.authorId !== req.user.id) {
        return res.status(403).json({ message: 'No permission to delete this post' });
      }
      
      // delete post
      await prisma.post.delete({
        where: { id },
      });
      
      return res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
      console.error('Delete post failed:', error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  } else {
    return res.status(405).json({ message: 'Unsupported request method' });
  }
}

// apply authentication middleware to PUT/PATCH/DELETE requests, and GET requests do not need authentication
export default function postHandler(req, res) {
  if (req.method === 'GET') {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}