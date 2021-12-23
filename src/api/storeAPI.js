import axiosClient from "./axiosClient";

const storeApi = {

  login: (item) => {
    const url = '/stores/login';
    return axiosClient.post(url, item);
  },

  addItem: (item) => {
    const url = '/stores/additem';
    return axiosClient.post(url, item);
  },

  check: (item) => {
    const url = `/stores/check/${item}`;
    return axiosClient.get(url);
  },

  getSizes: (token) => {
    const url = `/stores/getsizes`;
    return axiosClient.get(url, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  },

  getWeights: (token) => {
    const url = `/stores/getweights`;
    return axiosClient.get(url, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  }

}

export default storeApi;