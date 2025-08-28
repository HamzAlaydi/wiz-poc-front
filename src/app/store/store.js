import { configureStore } from '@reduxjs/toolkit';
import useCasesReducer from './slices/useCasesSlice';
import useCaseConfigReducer from './slices/useCaseConfigSlice';

export const store = configureStore({
  reducer: {
    useCases: useCasesReducer,
    useCaseConfig: useCaseConfigReducer,
  },
});
