'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUseCases, 
  selectFilteredGroups, 
  selectLoading as selectUseCasesLoading 
} from '../store/slices/useCasesSlice';
import { 
  Upload, 
  FileText, 
  File as FileIcon,
  X, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Download,
  Cloud,
  Zap,
  Shield
} from 'lucide-react';
import Navigation from './Navigation';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { itemVariants, cardVariants, buttonVariants, staggerContainer } from './AnimationVariants';

export default function ExecutionScreen() {
  const dispatch = useDispatch();
  const useCaseGroups = useSelector(selectFilteredGroups);
  const useCasesLoading = useSelector(selectUseCasesLoading);
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [mergedPdf, setMergedPdf] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [isMerging, setIsMerging] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUseCases());
  }, [dispatch]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                         file.type === 'application/msword';
      if (!isValidType) {
        setError(`Invalid file type: ${file.name}. Only PDF and Word documents are supported.`);
        setTimeout(() => setError(null), 3000);
      }
      return isValidType;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      setError(null);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setMergedPdf(null);
    setError(null);
    setSuccess(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const convertWordToPdf = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.4';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(tempDiv);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const pdfBlob = pdf.output('blob');
      return new File([pdfBlob], `${file.name.replace(/\.(doc|docx)$/i, '')}.pdf`, { type: 'application/pdf' });
    } catch (error) {
      console.error('Error converting Word to PDF:', error);
      throw new Error(`Failed to convert ${file.name} to PDF`);
    }
  };

  const processFilesToPdf = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one file');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setIsMerging(true);
    setError(null);
    setSuccess(null);
    setMergedPdf(null);

    try {
      let finalPdfFile;

      if (uploadedFiles.length === 1) {
        const file = uploadedFiles[0];
        
        if (file.type === 'application/pdf') {
          finalPdfFile = file;
          setSuccess('PDF file ready for execution!');
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                   file.type === 'application/msword') {
          finalPdfFile = await convertWordToPdf(file);
          setSuccess('Word document converted to PDF successfully!');
        } else {
          throw new Error('Unsupported file type');
        }
      } else {
        const mergedPdfDoc = await PDFDocument.create();
        
        for (const file of uploadedFiles) {
          if (file.type === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
          } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                     file.type === 'application/msword') {
            const convertedPdfFile = await convertWordToPdf(file);
            const arrayBuffer = await convertedPdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
          } else {
            throw new Error(`Unsupported file type: ${file.name}`);
          }
        }
        
        const mergedPdfBytes = await mergedPdfDoc.save();
        const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        finalPdfFile = new File([mergedPdfBlob], 'merged-document.pdf', { type: 'application/pdf' });
        setSuccess('Files merged successfully!');
      }
      
      setMergedPdf(finalPdfFile);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process files. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMergedPdf = () => {
    if (!mergedPdf) return;
    
    const url = URL.createObjectURL(mergedPdf);
    const link = document.createElement('a');
    link.href = url;
    link.download = mergedPdf.name || 'merged-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const executeUseCase = async () => {
    if (!mergedPdf || !selectedGroupId) {
      setError('Please process files and select a use case group first');
      return;
    }

    setIsExecuting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', mergedPdf);
      formData.append('useCaseGroupId', selectedGroupId);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

      const response = await fetch('http://18.199.124.150:2025/api/v1/execution', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess('Execution completed successfully!');
        // Redirect to results page with execution ID
        setTimeout(() => {
          window.location.href = `/results?executionId=${result.executionId}&useCaseGroupId=${selectedGroupId}`;
        }, 1500);
      } else {
        throw new Error(result.message || 'Execution failed');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Execution failed: ${error.message}`);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
      return <FileText className="w-6 h-6 text-blue-500" />;
    }
    return <FileIcon className="w-6 h-6 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-transparent relative pt-20">
      <Navigation />
      
      {/* Header */}
      <AnimatedSection className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <motion.h1 
                className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                AI Document Execution
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Upload documents, process them with AI, and execute use cases with advanced automation
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Main Content */}
      <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" delay={0.1}>
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
                <AlertCircle className="w-5 h-5 text-red-400" />
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
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-200 font-medium">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="space-y-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* File Upload Section */}
          <motion.div 
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="text-center mb-8">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Cloud className="w-10 h-10 text-blue-400" />
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold text-white mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Upload Documents
              </motion.h2>
              <motion.p 
                className="text-gray-300 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                Upload one or more Word or PDF files to process with AI
              </motion.p>
            </div>

            <motion.div 
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : 'border-white/30 hover:border-white/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-white mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                Drag & Drop Files Here
              </motion.h3>
              <motion.p 
                className="text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                or click to browse your files
              </motion.p>
              <motion.div 
                className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>PDF Files</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Word Documents</span>
                </div>
              </motion.div>
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-5 h-5 mr-2 inline" />
                Select Files
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </motion.div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 1.1 + index * 0.05 }}
                      whileHover={{ x: 3, scale: 1.01 }}
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => removeFile(index)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Process Files Section */}
          {uploadedFiles.length >= 1 && (
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="text-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Zap className="w-8 h-8 text-green-400" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {uploadedFiles.length === 1 ? 'Process File' : 'Process Files'}
                </motion.h2>
                <motion.p 
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {uploadedFiles.length === 1 
                    ? 'Convert or prepare your file for execution' 
                    : 'Convert and merge your uploaded files into a single PDF'
                  }
                </motion.p>
              </div>
              
              <motion.button
                onClick={processFilesToPdf}
                disabled={isMerging}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 font-semibold shadow-lg shadow-green-500/25"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>{uploadedFiles.length === 1 ? 'Process File' : 'Process Files'}</span>
                  </>
                )}
              </motion.button>

              {mergedPdf && (
                <motion.div 
                  className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-green-200 font-semibold">
                          {uploadedFiles.length === 1 ? 'File processed successfully!' : 'Files processed successfully!'}
                        </p>
                        <p className="text-green-300 text-sm">{mergedPdf.name}</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={downloadMergedPdf}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Use Case Group Selection */}
          {mergedPdf && (
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="text-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Shield className="w-8 h-8 text-purple-400" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Select Use Case Group
                </motion.h2>
                <motion.p 
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Choose the use case group to execute with your processed document
                </motion.p>
              </div>
              
              {useCasesLoading ? (
                <div className="flex items-center justify-center space-x-3 py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span className="text-gray-300">Loading use case groups...</span>
                </div>
              ) : (
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-lg"
                >
                  <option value="" className="bg-gray-800">Select a use case group</option>
                  {useCaseGroups.map((group) => (
                    <option key={group.id} value={group.id} className="bg-gray-800">
                      {group.name} ({group.useCases.length} use cases)
                    </option>
                  ))}
                </select>
              )}
            </motion.div>
          )}

          {/* Execute Button */}
          {mergedPdf && selectedGroupId && (
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="text-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-8 h-8 text-orange-400" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Execute AI Processing
                </motion.h2>
                <motion.p 
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Run the execution with your processed document and selected use case group
                </motion.p>
              </div>
              
              <motion.button
                onClick={executeUseCase}
                disabled={isExecuting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-6 px-8 rounded-2xl hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 text-xl font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    <span>Execute AI Processing</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatedSection>
    </div>
  );
}
