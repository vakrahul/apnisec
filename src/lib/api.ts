import axios from 'axios';

// 1. Create the Axios Client
const apiClient = axios.create({
  baseURL: '/api', // This automatically adds /api to all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. REQUEST INTERCEPTOR (The "Security Guard")
// This runs before EVERY request to automatically attach your Token.
apiClient.interceptors.request.use(
  (config) => {
    // Read token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, attach it to the header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR (Optional but good for debugging)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server says "401 Unauthorized", we can auto-logout here if we want
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('token'); 
      // We usually handle the redirect in the UI (DashboardPage), so we just reject here
    }
    return Promise.reject(error);
  }
);

// 4. THE API OBJECT
export const api = {
  // --- AUTHENTICATION ---

  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    // 1. Clear Local Storage
    localStorage.removeItem('token');
    // 2. Optional: Tell server to blacklist token (if implemented)
    // await apiClient.post('/auth/logout'); 
    return Promise.resolve();
  },

  // --- USER DATA ---

  // Used by Dashboard to welcome the user
  getMe: async () => {
    // We assume you might create a route like /api/user/me
    // If you don't have this route yet, you can also return the user from localStorage if you saved it there.
    // For now, let's assume the endpoint exists or you are using the login response.
    
    // TEMPORARY FIX: If you don't have a /me endpoint, 
    // you can rely on the data returned during Login.
    const response = await apiClient.get('/auth/me'); 
    return response.data;
  },

  // --- ISSUES MANAGEMENT ---

  getIssues: async () => {
    const response = await apiClient.get('/issues');
    return response.data;
  },

  createIssue: async (data: any) => {
    const response = await apiClient.post('/issues', data);
    return response.data;
  },

  // This is the NEW function for the Dropdown Menu
  updateIssueStatus: async (id: string, status: string) => {
    // Sends a PATCH request with the ID and new Status
    const response = await apiClient.patch('/issues', { id, status });
    return response.data;
  },

  deleteIssue: async (id: string) => {
    const response = await apiClient.delete(`/issues?id=${id}`);
    return response.data;
  }
};