import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITokenHeaders, ICustomer , ICustomerInfo, ICustomerStatus, IMyInterests} from '../interfaces';
import { RootState } from '../store';

interface ICurrentCustomer {
  currentCustomer: null | ICustomer;
  currentCustomerInfo: null | ICustomerInfo;

  currentCustomerStatus: null | ICustomerStatus;

  currentCustomerInterests: null | IMyInterests[];
  headers: null | { headers: ITokenHeaders };
}

// state.currentCustomer.currentCustomerStatus

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
    setCurrentCustomerInterests: (state, action: PayloadAction<IMyInterests[]>) => {
      state.currentCustomerInterests = action.payload;
    },
    setHeaders: (state, action: PayloadAction<ITokenHeaders>) => {
      // access-tokenが空の時は過去のaccess-tokenをprevAccessTokenに代入
      const prevAccessToken = state.headers?.headers["access-token"] || "";
      const {
        'content-type': contentType,
        'access-token': accessToken,
        client,
        uid,
      } = action.payload;
      
      state.headers = {
        headers: {
          'content-type': contentType,
          'access-token': accessToken || prevAccessToken,
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

// state == combineReducers
export const selectCurrentCustomer = (state: RootState): null | ICustomer =>
  state.currentCustomer.currentCustomer;
export const selectCurrentCustomerInfos = (state: RootState): null | ICustomerInfo =>
  state.currentCustomer.currentCustomerInfo;
export const selectCurrentCustomerInterests = (state: RootState): null | IMyInterests[] =>
  state.currentCustomer.currentCustomerInterests;
export const selectCurrentCustomerStatus = (state: RootState): null | ICustomerStatus =>
  state.currentCustomer.currentCustomerStatus;

export const selectCustomerHeaders = (
  state: RootState
): null | { headers: ITokenHeaders } => state.currentCustomer.headers;
export const { setCurrentCustomer, setCurrentCustomerInfo, 
                setCurrentCustomerStatus, setCurrentCustomerInterests, 
                setHeaders, customerRemove } = currentCustomerSlice.actions;
export default currentCustomerSlice.reducer;