import bankClient from "./bankClient";

const bankListApi = {

  index: () => {
    const url = '/banks';
    return bankClient.get(url);
  },

}

export default bankListApi;