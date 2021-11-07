import axiosClient from "./axiosClient";

const wardApi = {
  index: () => {
    const url = '/wards/';
    return axiosClient.get(url);
  },

  getByDistrict: (districtid) => {
    const url = `/wards/getbydistrict/${districtid}`;
    return axiosClient.get(url);
  },
}

export default wardApi;