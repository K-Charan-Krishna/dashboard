import axios from "axios";
import { getAccessToken, setAccessToken, removeAccessToken } from "../utils/token";

const api = axios.create({
    baseURL: "http://localhost:7201/api",
    withCredentials: true
});

api.interceptors.request.use((config) => {

    console.log(config, "in Interceptor request **")

    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(

    (response) => {
        console.log(response, "in the intercepter responce **")
        return response
    },

    async (error) => {

        const originalRequest = error.config;
        console.log(error, "error from responce")

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const res = await axios.post(
                    "http://localhost:7201/api/auth/refresh",
                    {},
                    {
                        withCredentials: true
                    }
                );

                const newAccessToken =
                    res.data.accessToken;

                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (err) {

                removeAccessToken();

                window.location.href = "/login";

                return Promise.reject(err);

            }

        }

        return Promise.reject(error);

    }
);

export default api;