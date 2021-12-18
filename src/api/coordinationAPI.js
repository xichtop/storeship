import axiosClient from "./axiosClient";

const coordinationAPI = {

  getById: (deliveryId, token) => {
    const url = `/coordinations/getbyid/${deliveryId}`;
    return axiosClient.get(url, {headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
        }   
    });
  },
}

export default coordinationAPI;