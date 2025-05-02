import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../lib/authContext';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  
  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    } else if (user) {
      // Fetch user's posts when user is available
      fetchUserPosts();
    }
  }, [user, loading]);
  
  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts?authorId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setUserPosts(data);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError(err.message || 'Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return null; // Return null while redirecting
  }
  
  return (
    <Layout title="My Profile | Birdie Blog">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-gray-600">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Posts</h2>
            <button 
              onClick={() => router.push('/posts/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Post
            </button>
          </div>
          
          {loading ? (
            <p>Loading your posts...</p>
          ) : userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <h3 className="text-lg font-medium mb-2">
                    <a 
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 ? '...' : ''}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      {post.published ? 'Published' : 'Draft'} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      <button 
                        onClick={() => router.push(`/posts/edit/${post.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:underline"
                        onClick={() => {/* Add delete functionality */}}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
              <button 
                onClick={() => router.push('/posts/create')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Your First Post
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
