import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

// Hook up your real auth token here once a backend/auth service is connected,
// e.g. instance.interceptors.request.use(config => { ... attach token ... })
const useAxiosSecure = () => {
    return instance;
};

export default useAxiosSecure;
