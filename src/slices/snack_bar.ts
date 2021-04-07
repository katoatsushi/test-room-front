import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISnackBarInfo } from '../interfaces';
import { RootState } from '../store';

interface ISnackBar {
  info:  null | ISnackBarInfo;
}

const initialState: ISnackBar = { info: null };

const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    setSnackBar: (state, action: PayloadAction<ISnackBarInfo>) => {
      state.info = action.payload;
    },
    snackBarRemove: (state) => {
      state.info = null;
    },
  },
});

export const selectSnackBar = (state: RootState): null | ISnackBarInfo => state.snackBar.info;
export const { setSnackBar, snackBarRemove } = snackBarSlice.actions;
export default snackBarSlice.reducer;