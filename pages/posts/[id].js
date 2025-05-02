import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { postsAPI } from '../../lib/api';
import { useAuth } from '../../lib/authContext';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);
  
  const fetchPost = async () => {
    try {
      const data = await postsAPI.getById(id);
      setPost(data);
    } catch (error) {
      console.error('failed to fetch post:', error);
      setError('failed to fetch post, please try again later');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      await postsAPI.delete(id);
      router.push('/');
    } catch (error) {
      console.error('failed to delete post:', error);
      alert('failed to delete post, please try again later');
    }
  };
  
  if (loading) {
    return (
      <Layout title="Loading... | Birdie Blog">
        <div className="text-center py-10">Loading...</div>
      </Layout>
    );
  }
  
  if (error || !post) {
    return (
        <Layout title="Error | Birdie Blog">
        <div className="max-w-3xl mx-auto py-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Post not found'}
          </div>
          <div className="mt-4">
            <Link href="/" className="text-blue-600 hover:underline">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  const isAuthor = user && post.author.id === user.id;
  
  return (
    <Layout title={`${post.title} | Birdie Blog`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="mb-8 text-gray-600">
          <p>
            Posted by {post.author.name} on{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="prose max-w-none mb-8">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="mt-8 border-t pt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Back to home
          </Link>
          
          {isAuthor && (
            <div className="mt-4 flex space-x-4">
              <Link
                href={`/posts/edit/${post.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit post
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete post
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}