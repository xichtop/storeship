import axiosClient from "./axiosClient";

const storeApi = {

  login: (item) => {
    const url = '/stores/login';
    return axiosClient.post(url, item);
  },

}

export default storeApi;