import { verify } from 'jsonwebtoken';

export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const token = authHeader.substring(7);
      
      // verify token
      const decoded = verify(token, process.env.JWT_SECRET || 'my-secret-key');
      
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}