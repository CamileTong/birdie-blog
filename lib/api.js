const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
console.log("API URL:", API_URL); // For debugging

// get token from local storage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// common fetch function
async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

// user authentication API
export const authAPI = {
  register: (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // save token and user info after login
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};

// post API
export const postsAPI = {
  getAll: () => {
    return fetchAPI('/posts');
  },
  
  getById: (id) => {
    return fetchAPI(`/posts/${id}`);
  },
  
  create: (postData) => {
    return fetchAPI('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  
  update: (id, postData) => {
    return fetchAPI(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },
  
  delete: (id) => {
    return fetchAPI(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// user API
export const userAPI = {
  getProfile: () => {
    return fetchAPI('/user/profile');
  },
  
  updateProfile: (userData) => {
    return fetchAPI('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};