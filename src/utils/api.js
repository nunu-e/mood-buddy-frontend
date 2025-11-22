import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://mood-buddy-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("moodbuddy_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("moodbuddy_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (userData) => api.post("/auth/register", userData),

  getMe: () => api.get("/auth/me"),

  updateProfile: (profileData) => api.put("/auth/profile", profileData),

  changePassword: (passwordData) =>
    api.put("/auth/change-password", passwordData),
};

export const moodAPI = {
  getEntries: (params = {}) => api.get("/mood/entries", { params }),

  getEntry: (id) => api.get(`/mood/entries/${id}`),

  createEntry: (entryData) => api.post("/mood/entries", entryData),

  updateEntry: (id, entryData) => api.put(`/mood/entries/${id}`, entryData),

  deleteEntry: (id) => api.delete(`/mood/entries/${id}`),

  getTodayEntry: () => api.get("/mood/entries/today"),

  getStats: (days = 30) => api.get("/mood/stats", { params: { days } }),

  getCalendar: (year, month) =>
    api.get("/mood/calendar", { params: { year, month } }),
};

export default api;
