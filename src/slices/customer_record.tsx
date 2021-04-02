import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICustomerRecord } from '../interfaces';
import { RootState } from '../store';

interface ICustomerRecords {
  customerRecords: ICustomerRecord[] | null;
}

const initialState: ICustomerRecords = { customerRecords: null};

const customerRecordsSlice = createSlice({
  name: 'customerRecords',
  initialState,
  reducers: {
    setCustomerRecords: (state, action: PayloadAction<ICustomerRecord[]>) => {
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

export const getCustomerRecords = (state: RootState): null | ICustomerRecord[] =>
  state.customerRecord.customerRecords;
export const { setCustomerRecords, customerRecordRemove } = customerRecordsSlice.actions;
export default customerRecordsSlice.reducer;