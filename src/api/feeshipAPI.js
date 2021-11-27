import axiosClient from "./axiosClient";

const feeshipAPI = {

  getAll: (StoreId, token) => {
    const url = `/feeship/getallbystore/${StoreId}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
    });
  },

  payFeeStore: (item, token) => {
    const url = `/feeship/payfeestore`;
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
    });
  }
}

export default feeshipAPI;