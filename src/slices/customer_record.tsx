import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICustomerRecords } from '../interfaces';
import { RootState } from '../store';

interface ICustomerRecords {
  customerRecords: null | ICustomerRecords;
}
const initialState: ICustomerRecords = { customerRecords: null};

const customerRecordsSlice = createSlice({
  name: 'customerRecords',
  initialState,
  reducers: {
    setCustomerRecords: (state, action: PayloadAction<ICustomerRecords>) => {
     console.log('state',{state}, 'action',{action})
      state.customerRecords = action.payload;
    },
    customerRecordRemove: (state) => {
      console.log('TODO::ここに削除機能をつける',{state})
    //   state.currentCustomer = null;
    //   state.headers = null;
    },
  },
});


export const getCustomerRecords = (state: RootState): null | ICustomerRecords =>
  state.customerRecord.customerRecords;
export const { setCustomerRecords, customerRecordRemove } = customerRecordsSlice.actions;
export default customerRecordsSlice.reducer;