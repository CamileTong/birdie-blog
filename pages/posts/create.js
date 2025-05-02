import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { postsAPI } from '../../lib/api';
import { useAuth } from '../../lib/authContext';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: true,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  
  // if user is not logged in, redirect to login page
  if (typeof window !== 'undefined' && !user) {
    router.push('/login');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // form validation
    if (!formData.title || !formData.content) {
      return setError('Please fill in title and content');
    }
    
    setLoading(true);
    
    try {
      // call create post API
      const post = await postsAPI.create(formData);
      
      // redirect to post detail page after successful creation
      router.push(`/posts/${post.id}`);
    } catch (error) {
      console.error('Create post error:', error);
      setError(error.message || 'failed to create post, please try again later');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout title="Create Post | Birdie Blog">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="12"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="published">Publish immediately</label>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
            
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}