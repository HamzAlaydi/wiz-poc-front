import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching use cases
export const fetchUseCases = createAsyncThunk(
  'useCases/fetchUseCases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/usecases', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      // Check if response has data
      if (response.data && response.data.status === 'SUCCESS') {
        return response.data;
      } else {
        return rejectWithValue('Invalid response format from server');
      }
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - server took too long to respond');
      }
      
      if (error.response) {
        // Server responded with error status
        return rejectWithValue(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Network error or CORS issue
        return rejectWithValue('Network error - unable to reach the server. This might be due to CORS restrictions when accessing an IP address.');
      } else {
        return rejectWithValue('Failed to fetch use cases: ' + error.message);
      }
    }
  }
);

const initialState = {
  groups: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    selectedGroup: 'all',
  },
  expandedGroups: {}, // Track which groups are expanded to show all use cases
};

const useCasesSlice = createSlice({
  name: 'useCases',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setSelectedGroup: (state, action) => {
      state.filters.selectedGroup = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        selectedGroup: 'all',
    };
    },
    toggleGroupExpansion: (state, action) => {
      const groupId = action.payload;
      if (state.expandedGroups[groupId]) {
        delete state.expandedGroups[groupId];
      } else {
        state.expandedGroups[groupId] = true;
      }
    },
    clearExpandedGroups: (state) => {
      state.expandedGroups = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUseCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUseCases.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchUseCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, setSelectedGroup, clearFilters, toggleGroupExpansion, clearExpandedGroups } = useCasesSlice.actions;

// Selectors
export const selectGroups = (state) => state.useCases.groups;
export const selectLoading = (state) => state.useCases.loading;
export const selectError = (state) => state.useCases.error;
export const selectFilters = (state) => state.useCases.filters;
export const selectExpandedGroups = (state) => state.useCases.expandedGroups;

// Filtered data selector with memoization
export const selectFilteredGroups = createSelector(
  [selectGroups, selectFilters],
  (groups, filters) => {
    const { searchTerm, selectedGroup } = filters;

    return groups.filter((group) => {
      const matchesSearch = searchTerm === '' || 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.useCases.some(useCase => 
          useCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          useCase.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesGroup = selectedGroup === 'all' || group.id.toString() === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }
);

export default useCasesSlice.reducer;
