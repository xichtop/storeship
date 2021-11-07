import axiosClient from "./axiosClient";

const deliveryApi = {
  index: () => {
    const url = '/deliveries/';
    return axiosClient.get(url);
  },

  getById: (deliveryId, token) => {
    const url = `/deliveries/getbyid/${deliveryId}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getByStore: (storeId) => {
    const url = `/deliveries/getbystore/${storeId}`;
    return axiosClient.get(url);
  },

  getByStoreandStatus: (storeId, status, token) => {
    const url = `/deliveries/getbystore/${storeId}/${status}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  updateStatus: (item, token) => {
    const url = '/deliveries/update';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  statistic: (item, token) => {
    const url = '/deliveries/statistic';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  addItem: (item, token) => {
    const url = '/deliveries/add';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },
}

export default deliveryApi;