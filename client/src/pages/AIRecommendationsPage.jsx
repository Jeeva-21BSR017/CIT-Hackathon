import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, ChevronLeft, BookOpen, Code, Brain, Compass, Filter, X, ExternalLink } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const RecommendationDetailsModal = ({ recommendation, onClose }) => {
  if (!recommendation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{recommendation.title}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-1 text-sm rounded-full ${
              recommendation.relevance === 'high'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {recommendation.relevance === 'high' ? 'High Match' : 'Medium Match'}
            </span>
            <span className="font-medium">{recommendation.provider}</span>
            <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}
            </span>
            <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-800">{recommendation.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Skills You'll Develop</h3>
            <div className="flex flex-wrap gap-2">
              {recommendation.skillsTargeted.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Completion Time</h3>
            <p className="text-gray-800">{recommendation.estimatedCompletion}</p>
          </div>
          
          <div className="pt-4 flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-50">
              Close
            </button>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(recommendation.title + ' ' + recommendation.provider)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              Find Resource <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIRecommendationsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');

  // User profile state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    department: '',
    bio: '',
    aoi: [],
    recentCertificates: [],
    totalPoints: 0
  });

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);

  // Separate loading states for user data and recommendations
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.category === activeFilter);

  // Configuration options
  const [config, setConfig] = useState({
    showBeginner: true,
    showIntermediate: true,
    showAdvanced: true,
    prioritizeCourses: false,
    focusOnCareerGrowth: true,
    updateFrequency: 'weekly',
    maxRecommendations: 3
  });

  // Add a new state for the selected recommendation
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  
  // Reference to store user preferences between sessions
  const preferencesRef = useRef(null);

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setUserDataLoading(true);
      try {
        const storedProfile = localStorage.getItem('profileData');
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setProfileData(parsedProfile);
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:9000/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const userData = {
          username: data.user?.username || '',
          email: data.user?.email || '',
          department: data.user?.department || '',
          bio: data.user?.bio || '',
          aoi: Array.isArray(data.user?.aoi) ? data.user.aoi : [],
          recentCertificates: Array.isArray(data.user?.recentCertificates) ? data.user.recentCertificates : [],
          totalPoints: data.user?.totalPoints || 0,
        };

        setProfileData(userData);
        fetchAiRecommendations(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please login again.",
        });
        navigate('/login');
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  // Load saved preferences when component mounts
  useEffect(() => {
    const savedPreferences = localStorage.getItem('aiRecommendationPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setConfig(prev => ({
          ...prev,
          ...parsedPreferences
        }));
        
        // Store the parsed preferences in the ref for future comparisons
        preferencesRef.current = parsedPreferences;
      } catch (e) {
        console.error('Error parsing saved preferences:', e);
      }
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    // Skip the initial render
    if (preferencesRef.current) {
      localStorage.setItem('aiRecommendationPreferences', JSON.stringify(config));
    }
    
    // Update the ref with current values
    preferencesRef.current = config;
  }, [config]);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Show toast notification
    toast({
      title: "Preference Updated",
      description: "Your AI recommendation preferences have been saved.",
    });
    
    // Optionally refresh recommendations immediately when certain preferences change
    if (['showBeginner', 'showIntermediate', 'showAdvanced', 'focusOnCareerGrowth'].includes(key)) {
      // Set a short timeout to allow the state to update first
      setTimeout(() => fetchAiRecommendations(), 100);
    }
  };

  // Function to create a recommendation object
  const createRecommendationObject = (title, provider, category, difficulty, relevance, description, skills, timeframe, id) => {
    return {
      id,
      title,
      provider,
      category,
      difficulty,
      relevance,
      description,
      skillsTargeted: skills,
      estimatedCompletion: timeframe,
      tags: skills.slice(0, 2)
    };
  };

  // Fetch AI-generated recommendations
  const fetchAiRecommendations = async (userData = profileData) => {
    setRecommendationsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;
    
    // Set initial recommendations while we wait for API response
    if (recommendations.length === 0) {
      const initialRecommendations = createFallbackRecommendations(userData);
      setRecommendations(initialRecommendations);
    }

    while (retryCount <= maxRetries) {
      try {
        const difficultyPreferences = [
          config.showBeginner ? 'beginner' : null,
          config.showIntermediate ? 'intermediate' : null,
          config.showAdvanced ? 'advanced' : null
        ].filter(Boolean);

        // Create an optimized prompt for our existing API
        const prompt = `
          Create ${config.maxRecommendations} personalized learning recommendations for a user with the following profile:
          
          - Department: ${userData.department || 'Technology/IT'}
          - Bio: ${userData.bio || 'Professional seeking career advancement'}
          - Interests: ${userData.aoi?.join(', ') || 'Technology, Professional Development'}
          - Recent Certifications: ${(userData.recentCertificates || []).map(cert => cert.name || cert).join(', ')}
          
          Additional requirements:
          - Difficulty level focus: ${difficultyPreferences.length > 0 ? difficultyPreferences.join(', ') : 'all levels'}
          - Primary focus: ${config.focusOnCareerGrowth ? 'Career Growth' : 'Personal Interest'}
          ${activeFilter !== 'all' ? `- ONLY include recommendations in the category: ${activeFilter}` : '- Include a mix of courses, certifications, projects, and events'}
          
          Format your response EXACTLY as a JSON array of objects with these fields: title, provider, category, difficulty, relevance, description, skills (as array), timeframe.
          IMPORTANT: Respond ONLY with the JSON array, no other text.
        `;

        console.log(`Fetching AI recommendations (attempt ${retryCount + 1})...`);

        try {
          // Use our existing API
          const response = await fetch('http://localhost:9000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt }),
            signal: AbortSignal.timeout(15000) // 15 second timeout
          });

          if (!response.ok) {
            throw new Error(`API error (${response.status})`);
          }

          const data = await response.json();
          
          if (!data.reply) {
            throw new Error('Empty response from AI service');
          }

          // Clean up the response to extract JSON
          const cleanedReply = data.reply
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
            
          // Try to find and parse the JSON array
          let recommendationsData;
          
          try {
            // First try direct JSON parsing
            recommendationsData = JSON.parse(cleanedReply);
          } catch (e) {
            // Then try to extract the JSON array using regex
            const jsonMatch = cleanedReply.match(/\[\s*\{[\s\S]*\}\s*\]/m);
            if (jsonMatch) {
              recommendationsData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('Could not extract valid JSON from response');
            }
          }
          
          // Ensure we have an array
          if (!Array.isArray(recommendationsData)) {
            if (recommendationsData && recommendationsData.recommendations && 
                Array.isArray(recommendationsData.recommendations)) {
              recommendationsData = recommendationsData.recommendations;
            } else {
              throw new Error('Response is not an array');
            }
          }
          
          if (recommendationsData.length > 0) {
            // Format the recommendations
            const formattedRecommendations = recommendationsData.map((rec, index) => 
              createRecommendationObject(
                rec.title || `Recommendation ${index + 1}`,
                rec.provider || 'Recommended Platform',
                rec.category || (activeFilter !== 'all' ? activeFilter : getDefaultCategory(index)),
                rec.difficulty || 'intermediate',
                rec.relevance || 'high',
                rec.description || 'Personalized recommendation based on your profile.',
                Array.isArray(rec.skills) ? rec.skills : ['Skill Development'],
                rec.timeframe || 'Flexible',
                index + 1
              )
            );
            
            setRecommendations(formattedRecommendations);
            
            toast({
              title: "Recommendations Updated",
              description: `${formattedRecommendations.length} personalized recommendations generated.`,
              variant: "default"
            });
            
            return; // Success!
          } else {
            throw new Error('No recommendations in response');
          }
        } catch (apiError) {
          console.warn(`API call attempt ${retryCount + 1} failed:`, apiError);
          
          // If we're on the last retry, throw to trigger fallback
          if (retryCount === maxRetries) throw apiError;
        }
        
        // Retry logic with exponential backoff
        retryCount++;
        if (retryCount <= maxRetries) {
          const delay = 1000 * Math.pow(2, retryCount);
          console.log(`Retrying in ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error('All recommendation fetching attempts failed:', error);
        
        if (recommendations.length === 0) {
          toast({
            title: "Using Default Recommendations",
            description: "Could not generate personalized recommendations. Please try again later.",
            variant: "default"
          });
          
          const fallbackRecommendations = createFallbackRecommendations(userData);
          setRecommendations(fallbackRecommendations);
        } else {
          toast({
            title: "Using Current Recommendations",
            description: "Could not refresh at this time.",
            variant: "default"
          });
        }
        break;
      }
    }
    
    setRecommendationsLoading(false);
  };

  // Helper function to create fallback recommendations
  const createFallbackRecommendations = (userData) => {
    // Get user interests or defaults
    const userInterests = userData.aoi?.length > 0 
      ? userData.aoi 
      : ['Professional Development', 'Technology'];
    
    const department = userData.department || 'Professional';
    
    // Define unique providers for variety
    const providers = [
      'Coursera',
      'edX',
      'Udemy',
      'LinkedIn Learning',
      'Pluralsight',
      'DataCamp',
      'Codecademy',
      'Udacity',
      'FutureLearn',
      'Skillshare'
    ];

    // Define unique categories and their specific details
    const categories = [
      {
        type: 'course',
        difficulties: ['beginner', 'intermediate', 'advanced'],
        timeframes: ['4 weeks', '6 weeks', '8 weeks', '12 weeks'],
        skills: [
          ['Technical Skills', 'Problem Solving', 'Industry Knowledge'],
          ['Data Analysis', 'Critical Thinking', 'Business Acumen'],
          ['Leadership', 'Communication', 'Strategic Planning'],
          ['Programming', 'System Design', 'Architecture'],
          ['Machine Learning', 'Data Science', 'AI Fundamentals']
        ]
      },
      {
        type: 'certification',
        difficulties: ['intermediate', 'advanced'],
        timeframes: ['2 months', '3 months', '4 months', '6 months'],
        skills: [
          ['Professional Certification', 'Industry Standards', 'Best Practices'],
          ['Technical Expertise', 'Project Management', 'Quality Assurance'],
          ['Cloud Computing', 'DevOps', 'Infrastructure'],
          ['Cybersecurity', 'Risk Management', 'Compliance'],
          ['Data Engineering', 'Big Data', 'Analytics']
        ]
      },
      {
        type: 'project',
        difficulties: ['intermediate', 'advanced'],
        timeframes: ['1 month', '2 months', '3 months', 'Flexible'],
        skills: [
          ['Full Stack Development', 'API Design', 'Database Management'],
          ['Mobile App Development', 'UI/UX Design', 'Cross-platform'],
          ['Machine Learning', 'Data Visualization', 'Model Deployment'],
          ['Cloud Architecture', 'Microservices', 'Containerization'],
          ['Blockchain', 'Smart Contracts', 'DApp Development']
        ]
      },
      {
        type: 'event',
        difficulties: ['beginner', 'intermediate'],
        timeframes: ['1 day', '2 days', '3 days', '1 week'],
        skills: [
          ['Networking', 'Industry Knowledge', 'Communication'],
          ['Workshop Participation', 'Hands-on Learning', 'Collaboration'],
          ['Conference Attendance', 'Expert Talks', 'Panel Discussions'],
          ['Hackathon', 'Team Building', 'Problem Solving'],
          ['Webinar Series', 'Professional Development', 'Skill Building']
        ]
      }
    ];

    // Generate unique recommendations
    const recommendations = [];
    const usedProviders = new Set();
    const usedCategories = new Set();

    for (let i = 0; i < 10; i++) {
      // Select a unique provider
      let provider;
      do {
        provider = providers[Math.floor(Math.random() * providers.length)];
      } while (usedProviders.has(provider));
      usedProviders.add(provider);

      // Select a unique category
      let category;
      do {
        category = categories[Math.floor(Math.random() * categories.length)];
      } while (usedCategories.has(category.type));
      usedCategories.add(category.type);

      // Reset used categories if all have been used
      if (usedCategories.size === categories.length) {
        usedCategories.clear();
      }

      // Select random difficulty and timeframe
      const difficulty = category.difficulties[Math.floor(Math.random() * category.difficulties.length)];
      const timeframe = category.timeframes[Math.floor(Math.random() * category.timeframes.length)];
      const skills = category.skills[Math.floor(Math.random() * category.skills.length)];

      // Generate a unique title based on category and interests
      const interest = userInterests[Math.floor(Math.random() * userInterests.length)];
      const title = `${interest} ${category.type.charAt(0).toUpperCase() + category.type.slice(1)}: ${department} Focus`;

      recommendations.push({
        id: i + 1,
        title,
        provider,
        category: category.type,
        difficulty,
        relevance: Math.random() > 0.3 ? 'high' : 'medium',
        description: `A comprehensive ${category.type} focused on ${interest.toLowerCase()} and ${department.toLowerCase()}, designed to enhance your professional development.`,
        skillsTargeted: skills,
        estimatedCompletion: timeframe,
        tags: [interest, department]
      });
    }

    return recommendations;
  };

  // Helper to get a default category based on index
  const getDefaultCategory = (index) => {
    const categories = ['course', 'certification', 'project', 'event'];
    return categories[index % categories.length];
  };

  // Add this function to handle opening the recommendation details
  const handleOpenRecommendation = (recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  // Add this function to handle closing the recommendation details
  const handleCloseRecommendation = () => {
    setSelectedRecommendation(null);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {userDataLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <Button variant="ghost" className="mr-2" onClick={() => navigate(-1)}>
              <ChevronLeft size={16} />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold">AI Recommendations</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <GlassCard>
                <div className="flex items-center mb-4">
                  <Sliders size={18} className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">Configuration</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Skill Level</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={config.showBeginner ? "default" : "outline"}
                        onClick={() => handleConfigChange('showBeginner', !config.showBeginner)}
                      >
                        Beginner
                      </Button>
                      <Button
                        size="sm"
                        variant={config.showIntermediate ? "default" : "outline"}
                        onClick={() => handleConfigChange('showIntermediate', !config.showIntermediate)}
                      >
                        Intermediate
                      </Button>
                      <Button
                        size="sm"
                        variant={config.showAdvanced ? "default" : "outline"}
                        onClick={() => handleConfigChange('showAdvanced', !config.showAdvanced)}
                      >
                        Advanced
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Recommendations Focus</label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      value={config.focusOnCareerGrowth ? 'career' : 'interest'}
                      onChange={(e) => handleConfigChange('focusOnCareerGrowth', e.target.value === 'career')}
                    >
                      <option value="career">Career Growth</option>
                      <option value="interest">Personal Interest</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Update Frequency</label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      value={config.updateFrequency}
                      onChange={(e) => handleConfigChange('updateFrequency', e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Max Recommendations</label>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={config.maxRecommendations}
                      onChange={(e) => handleConfigChange('maxRecommendations', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 text-right">{config.maxRecommendations} items</div>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => fetchAiRecommendations()}
                      disabled={recommendationsLoading}
                    >
                      <Brain size={14} className="mr-1" />
                      {recommendationsLoading ? "Refreshing..." : "Refresh Recommendations"}
                    </Button>
                  </div>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="flex items-center mb-4">
                  <Compass size={18} className="mr-2 text-purple-500" />
                  <h3 className="text-lg font-semibold">Learning Path</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Your personalized learning path based on your profile, interests, and career goals.
                </p>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-800 text-sm">
                    Suggested Path: {profileData.department || 'Professional Development'}
                  </h4>
                  <p className="text-xs text-purple-700 mt-1">
                    Your progress: {Math.min(100, Math.floor((profileData.totalPoints || 0) / 10))}% complete
                  </p>
                  <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.floor((profileData.totalPoints || 0) / 10))}%` }}
                    ></div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              <GlassCard>
                <div className="flex items-center mb-4">
                  <Filter size={18} className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">Filters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeFilter === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                  >
                    All Recommendations
                  </Button>
                  <Button
                    variant={activeFilter === 'course' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter('course')}
                  >
                    <BookOpen size={14} className="mr-1" />
                    Courses
                  </Button>
                  <Button
                    variant={activeFilter === 'certification' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter('certification')}
                  >
                    <Code size={14} className="mr-1" />
                    Certifications
                  </Button>
                  <Button
                    variant={activeFilter === 'project' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter('project')}
                  >
                    <Brain size={14} className="mr-1" />
                    Projects
                  </Button>
                  <Button
                    variant={activeFilter === 'event' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter('event')}
                  >
                    <Compass size={14} className="mr-1" />
                    Events
                  </Button>
                </div>
              </GlassCard>

              <div className="space-y-4">
                {recommendationsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Generating personalized recommendations...</p>
                  </div>
                ) : filteredRecommendations.length > 0 ? (
                  filteredRecommendations.slice(0, config.maxRecommendations).map(recommendation => (
                    <GlassCard key={recommendation.id} className="animate-fade-in overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-start justify-between">
                        <div
                          className="absolute top-0 left-0 h-full w-1.5"
                          style={{
                            backgroundColor:
                              recommendation.category === 'course'
                                ? '#3b82f6'
                                : recommendation.category === 'certification'
                                ? '#10b981'
                                : recommendation.category === 'project'
                                ? '#8b5cf6'
                                : '#f59e0b'
                          }}
                        ></div>
                        <div className="pl-2 mb-4 md:mb-0 md:mr-6 flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                recommendation.relevance === 'high'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {recommendation.relevance === 'high' ? 'High Match' : 'Medium Match'}
                            </span>
                            <span className="text-gray-500 text-sm">{recommendation.provider}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg leading-tight mb-2">{recommendation.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 hover:line-clamp-none">
                            {recommendation.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {recommendation.skillsTargeted.map((skill, index) => (
                              <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end min-w-[130px] md:pl-4">
                          <div className="text-sm text-gray-500 mb-2 w-full text-left md:text-right">
                            Est. completion:<br className="hidden md:inline" />{' '}
                            <span className="font-medium">{recommendation.estimatedCompletion}</span>
                          </div>
                          <GradientButton 
                            size="sm" 
                            className="w-full md:w-auto mt-1"
                            onClick={() => handleOpenRecommendation(recommendation)}
                          >
                            View Details
                          </GradientButton>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No recommendations found for your current filter settings.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveFilter('all');
                        fetchAiRecommendations();
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Recommendation details modal */}
          {selectedRecommendation && (
            <RecommendationDetailsModal 
              recommendation={selectedRecommendation} 
              onClose={handleCloseRecommendation} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default AIRecommendationsPage;