'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  fetchUseCases, 
  selectFilteredGroups, 
  selectLoading, 
  selectError, 
  selectFilters,
  selectExpandedGroups,
  setSearchTerm, 
  setSelectedGroup, 
  clearFilters,
  toggleGroupExpansion
} from '../store/slices/useCasesSlice';
import { Search, Filter, X, RefreshCw, Users, Briefcase, Calendar, Eye, Settings } from 'lucide-react';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function UseCasesScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const useCaseGroups = useSelector(selectFilteredGroups);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const filters = useSelector(selectFilters);
  const expandedGroups = useSelector(selectExpandedGroups);

  useEffect(() => {
    dispatch(fetchUseCases());
  }, [dispatch]);

  const handleToggleGroupExpansion = (groupId) => {
    dispatch(toggleGroupExpansion(groupId));
  };

  const handleRefresh = () => {
    dispatch(fetchUseCases());
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleGroupFilterChange = (e) => {
    dispatch(setSelectedGroup(e.target.value));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredGroups = useCaseGroups;

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent relative pt-20">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading use cases...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent relative pt-20">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center max-w-md mx-auto p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Data</h2>
            <p className="text-red-200 mb-6">{error}</p>
            <motion.button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg shadow-red-500/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
          >
            Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

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
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.h1 
              className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Use Cases Dashboard
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              AI-powered use cases management and analysis platform
            </motion.p>
            <motion.button
                onClick={handleRefresh}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-semibold">Refresh Data</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Search Bar */}
            <motion.div 
              className="flex-1 max-w-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                 <input
                   type="text"
                  placeholder="Search use cases or groups..."
                   value={filters.searchTerm}
                   onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                />
                {filters.searchTerm && (
                  <motion.button
                    onClick={() => dispatch(setSearchTerm(''))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Filter Controls */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300 font-medium">Filter by Group:</span>
          </div>
                                     <select
                     value={filters.selectedGroup}
                     onChange={handleGroupFilterChange}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              >
                <option value="all" className="bg-gray-800">All Groups</option>
                {useCaseGroups.map((group) => (
                  <option key={group.id} value={group.id} className="bg-gray-800">
                        {group.name}
                      </option>
                    ))}
                  </select>
            </motion.div>
            </div>
        </div>
      </motion.div>

        {/* Results Summary */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <p className="text-gray-300">
              Showing {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''}
              {filters.searchTerm && ` matching "${filters.searchTerm}"`}
            </p>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>Total Use Cases: {filteredGroups.reduce((acc, group) => acc + group.useCases.length, 0)}</span>
          </div>
        </div>
      </motion.div>

        {/* Groups Grid */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredGroups.map((group, index) => (
              <motion.div 
                key={group.id}
                className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-200 shadow-xl hover:shadow-2xl"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 + index * 0.02 }}
                exit={{ opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.15 } }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.15 }
                }}
              >
                <div className="p-8">
                {/* Group Header */}
                  <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                      <motion.h3 
                        className="text-2xl font-bold text-white mb-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.15 }}
                      >
                        {group.name}
                      </motion.h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{group.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                      <motion.div 
                        className={`text-xs font-medium px-3 py-2 rounded-full ${
                      expandedGroups[group.id] 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                      {expandedGroups[group.id] ? 'Expanded' : `${group.useCases.length} use case${group.useCases.length !== 1 ? 's' : ''}`}
                      </motion.div>
                  </div>
                </div>

                {/* Group Metadata */}
                  <div className="flex items-center text-xs text-gray-400 mb-6">
                    <Calendar className="w-4 h-4 mr-2" />
                  <span>Created: {formatDate(group.createdAt)}</span>
                </div>

                {/* Use Cases List */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-200 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                    Use Cases
                  </h4>
                    <AnimatePresence>
                      {(expandedGroups[group.id] ? group.useCases : group.useCases.slice(0, 3)).map((useCase, useCaseIndex) => (
                        <motion.div 
                          key={useCase.id} 
                          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-200"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15, delay: useCaseIndex * 0.02 }}
                          exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                          whileHover={{ x: 3, scale: 1.01 }}
                        >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                              <h5 className="text-sm font-semibold text-white mb-2">{useCase.name}</h5>
                              <p className="text-xs text-gray-300 mb-3">{useCase.description}</p>
                              <div className="flex items-center text-xs text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(useCase.createdAt)}</span>
                          </div>
                        </div>
                            <div className="flex items-center space-x-2">
                              <motion.button 
                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                            <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button 
                                onClick={() => router.push(`/configure?id=${useCase.id}&name=${encodeURIComponent(useCase.name)}&groupId=${group.id}`)}
                                className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-xl transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            title="Configure use case"
                          >
                            <Settings className="w-4 h-4" />
                              </motion.button>
                        </div>
                      </div>
                        </motion.div>
                  ))}
                    </AnimatePresence>
                </div>

                {/* Group Actions */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                  {group.useCases.length > 3 ? (
                      <motion.button
                      onClick={() => handleToggleGroupExpansion(group.id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-semibold flex items-center justify-center shadow-lg shadow-blue-500/25"
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                    >
                      {expandedGroups[group.id] 
                        ? `Show Less (${group.useCases.length - 3} hidden)` 
                        : `Show ${group.useCases.length - 3} More`
                      }
                      </motion.button>
                  ) : (
                      <div className="w-full bg-gray-500/20 text-gray-400 py-3 px-6 rounded-2xl text-sm font-medium text-center">
                      All Use Cases Shown
                      </div>
                  )}
                </div>
              </div>
              </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredGroups.length === 0 && !loading && (
            <motion.div 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center py-16 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold text-white mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  No groups found
                </motion.h3>
                <motion.p 
                  className="text-gray-300 mb-8 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                >
                  {filters.searchTerm 
                    ? `No groups match your search for "${filters.searchTerm}"`
                    : 'No use case groups are available at the moment.'
                  }
                </motion.p>
                {(filters.searchTerm || filters.selectedGroup !== 'all') && (
                  <motion.button
                    onClick={handleClearFilters}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear Filters
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
