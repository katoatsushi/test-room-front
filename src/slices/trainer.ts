import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITokenHeaders, ITrainer, ITrainerInfo } from '../interfaces';
import { RootState } from '../store';

interface ICurrentTrainer {
  currentTrainer: null | ITrainer;
  currentTrainerInfo: null | ITrainerInfo;
  headers: null | { headers: ITokenHeaders };
}
const initialState: ICurrentTrainer = { currentTrainer: null, currentTrainerInfo: null, headers: null };

const currentTrainerSlice = createSlice({
  name: 'currentTrainer',
  initialState,
  reducers: {
    setCurrentTrainer: (state, action: PayloadAction<ITrainer>) => {
      state.currentTrainer = action.payload;
    },
    setCurrentTrainerInfo: (state, action: PayloadAction<ITrainerInfo>) => {
      state.currentTrainerInfo = action.payload;
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
    trainerRemove: (state) => {
      state.currentTrainer = null;
      state.currentTrainerInfo = null;
      state.headers = null;
    },
  },
});


export const selectCurrentTrainer = (state: RootState): null | ITrainer =>
  state.currentTrainer.currentTrainer;
export const selectCurrentTrainerInfos = (state: RootState): null | ITrainerInfo =>
  state.currentTrainer.currentTrainerInfo;
export const selectTrainerHeaders = (
  state: RootState
): null | { headers: ITokenHeaders } => state.currentTrainer.headers;
export const { setCurrentTrainer, setCurrentTrainerInfo, setHeaders, trainerRemove } = currentTrainerSlice.actions;
export default currentTrainerSlice.reducer;