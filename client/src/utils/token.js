const ACCESS_TOKEN = "accessToken";

export const setAccessToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN, token);
};

export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
};

export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN);
};

// Simple authentication check
export const isAuthenticated = () => {
    const token = getAccessToken();
    return !!token; // Returns true if token exists, false otherwise
};

// Complete logout function
export const logout = () => {
    removeAccessToken();
    localStorage.removeItem('user');
};

// Optional: Store user data
export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
    localStorage.removeItem('user');
};