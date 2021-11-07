import { createSlice } from '@reduxjs/toolkit';

const initialStore = {
  store: {
    StoreId: '',
    Email: '',
    Username: '',
    StoreName: '',
    Phone: '',
    FirstIdentity: '',
    SecondIdentity: '',
    AccountBank: '',
    ProvinceCode: '',
    DistrictCode: '',
    WardCode: '',
    AddressDetail: '',
    Picture: '',
    Status: '',
  },
  bank: '',
  identity: '',
};

const Store = createSlice({
  name: 'Store',
  initialState: initialStore,
  reducers: {
    create: (state, action) => {
      // const newProduct = action.payload;
        return {...action.payload}
    },

    refresh: () => {
        // const newProduct = action.payload;
        return initialStore;
    },

    update: (state, action) => {
      // const newProduct = action.payload;
      return {...state, ...action.payload};
  },
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = Store;
export const { create,  refresh, update} = actions;
export default reducer;