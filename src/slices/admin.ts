import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITokenHeaders, IAdmin } from '../interfaces';
/* eslint-disable import/no-cycle */
import { RootState } from '../store';

interface ICurrentAdmin {
  currentAdmin: null | IAdmin;
  headers: null | { headers: ITokenHeaders };
}
const initialState: ICurrentAdmin = { currentAdmin: null, headers: null };

const currentAdminSlice = createSlice({
  name: 'currentAdmin',
  initialState,
  reducers: {
    setCurrentAdmin: (state, action: PayloadAction<IAdmin>) => {
      state.currentAdmin = action.payload;
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
    adminRemove: (state) => {
      state.currentAdmin = null;
      state.headers = null;
    },
  },
});


export const selectCurrentAdmin = (state: RootState): null | IAdmin =>
  state.currentAdmin.currentAdmin;
export const selectAdminHeaders = (
  state: RootState
): null | { headers: ITokenHeaders } => state.currentAdmin.headers;
export const { setCurrentAdmin, setHeaders, adminRemove } = currentAdminSlice.actions;
export default currentAdminSlice.reducer;