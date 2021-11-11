import axiosClient from "./axiosClient";

const paymentApi = {
  index: () => {
    const url = '/payments/';
    return axiosClient.get(url);
  },

  statistic: (item, token) => {
    const url = '/payments/statistic';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
    });
  },
}

export default paymentApi;