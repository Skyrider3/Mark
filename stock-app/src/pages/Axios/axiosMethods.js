import axios from "axios";

export const axiosPost = async (url, body, headers) => {
    return await axios.post(url, body,  {headers: {...headers, "ngrok-skip-browser-warning": "true"}});
};

export const axiosGet = async (url, headers) => {
    return await axios.get(url, {headers: {...headers, "ngrok-skip-browser-warning": "true"}});
}

export const axiosGetWithParams = async (url, params, headers) => {
    return await axios.get(url, params , {headers: {...headers, "ngrok-skip-browser-warning": "true"}});
}