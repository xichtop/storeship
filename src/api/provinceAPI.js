import axiosClient from "./axiosClient";

const provinceApi = {
  index: () => {
    const url = '/provinces/';
    return axiosClient.get(url);
  },

  // get: (id, token) => {
  //   const url = `/provinces/${id}`;
  //   return axiosClient.get(url, {headers: {
  //     "Content-type": "Application/json",
  //     "Authorization": `Bearer ${token}`
  //     }   
  // });
  // },
}

export default provinceApi;