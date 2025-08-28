'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Table, 
  Eye, 
  Settings, 
  TrendingUp, 
  User, 
  Briefcase, 
  Award, 
  GraduationCap,
  Star,
  X,
  RefreshCw,
  Download
} from 'lucide-react';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

export default function ResultsScreen() {
  const searchParams = useSearchParams();
  const executionId = searchParams.get('executionId');
  const useCaseGroupId = searchParams.get('useCaseGroupId');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [showHistoryDetailsPopup, setShowHistoryDetailsPopup] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null);

  // Enhanced mock data for demonstration - shows data even when server is not working
  const getMockResults = () => {
    return [
          {
            id: 1,
            email: 'john.doe@example.com',
            workExperienceScore: 85,
            skillScore: 92,
            certificatesScore: 78,
            educationScore: 88,
            overallScore: 86,
            history: [
           { 
             date: '2024-01-15', 
             workExperienceScore: 82, 
             skillScore: 89, 
             certificatesScore: 75, 
             educationScore: 85, 
             overallScore: 83,
             details: {
               workExperience: {
                 prompt: 'Analyze the candidate\'s work experience for software development roles, focusing on relevant technical skills, project complexity, team collaboration, and industry experience.',
                 parameters: {
                   yearsOfExperience: { value: 5, weight: 0.25, importance: 'High' },
                   relevantTechnologies: { value: ['JavaScript', 'React', 'Node.js', 'Python'], weight: 0.30, importance: 'Critical' },
                   projectComplexity: { value: 'Medium to High', weight: 0.20, importance: 'High' },
                   teamSize: { value: '5-15 members', weight: 0.15, importance: 'Medium' },
                   industryExperience: { value: 'Tech/Finance', weight: 0.10, importance: 'Medium' }
                 },
                 breakdown: {
                   technicalSkills: 85,
                   projectManagement: 78,
                   problemSolving: 82,
                   communication: 80,
                   leadership: 75
                 }
               },
               skills: {
                 prompt: 'Evaluate the candidate\'s technical skills and competencies, including programming languages, frameworks, tools, and soft skills relevant to software development.',
                 parameters: {
                   programmingLanguages: { value: ['JavaScript', 'Python', 'Java', 'SQL'], weight: 0.35, importance: 'Critical' },
                   frameworks: { value: ['React', 'Node.js', 'Express', 'Django'], weight: 0.25, importance: 'High' },
                   tools: { value: ['Git', 'Docker', 'AWS', 'Jenkins'], weight: 0.20, importance: 'High' },
                   softSkills: { value: ['Communication', 'Problem Solving', 'Teamwork'], weight: 0.15, importance: 'Medium' },
                   certifications: { value: ['AWS Certified Developer', 'Scrum Master'], weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   frontendDevelopment: 92,
                   backendDevelopment: 88,
                   databaseManagement: 85,
                   devOps: 82,
                   agileMethodologies: 90
                 }
               },
               certificates: {
                 prompt: 'Assess the candidate\'s professional certifications and training, considering relevance to the role, recency, and industry recognition.',
                 parameters: {
                   relevantCertifications: { value: ['AWS Certified Developer', 'Scrum Master'], weight: 0.40, importance: 'High' },
                   certificationRecency: { value: 'Within 2 years', weight: 0.25, importance: 'Medium' },
                   industryRecognition: { value: 'Well-recognized', weight: 0.20, importance: 'Medium' },
                   trainingPrograms: { value: ['Udemy', 'Coursera'], weight: 0.10, importance: 'Low' },
                   continuingEducation: { value: 'Active', weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   cloudCertifications: 80,
                   agileCertifications: 75,
                   technicalCertifications: 70,
                   softSkillTraining: 78,
                   industrySpecific: 72
                 }
               },
               education: {
                 prompt: 'Review the candidate\'s educational background and qualifications, considering degree relevance, institution quality, and academic performance.',
                 parameters: {
                   degreeLevel: { value: 'Bachelor\'s in Computer Science', weight: 0.35, importance: 'High' },
                   institutionQuality: { value: 'Top 100 University', weight: 0.25, importance: 'Medium' },
                   gpa: { value: 3.6, weight: 0.20, importance: 'Medium' },
                   relevantCourses: { value: ['Data Structures', 'Algorithms', 'Software Engineering'], weight: 0.15, importance: 'High' },
                   academicProjects: { value: 'Relevant', weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   computerScience: 88,
                   mathematics: 82,
                   softwareEngineering: 85,
                   dataStructures: 90,
                   algorithms: 87
                 }
               }
             }
           },
           { 
             date: '2024-01-10', 
             workExperienceScore: 80, 
             skillScore: 87, 
             certificatesScore: 73, 
             educationScore: 83, 
             overallScore: 81,
             details: {
               workExperience: {
                 prompt: 'Analyze the candidate\'s work experience for software development roles, focusing on relevant technical skills, project complexity, team collaboration, and industry experience.',
                 parameters: {
                   yearsOfExperience: { value: 4, weight: 0.25, importance: 'High' },
                   relevantTechnologies: { value: ['JavaScript', 'React', 'Node.js'], weight: 0.30, importance: 'Critical' },
                   projectComplexity: { value: 'Medium', weight: 0.20, importance: 'High' },
                   teamSize: { value: '3-8 members', weight: 0.15, importance: 'Medium' },
                   industryExperience: { value: 'Tech', weight: 0.10, importance: 'Medium' }
                 },
                 breakdown: {
                   technicalSkills: 82,
                   projectManagement: 75,
                   problemSolving: 80,
                   communication: 78,
                   leadership: 72
                 }
               },
               skills: {
                 prompt: 'Evaluate the candidate\'s technical skills and competencies, including programming languages, frameworks, tools, and soft skills relevant to software development.',
                 parameters: {
                   programmingLanguages: { value: ['JavaScript', 'Python', 'SQL'], weight: 0.35, importance: 'Critical' },
                   frameworks: { value: ['React', 'Node.js', 'Express'], weight: 0.25, importance: 'High' },
                   tools: { value: ['Git', 'Docker'], weight: 0.20, importance: 'High' },
                   softSkills: { value: ['Communication', 'Problem Solving'], weight: 0.15, importance: 'Medium' },
                   certifications: { value: ['AWS Certified Developer'], weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   frontendDevelopment: 88,
                   backendDevelopment: 85,
                   databaseManagement: 82,
                   devOps: 78,
                   agileMethodologies: 86
                 }
               },
               certificates: {
                 prompt: 'Assess the candidate\'s professional certifications and training, considering relevance to the role, recency, and industry recognition.',
                 parameters: {
                   relevantCertifications: { value: ['AWS Certified Developer'], weight: 0.40, importance: 'High' },
                   certificationRecency: { value: 'Within 1 year', weight: 0.25, importance: 'Medium' },
                   industryRecognition: { value: 'Well-recognized', weight: 0.20, importance: 'Medium' },
                   trainingPrograms: { value: ['Udemy'], weight: 0.10, importance: 'Low' },
                   continuingEducation: { value: 'Active', weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   cloudCertifications: 75,
                   agileCertifications: 70,
                   technicalCertifications: 68,
                   softSkillTraining: 75,
                   industrySpecific: 70
                 }
               },
               education: {
                 prompt: 'Review the candidate\'s educational background and qualifications, considering degree relevance, institution quality, and academic performance.',
                 parameters: {
                   degreeLevel: { value: 'Bachelor\'s in Computer Science', weight: 0.35, importance: 'High' },
                   institutionQuality: { value: 'Top 100 University', weight: 0.25, importance: 'Medium' },
                   gpa: { value: 3.5, weight: 0.20, importance: 'Medium' },
                   relevantCourses: { value: ['Data Structures', 'Algorithms'], weight: 0.15, importance: 'High' },
                   academicProjects: { value: 'Some relevant', weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   computerScience: 85,
                   mathematics: 80,
                   softwareEngineering: 82,
                   dataStructures: 87,
                   algorithms: 84
                 }
               }
             }
           },
           { 
             date: '2024-01-05', 
             workExperienceScore: 78, 
             skillScore: 85, 
             certificatesScore: 70, 
             educationScore: 80, 
             overallScore: 78,
             details: {
               workExperience: {
                 prompt: 'Analyze the candidate\'s work experience for software development roles, focusing on relevant technical skills, project complexity, team collaboration, and industry experience.',
                 parameters: {
                   yearsOfExperience: { value: 3, weight: 0.25, importance: 'High' },
                   relevantTechnologies: { value: ['JavaScript', 'React'], weight: 0.30, importance: 'Critical' },
                   projectComplexity: { value: 'Low to Medium', weight: 0.20, importance: 'High' },
                   teamSize: { value: '2-5 members', weight: 0.15, importance: 'Medium' },
                   industryExperience: { value: 'Tech', weight: 0.10, importance: 'Medium' }
                 },
                 breakdown: {
                   technicalSkills: 80,
                   projectManagement: 72,
                   problemSolving: 78,
                   communication: 75,
                   leadership: 68
                 }
               },
               skills: {
                 prompt: 'Evaluate the candidate\'s technical skills and competencies, including programming languages, frameworks, tools, and soft skills relevant to software development.',
                 parameters: {
                   programmingLanguages: { value: ['JavaScript', 'Python'], weight: 0.35, importance: 'Critical' },
                   frameworks: { value: ['React'], weight: 0.25, importance: 'High' },
                   tools: { value: ['Git'], weight: 0.20, importance: 'High' },
                   softSkills: { value: ['Communication'], weight: 0.15, importance: 'Medium' },
                   certifications: { value: [], weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   frontendDevelopment: 85,
                   backendDevelopment: 80,
                   databaseManagement: 78,
                   devOps: 72,
                   agileMethodologies: 82
                 }
               },
               certificates: {
                 prompt: 'Assess the candidate\'s professional certifications and training, considering relevance to the role, recency, and industry recognition.',
                 parameters: {
                   relevantCertifications: { value: [], weight: 0.40, importance: 'High' },
                   certificationRecency: { value: 'N/A', weight: 0.25, importance: 'Medium' },
                   industryRecognition: { value: 'N/A', weight: 0.20, importance: 'Medium' },
                   trainingPrograms: { value: ['Udemy'], weight: 0.10, importance: 'Low' },
                   continuingEducation: { value: 'Limited', weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   cloudCertifications: 65,
                   agileCertifications: 68,
                   technicalCertifications: 70,
                   softSkillTraining: 72,
                   industrySpecific: 65
                 }
               },
               education: {
                 prompt: 'Review the candidate\'s educational background and qualifications, considering degree relevance, institution quality, and academic performance.',
                 parameters: {
                   degreeLevel: { value: 'Bachelor\'s in Computer Science', weight: 0.35, importance: 'High' },
                   institutionQuality: { value: 'Top 200 University', weight: 0.25, importance: 'Medium' },
                   gpa: { value: 3.4, weight: 0.20, importance: 'Medium' },
                   relevantCourses: { value: ['Data Structures'], weight: 0.15, importance: 'High' },
                   academicProjects: { value: 'Basic', weight: 0.05, importance: 'Low' }
                 },
                 breakdown: {
                   computerScience: 82,
                   mathematics: 78,
                   softwareEngineering: 80,
                   dataStructures: 85,
                   algorithms: 80
                 }
               }
             }
           }
            ],
            configs: {
              workExperience: { prompt: 'Analyze work experience for software development roles', score: 85 },
              skills: { prompt: 'Evaluate technical skills and competencies', score: 92 },
              certificates: { prompt: 'Assess professional certifications and training', score: 78 },
              education: { prompt: 'Review educational background and qualifications', score: 88 }
            }
          },
          {
            id: 2,
            email: 'jane.smith@example.com',
            workExperienceScore: 90,
            skillScore: 88,
            certificatesScore: 85,
            educationScore: 92,
            overallScore: 89,
            history: [
              { date: '2024-01-15', workExperienceScore: 88, skillScore: 86, certificatesScore: 83, educationScore: 90, overallScore: 87 },
              { date: '2024-01-10', workExperienceScore: 85, skillScore: 84, certificatesScore: 80, educationScore: 88, overallScore: 84 }
            ],
            configs: {
              workExperience: { prompt: 'Analyze work experience for project management roles', score: 90 },
              skills: { prompt: 'Evaluate leadership and management skills', score: 88 },
              certificates: { prompt: 'Assess project management certifications', score: 85 },
              education: { prompt: 'Review business and management education', score: 92 }
            }
          },
          {
            id: 3,
            email: 'mike.johnson@example.com',
            workExperienceScore: 75,
            skillScore: 82,
            certificatesScore: 70,
            educationScore: 78,
            overallScore: 76,
            history: [
              { date: '2024-01-15', workExperienceScore: 73, skillScore: 80, certificatesScore: 68, educationScore: 76, overallScore: 74 }
            ],
            configs: {
              workExperience: { prompt: 'Analyze work experience for data analysis roles', score: 75 },
              skills: { prompt: 'Evaluate data analysis and statistical skills', score: 82 },
              certificates: { prompt: 'Assess data science certifications', score: 70 },
              education: { prompt: 'Review statistics and mathematics education', score: 78 }
            }
      },
      {
        id: 4,
        email: 'sarah.wilson@example.com',
        workExperienceScore: 88,
        skillScore: 95,
        certificatesScore: 92,
        educationScore: 85,
        overallScore: 90,
        history: [
          { date: '2024-01-15', workExperienceScore: 86, skillScore: 93, certificatesScore: 90, educationScore: 83, overallScore: 88 },
          { date: '2024-01-10', workExperienceScore: 84, skillScore: 91, certificatesScore: 88, educationScore: 81, overallScore: 86 }
        ],
        configs: {
          workExperience: { prompt: 'Analyze work experience for AI/ML engineering roles', score: 88 },
          skills: { prompt: 'Evaluate machine learning and AI competencies', score: 95 },
          certificates: { prompt: 'Assess AI/ML certifications and training', score: 92 },
          education: { prompt: 'Review computer science and AI education', score: 85 }
        }
      },
      {
        id: 5,
        email: 'david.chen@example.com',
        workExperienceScore: 82,
        skillScore: 79,
        certificatesScore: 85,
        educationScore: 90,
        overallScore: 84,
        history: [
          { date: '2024-01-15', workExperienceScore: 80, skillScore: 77, certificatesScore: 83, educationScore: 88, overallScore: 82 }
        ],
        configs: {
          workExperience: { prompt: 'Analyze work experience for cybersecurity roles', score: 82 },
          skills: { prompt: 'Evaluate security and networking skills', score: 79 },
          certificates: { prompt: 'Assess cybersecurity certifications', score: 85 },
          education: { prompt: 'Review information security education', score: 90 }
        }
      }
    ];
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with potential server failure
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to fetch from server if executionId exists
        if (executionId) {
          try {
            // Simulate server call - replace with actual API call
            const response = await fetch(`/api/results?executionId=${executionId}`);
            if (response.ok) {
              const data = await response.json();
              setResults(data);
              setIsUsingMockData(false);
            } else {
              // Server error - fall back to mock data
              console.log('Server not available, using mock data');
              setResults(getMockResults());
              setIsUsingMockData(true);
            }
          } catch (serverError) {
            // Network error - fall back to mock data
            console.log('Server connection failed, using mock data');
            setResults(getMockResults());
            setIsUsingMockData(true);
          }
        } else {
          // No executionId - show mock data for demonstration
          setResults(getMockResults());
          setIsUsingMockData(true);
        }
      } catch (err) {
        console.error('Error loading results:', err);
        // Even if there's an error, show mock data
        setResults(getMockResults());
        setIsUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

      fetchResults();
  }, [executionId]);

  const handleViewHistory = (profile) => {
    setSelectedProfile(profile);
    setShowHistoryPopup(true);
  };

  const handleViewConfig = (profile, configType) => {
    setSelectedProfile(profile);
    setSelectedConfig(configType);
    setShowConfigPopup(true);
  };

  const handleViewHistoryDetails = (historyEntry) => {
    setSelectedHistoryEntry(historyEntry);
    setShowHistoryDetailsPopup(true);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30';
    if (score >= 80) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

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
            <p className="text-gray-300 text-lg">Loading results...</p>
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
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Results</h2>
            <p className="text-red-200 mb-6">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg shadow-red-500/25"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
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
      <AnimatedSection className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.h1 
              className="text-5xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Execution Results
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              AI analysis results for {results.length} profiles with detailed scoring breakdown
            </motion.p>
            {isUsingMockData && (
              <motion.div
                className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl px-6 py-3 mb-6 inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-200 font-medium">Demo Mode: Showing mock data</span>
                </div>
              </motion.div>
            )}
            <motion.div
              className="flex items-center justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <motion.button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Results</span>
              </motion.button>
              <motion.button
                onClick={() => {/* Export functionality */}}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-green-500/25"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                <span>Export Results</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Results Table */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" delay={0.2}>
        <motion.div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-white font-semibold">Profile Name (Email)</th>
                  <th className="text-center py-4 px-6 text-white font-semibold">Work Experience</th>
                  <th className="text-center py-4 px-6 text-white font-semibold">Skills</th>
                  <th className="text-center py-4 px-6 text-white font-semibold">Certificates</th>
                  <th className="text-center py-4 px-6 text-white font-semibold">Education</th>
                  <th className="text-center py-4 px-6 text-white font-semibold">Overall Score</th>
                  <th className="text-center py-4 px-6 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {results.map((profile, index) => (
                    <motion.tr 
                      key={profile.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-all duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{profile.email.split('@')[0]}</p>
                            <p className="text-gray-400 text-sm">{profile.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          onClick={() => handleViewConfig(profile, 'workExperience')}
                          className={`px-4 py-2 rounded-xl border ${getScoreBgColor(profile.workExperienceScore)} ${getScoreColor(profile.workExperienceScore)} font-semibold hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>{profile.workExperienceScore}</span>
                        </motion.button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          onClick={() => handleViewConfig(profile, 'skills')}
                          className={`px-4 py-2 rounded-xl border ${getScoreBgColor(profile.skillScore)} ${getScoreColor(profile.skillScore)} font-semibold hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span>{profile.skillScore}</span>
                        </motion.button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          onClick={() => handleViewConfig(profile, 'certificates')}
                          className={`px-4 py-2 rounded-xl border ${getScoreBgColor(profile.certificatesScore)} ${getScoreColor(profile.certificatesScore)} font-semibold hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Award className="w-4 h-4" />
                          <span>{profile.certificatesScore}</span>
                        </motion.button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          onClick={() => handleViewConfig(profile, 'education')}
                          className={`px-4 py-2 rounded-xl border ${getScoreBgColor(profile.educationScore)} ${getScoreColor(profile.educationScore)} font-semibold hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>{profile.educationScore}</span>
                        </motion.button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className={`px-4 py-2 rounded-xl border ${getScoreBgColor(profile.overallScore)} ${getScoreColor(profile.overallScore)} font-bold text-lg flex items-center space-x-2 mx-auto`}>
                          <Star className="w-5 h-5" />
                          <span>{profile.overallScore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <motion.button
                            onClick={() => handleViewHistory(profile)}
                            className="p-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="View History"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* History Popup */}
      <AnimatePresence>
        {showHistoryPopup && selectedProfile && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile History - {selectedProfile.email}</h2>
                <motion.button
                  onClick={() => setShowHistoryPopup(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {selectedProfile.history.map((entry, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{entry.date}</h3>
                      <div className={`px-3 py-1 rounded-full border ${getScoreBgColor(entry.overallScore)} ${getScoreColor(entry.overallScore)} font-semibold`}>
                        Overall: {entry.overallScore}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Work Experience</p>
                        <p className={`text-lg font-semibold ${getScoreColor(entry.workExperienceScore)}`}>{entry.workExperienceScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Skills</p>
                        <p className={`text-lg font-semibold ${getScoreColor(entry.skillScore)}`}>{entry.skillScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Certificates</p>
                        <p className={`text-lg font-semibold ${getScoreColor(entry.certificatesScore)}`}>{entry.certificatesScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Education</p>
                        <p className={`text-lg font-semibold ${getScoreColor(entry.educationScore)}`}>{entry.educationScore}</p>
                      </div>
                    </div>
                     <div className="flex justify-end mt-4">
                       <motion.button
                         onClick={() => handleViewHistoryDetails(entry)}
                         className="p-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-200"
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         title="View AI Parameters & Scoring Details"
                       >
                         <Settings className="w-4 h-4" />
                       </motion.button>
                     </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Config Popup */}
      <AnimatePresence>
        {showConfigPopup && selectedProfile && selectedConfig && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl max-w-2xl w-full"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedConfig.charAt(0).toUpperCase() + selectedConfig.slice(1)} Configuration
                </h2>
                <motion.button
                  onClick={() => setShowConfigPopup(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Prompt</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedProfile.configs[selectedConfig].prompt}
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Score Result</h3>
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-xl border ${getScoreBgColor(selectedProfile.configs[selectedConfig].score)} ${getScoreColor(selectedProfile.configs[selectedConfig].score)} font-bold text-xl`}>
                      {selectedProfile.configs[selectedConfig].score}
                    </div>
                    <p className="text-gray-300">out of 100</p>
                   </div>
                 </div>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* History Details Popup */}
       <AnimatePresence>
         {showHistoryDetailsPopup && selectedHistoryEntry && (
           <motion.div 
             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.2 }}
           >
             <motion.div 
               className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50 }}
               transition={{ duration: 0.3 }}
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-white">AI Analysis Details - {selectedHistoryEntry.date}</h2>
                 <motion.button
                   onClick={() => setShowHistoryDetailsPopup(false)}
                   className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <X className="w-6 h-6" />
                 </motion.button>
               </div>
               
                               <div className="space-y-6">
                  {/* Work Experience Section */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span>Work Experience Analysis</span>
                      </h3>
                      <div className={`px-4 py-2 rounded-xl border ${getScoreBgColor(selectedHistoryEntry.workExperienceScore)} ${getScoreColor(selectedHistoryEntry.workExperienceScore)} font-bold`}>
                        {selectedHistoryEntry.workExperienceScore}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">AI Prompt</h4>
                      <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl text-lg">
                        Conduct a comprehensive analysis of the candidate's work experience specifically tailored for software development roles. This evaluation should thoroughly examine the depth and breadth of their professional background, with particular emphasis on their technical proficiency, project involvement, and collaborative capabilities. Assess the candidate's experience with modern development technologies, frameworks, and methodologies that are directly relevant to contemporary software development practices. Evaluate their exposure to various project scales, from small team initiatives to large-scale enterprise applications, and their ability to adapt to different development environments and team dynamics. Consider their experience with agile methodologies, version control systems, continuous integration/continuous deployment (CI/CD) pipelines, and cloud computing platforms. Analyze their role in cross-functional teams, their communication skills when working with stakeholders, and their ability to mentor junior developers or contribute to technical decision-making processes. Examine their track record of delivering projects on time and within scope, their problem-solving approach when faced with technical challenges, and their commitment to code quality and best practices. Additionally, evaluate their industry experience, understanding of business requirements, and ability to translate complex technical concepts into business value. This analysis should provide a holistic view of how well their professional experience aligns with the demands of modern software development roles and their potential for growth and leadership within technical teams.
                      </p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>Skills Analysis</span>
                      </h3>
                      <div className={`px-4 py-2 rounded-xl border ${getScoreBgColor(selectedHistoryEntry.skillScore)} ${getScoreColor(selectedHistoryEntry.skillScore)} font-bold`}>
                        {selectedHistoryEntry.skillScore}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">AI Prompt</h4>
                      <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl text-lg">
                        Perform an in-depth evaluation of the candidate's technical skills and competencies across multiple dimensions of software development. This comprehensive assessment should cover their proficiency in programming languages, with particular attention to their mastery of both frontend and backend technologies, database management systems, and cloud computing platforms. Evaluate their expertise in modern frameworks and libraries, their understanding of software architecture patterns, and their ability to design scalable and maintainable code structures. Assess their familiarity with development tools and practices, including version control systems, automated testing frameworks, containerization technologies, and infrastructure as code principles. Examine their knowledge of software development methodologies, their experience with agile practices, and their understanding of DevOps principles and practices. Additionally, evaluate their soft skills, including their ability to communicate complex technical concepts to non-technical stakeholders, their problem-solving approach when faced with challenging technical issues, their capacity for collaborative work in diverse team environments, and their commitment to continuous learning and professional development. Consider their adaptability to new technologies and frameworks, their ability to quickly learn and implement emerging tools and practices, and their understanding of industry best practices and coding standards. This evaluation should provide insights into their technical depth, breadth of knowledge, and potential for growth and innovation within software development teams.
                      </p>
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>Certifications Analysis</span>
                      </h3>
                      <div className={`px-4 py-2 rounded-xl border ${getScoreBgColor(selectedHistoryEntry.certificatesScore)} ${getScoreColor(selectedHistoryEntry.certificatesScore)} font-bold`}>
                        {selectedHistoryEntry.certificatesScore}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">AI Prompt</h4>
                      <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl text-lg">
                        Conduct a thorough assessment of the candidate's professional certifications and continuous learning initiatives, with particular focus on their relevance to software development roles and their commitment to staying current with industry trends and best practices. This evaluation should examine the quality and recognition of their certifications, considering factors such as the reputation of the certifying organizations, the rigor of the certification processes, and the industry-wide recognition of these credentials. Assess the recency of their certifications and their commitment to maintaining current knowledge through ongoing education and training programs. Evaluate the relevance of their certifications to the specific role requirements, including technical certifications in programming languages, frameworks, cloud platforms, and development methodologies. Consider their participation in professional development programs, online learning platforms, workshops, conferences, and other educational initiatives that demonstrate their commitment to continuous improvement. Examine their understanding of emerging technologies and their willingness to invest time and effort in acquiring new skills and knowledge. Additionally, assess their ability to apply certified knowledge in practical scenarios, their contribution to knowledge sharing within teams, and their role in mentoring others based on their certified expertise. This analysis should provide insights into their professional development trajectory, their commitment to excellence in their field, and their potential for contributing to organizational learning and growth.
                      </p>
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <GraduationCap className="w-5 h-5" />
                        <span>Education Analysis</span>
                      </h3>
                      <div className={`px-4 py-2 rounded-xl border ${getScoreBgColor(selectedHistoryEntry.educationScore)} ${getScoreColor(selectedHistoryEntry.educationScore)} font-bold`}>
                        {selectedHistoryEntry.educationScore}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">AI Prompt</h4>
                      <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl text-lg">
                        Perform a comprehensive evaluation of the candidate's educational background and academic qualifications, with particular emphasis on how well their formal education prepares them for software development roles and contributes to their overall professional competence. This assessment should examine the relevance of their degree program to software development, considering factors such as the curriculum's alignment with current industry practices, the depth of technical coursework, and the balance between theoretical knowledge and practical application. Evaluate the quality and reputation of the educational institution, including its ranking, accreditation status, and the rigor of its academic programs. Assess the candidate's academic performance, including their grade point average, class standing, and performance in key technical courses such as data structures, algorithms, software engineering, computer architecture, and database systems. Examine their participation in relevant academic projects, research initiatives, hackathons, coding competitions, and other extracurricular activities that demonstrate practical application of their learning. Consider their exposure to modern development tools and practices during their academic career, their understanding of software development methodologies, and their ability to work effectively in team-based academic projects. Additionally, evaluate their commitment to lifelong learning beyond formal education, including their participation in online courses, workshops, and other professional development activities. This analysis should provide insights into their educational foundation, their capacity for learning and growth, and their potential for contributing to innovative and technically challenging software development projects.
                      </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

