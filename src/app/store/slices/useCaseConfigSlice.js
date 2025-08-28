import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching use case parameters
export const fetchUseCaseConfig = createAsyncThunk(
  'useCaseConfig/fetchConfig',
  async (useCaseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/usecases/${useCaseId}/params`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });
      
      if (response.data && response.data.status === 'SUCCESS') {
        return response.data;
      } else {
        return rejectWithValue('Invalid response format from server');
      }
    } catch (error) {
      console.error('Params API Error:', error);
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - server took too long to respond');
      }
      
      if (error.response) {
        return rejectWithValue(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        return rejectWithValue('Network error - unable to reach the server.');
      } else {
        return rejectWithValue('Failed to fetch parameters: ' + error.message);
      }
    }
  }
);

// Async thunk for saving use case parameters
export const saveUseCaseConfig = createAsyncThunk(
  'useCaseConfig/saveConfig',
  async ({ useCaseId, useCaseGroupId, config }, { rejectWithValue }) => {
    try {
      // Send the parameter value to the backend
      const payload = {
        paramKey: "input_text",
        paramValue: config.parameters[0]?.value || ''
      };
      
      const response = await axios.patch(`/api/usecases/${useCaseId}/params`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });
      
      if (response.data && response.data.status === 'SUCCESS') {
        return response.data;
      } else {
        return rejectWithValue('Invalid response format from server');
      }
    } catch (error) {
      console.error('Save Params API Error:', error);
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - server took too long to respond');
      }
      
      if (error.response) {
        return rejectWithValue(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        return rejectWithValue('Network error - unable to reach the server.');
      } else {
        return rejectWithValue('Failed to save parameters: ' + error.message);
      }
    }
  }
);

const initialState = {
  useCaseId: null,
  useCaseGroupId: null,
  useCaseName: '',
  parameters: [],
  loading: false,
  saving: false,
  error: null,
  success: null,
};

const useCaseConfigSlice = createSlice({
  name: 'useCaseConfig',
  initialState,
  reducers: {
    setUseCaseId: (state, action) => {
      state.useCaseId = action.payload;
    },
    setUseCaseGroupId: (state, action) => {
      state.useCaseGroupId = action.payload;
    },
    setUseCaseName: (state, action) => {
      state.useCaseName = action.payload;
    },
    addParameter: (state) => {
      // Only allow one parameter
      if (state.parameters.length === 0) {
        const newParam = {
          id: Date.now(),
          value: ''
        };
        state.parameters.push(newParam);
      }
    },
    updateParameter: (state, action) => {
      const { id, field, value } = action.payload;
      const param = state.parameters.find(p => p.id === id);
      if (param) {
        param[field] = value;
      }
    },
    deleteParameter: (state, action) => {
      // Clear all parameters (since we only allow one)
      state.parameters = [];
    },

    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    resetConfig: (state) => {
      state.parameters = [];
      state.error = null;
      state.success = null;
      state.useCaseId = null;
      state.useCaseGroupId = null;
      state.useCaseName = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch configuration
      .addCase(fetchUseCaseConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUseCaseConfig.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        if (data) {
          // Handle the new parameter format
          if (data.paramValue) {
            state.parameters = [{
              id: Date.now(),
              value: data.paramValue
            }];
          } else {
            // If no parameter exists, start with empty array
            state.parameters = [];
          }
        }
        state.error = null;
      })
      .addCase(fetchUseCaseConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save configuration
      .addCase(saveUseCaseConfig.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.success = null;
      })
      .addCase(saveUseCaseConfig.fulfilled, (state, action) => {
        state.saving = false;
        state.success = 'Parameter saved successfully!';
        state.error = null;
      })
      .addCase(saveUseCaseConfig.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

export const {
  setUseCaseId,
  setUseCaseGroupId,
  setUseCaseName,
  addParameter,
  updateParameter,
  deleteParameter,
  clearError,
  clearSuccess,
  resetConfig
} = useCaseConfigSlice.actions;

// Selectors
export const selectUseCaseId = (state) => state.useCaseConfig.useCaseId;
export const selectUseCaseGroupId = (state) => state.useCaseConfig.useCaseGroupId;
export const selectUseCaseName = (state) => state.useCaseConfig.useCaseName;
export const selectParameters = (state) => state.useCaseConfig.parameters;
export const selectLoading = (state) => state.useCaseConfig.loading;
export const selectSaving = (state) => state.useCaseConfig.saving;
export const selectError = (state) => state.useCaseConfig.error;
export const selectSuccess = (state) => state.useCaseConfig.success;

export default useCaseConfigSlice.reducer;
