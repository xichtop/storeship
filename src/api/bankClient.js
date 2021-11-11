import axios from 'axios';
// import queryString from 'query-string';

const bankClient = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "https://api.vietqr.io/v1/",
  headers: {
    'content-type': 'application/json',
  },
  // paramsSerializer: params => queryString.stringify(params),
});


bankClient.interceptors.request.use((config) => {
  return config;
});

bankClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }

  return response;
}, (error) => {
  // Handle errors
  throw error;
});  

export default bankClient;