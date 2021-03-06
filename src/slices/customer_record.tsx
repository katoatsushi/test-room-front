import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICustomerRecord } from '../interfaces';
import { RootState } from '../store';

interface ICustomerRecords {
  customerRecords:  null | ICustomerRecord[];
}

const initialState: ICustomerRecords = { customerRecords: null};

const customerRecordsSlice = createSlice({
  name: 'customerRecords',
  initialState,
  reducers: {
    setCustomerRecords: (state, action: PayloadAction<ICustomerRecord[]>) => {
      state.customerRecords = action.payload;
    },
    customerRecordRemove: (state) => {
      state.customerRecords = null;
    },
  },
});

export const getCustomerRecords = (state: RootState): null | ICustomerRecord[] =>
  state.customerRecord.customerRecords;
export const { setCustomerRecords, customerRecordRemove } = customerRecordsSlice.actions;
export default customerRecordsSlice.reducer;