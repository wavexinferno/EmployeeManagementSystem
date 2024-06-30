//const API_URL = 'https://your-api-url/api'; // Replace with your API URL
const API_URL = process.env.REACT_APP_API_URL
interface User {
  username: string;
  password: string;
}

const login = async (user: User) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (data.token) {
    setToken(data.token);
  }
  return data;
};

const getToken = (): string | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

const setToken = (token: string) => {
  localStorage.setItem('user', JSON.stringify({ token }));
};

const clearToken = () => {
  localStorage.removeItem('user');
};const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

const register = async (user: User): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/login/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return await response.json();

  } catch (error) {
    throw new Error('Registration failed');
  }
};

export default {
  login,
  getToken,
  setToken,
  clearToken,
  getCurrentUser,
  register,
  logout
};
