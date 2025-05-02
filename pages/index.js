import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { postsAPI } from '../lib/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsAPI.getAll();
        setPosts(data);
      } catch (error) {
        console.error('fetch posts failed:', error);
        setError('Failed to fetch posts, please try again later');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <Layout title="Home | Birdie Blog">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Latest Articles</h1>
        
        {loading ? (
          <p className="text-center py-10">Loading articles...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-10">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center py-10">No articles yet</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h2 className="text-2xl font-semibold mb-2">
                  <Link href={`/posts/${post.id}`} className="text-blue-600 hover:text-blue-800">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">
                  Posted by {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-4">
                  {post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}
                </p>
                <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                  Read more &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}