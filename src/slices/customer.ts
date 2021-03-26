import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITokenHeaders, ICustomer , ICustomerInfo, ICustomerStatus, ICustomerInterests} from '../interfaces';
/* eslint-disable import/no-cycle */
import { RootState } from '../store';

interface ICurrentCustomer {
  currentCustomer: null | ICustomer;
  // ここ追加
  currentCustomerInfo: null | ICustomerInfo;
  currentCustomerStatus: null | ICustomerStatus;
  currentCustomerInterests: null | ICustomerInterests;
  // ここまで
  headers: null | { headers: ITokenHeaders };
}
// const initialState: ICurrentCustomer = { currentCustomer: null, headers: null };
const initialState: ICurrentCustomer = { currentCustomerInfo: null, currentCustomerStatus: null, currentCustomerInterests: null, currentCustomer: null, headers: null };
const currentCustomerSlice = createSlice({
  name: 'currentCustomer',
  initialState,
  reducers: {
    setCurrentCustomer: (state, action: PayloadAction<ICustomer>) => {
      state.currentCustomer = action.payload;
    },
    setCurrentCustomerInfo: (state, action: PayloadAction<ICustomerInfo>) => {
      state.currentCustomerInfo = action.payload;
    },
    setCurrentCustomerStatus: (state, action: PayloadAction<ICustomerStatus>) => {
      state.currentCustomerStatus = action.payload;
    },
    setCurrentCustomerInterests: (state, action: PayloadAction<ICustomerStatus>) => {
      state.currentCustomerInterests = action.payload;
    },
    setHeaders: (state, action: PayloadAction<ITokenHeaders>) => {
      const {
        'content-type': contentType,
        'access-token': accessToken,
        client,
        uid,
      } = action.payload;
      state.headers = {
        headers: {
          'content-type': contentType,
          'access-token': accessToken,
          client,
          uid,
        },
      };
    },
    customerRemove: (state) => {
      state.currentCustomer = null;
      state.currentCustomerInfo = null;
      state.currentCustomerStatus = null;
      state.currentCustomerInterests = null;
      state.headers = null;
    },
  },
});

export const selectCurrentCustomer = (state: RootState): null | ICustomer =>
  state.currentCustomer.currentCustomer;
export const selectCurrentCustomerInfos = (state: RootState): null | ICustomer =>
  state.currentCustomer.currentCustomerInfo;
export const selectCurrentCustomerInterests = (state: RootState): null | ICustomer =>
  state.currentCustomer.currentCustomerInterests;
export const selectCustomerHeaders = (
  state: RootState
): null | { headers: ITokenHeaders } => state.currentCustomer.headers;
// export const { setCurrentCustomer, setHeaders, customerRemove } = currentCustomerSlice.actions;
export const { setCurrentCustomer, setCurrentCustomerInfo, setCurrentCustomerStatus, setCurrentCustomerInterests, setHeaders, customerRemove } = currentCustomerSlice.actions;
export default currentCustomerSlice.reducer;