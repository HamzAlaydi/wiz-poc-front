'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  fetchUseCaseConfig, 
  saveUseCaseConfig, 
  selectParameters, 
  selectLoading, 
  selectSaving, 
  selectError, 
  selectSuccess, 
  selectUseCaseId, 
  selectUseCaseName,
  selectUseCaseGroupId,
  addParameter, 
  updateParameter, 
  deleteParameter,
  setUseCaseId,
  setUseCaseName,
  setUseCaseGroupId,
  resetConfig
} from '../store/slices/useCaseConfigSlice';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function UseCaseConfigScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const parameters = useSelector(selectParameters);
  const loading = useSelector(selectLoading);
  const saving = useSelector(selectSaving);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const useCaseId = useSelector(selectUseCaseId);
  const useCaseName = useSelector(selectUseCaseName);
  const useCaseGroupId = useSelector(selectUseCaseGroupId);

  useEffect(() => {
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const groupId = searchParams.get('groupId');
    
    if (id) {
      dispatch(setUseCaseId(id));
      if (groupId) {
        dispatch(setUseCaseGroupId(groupId));
      }
      if (name) {
        dispatch(setUseCaseName(decodeURIComponent(name)));
      }
      dispatch(fetchUseCaseConfig(id));
    } else {
      router.push('/');
    }
    return () => {
      dispatch(resetConfig());
    };
  }, [dispatch, searchParams, router]);

  const handleAddParameter = () => {
    dispatch(addParameter());
  };

  const handleUpdateParameter = (id, field, value) => {
    dispatch(updateParameter({ id, field, value }));
  };

  const handleDeleteParameter = (id) => {
    dispatch(deleteParameter(id));
  };

  const handleSave = () => {
    const config = {
      parameters
    };
    dispatch(saveUseCaseConfig({ useCaseId, useCaseGroupId, config }));
  };

  return (
    <div className="min-h-screen bg-transparent relative pt-20">
      <Navigation />
      
      {/* Header */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.push('/')}
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {useCaseName || 'Configure Use Case'}
                </motion.h1>
                <motion.p 
                  className="text-lg text-gray-300 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Configure input text parameter for this use case
                </motion.p>
              </div>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5" />
              <span className="font-semibold">{saving ? 'Saving...' : 'Save Parameter'}</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-8 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <p className="text-red-200 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              className="mb-8 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-3xl p-6"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-green-200 font-medium">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parameters Section */}
        <motion.div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h2 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              Parameter
            </motion.h2>
            {parameters.length === 0 && (
              <motion.button
                onClick={handleAddParameter}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span className="font-semibold">Add Parameter</span>
              </motion.button>
            )}
          </div>

          {loading ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading parameter...</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {parameters.map((param, index) => (
                  <motion.div 
                    key={param.id}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-200"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 + index * 0.02 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } }}
                    whileHover={{ y: -2, scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <motion.label 
                        className="text-lg font-semibold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.1 + index * 0.02 }}
                      >
                        Input Text Parameter
                      </motion.label>
                      <motion.button
                        onClick={() => handleDeleteParameter(param.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-150"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        title="Delete parameter"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: 0.15 + index * 0.02 }}
                    >
                      <textarea
                        value={param.value || ''}
                        onChange={(e) => handleUpdateParameter(param.id, 'value', e.target.value)}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 min-h-[120px] resize-vertical"
                        placeholder="Enter your input text parameter value..."
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {parameters.length === 0 && !loading && (
                <motion.div 
                  className="text-center py-12 bg-white/5 rounded-2xl border border-white/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Parameter Set</h3>
                  <p className="text-gray-300 mb-6">Add an input text parameter to configure this use case</p>
                  <motion.button
                    onClick={handleAddParameter}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg shadow-blue-500/25"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-semibold">Add Parameter</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
