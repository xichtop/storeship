import axiosClient from "./axiosClient";

const districtApi = {
  index: () => {
    const url = '/districts/';
    return axiosClient.get(url);
  },

  getByProvice: (provinceid) => {
    const url = `/districts/getbyprovince/${provinceid}`;
    return axiosClient.get(url);
  },
}

export default districtApi;