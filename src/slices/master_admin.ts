import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITokenHeaders, IMasterAdmin } from '../interfaces';
/* eslint-disable import/no-cycle */
import { RootState } from '../store';

interface ICurrentMasterAdmin {
  currentMasterAdmin: null | IMasterAdmin;
  headers: null | { headers: ITokenHeaders };
}
const initialState: ICurrentMasterAdmin = { currentMasterAdmin: null, headers: null };

const currentMasterAdminSlice = createSlice({
  name: 'currentMasterAdmin',
  initialState,
  reducers: {
    setCurrentMasterAdmin: (state, action: PayloadAction<IMasterAdmin>) => {
      state.currentMasterAdmin = action.payload;
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
    masterAdminRemove: (state) => {
      state.currentMasterAdmin = null;
      state.headers = null;
    },
  },
});


export const selectCurrentMasterAdmin = (state: RootState): null | IMasterAdmin =>
  state.currentMasterAdmin.currentMasterAdmin;
export const selectMasterAdminHeaders = (
  state: RootState
): null | { headers: ITokenHeaders } => state.currentMasterAdmin.headers;
export const { setCurrentMasterAdmin, setHeaders, masterAdminRemove } = currentMasterAdminSlice.actions;
export default currentMasterAdminSlice.reducer;