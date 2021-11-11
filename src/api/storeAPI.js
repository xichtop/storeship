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
  }

}

export default storeApi;