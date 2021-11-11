import { createSlice } from '@reduxjs/toolkit';

const initialStore = {
  store: {
    StoreId: '',
    Email: '',
    Username: '',
    StoreName: '',
    Phone: '',
    IdentityId: '',
    AccountBank: '',
    ProvinceCode: '',
    DistrictCode: '',
    WardCode: '',
    AddressDetail: '',
    Picture: '',
    Status: '',
  },
  token: '',
};

const Store = createSlice({
  name: 'Store',
  initialState: initialStore,
  reducers: {
    login: (state, action) => {
      // const newProduct = action.payload;
        return {...action.payload}
    },

    logout: () => {
        // const newProduct = action.payload;
        return initialStore;
    },

    update: (state, action) => {
      // const newProduct = action.payload;
      return {...action.payload};
  },
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = Store;
export const { login,  logout, update} = actions;
export default reducer;