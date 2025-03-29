import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, ChevronLeft, BookOpen, Code, Brain, Compass, Filter } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const AIRecommendationsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [interestLevel, setInterestLevel] = useState('intermediate');

  // Store recommendations in state (initial sample data)
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Advanced Deep Learning',
      provider: 'DeepLearning.ai',
      category: 'course',
      difficulty: 'advanced',
      relevance: 'high',
      description: 'This course builds on your machine learning knowledge to explore advanced deep learning techniques, neural networks, and practical applications.',
      skillsTargeted: ['Neural Networks', 'TensorFlow', 'Computer Vision'],
      estimatedCompletion: '8 weeks',
      tags: ['Machine Learning', 'AI']
    },
    {
      id: 2,
      title: 'Cloud Deployment for ML Models',
      provider: 'Google Cloud',
      category: 'certification',
      difficulty: 'intermediate',
      relevance: 'high',
      description: 'Learn how to deploy and scale machine learning models in production environments using cloud infrastructure.',
      skillsTargeted: ['Cloud Computing', 'MLOps', 'Containerization'],
      estimatedCompletion: '4 weeks',
      tags: ['Cloud Computing', 'Machine Learning']
    },
    {
      id: 3,
      title: 'Database Design and Implementation',
      provider: 'MongoDB University',
      category: 'course',
      difficulty: 'beginner',
      relevance: 'medium',
      description: 'Fill your skill gap in database technologies with this comprehensive course on database design principles and implementation strategies.',
      skillsTargeted: ['Database Design', 'NoSQL', 'Data Modeling'],
      estimatedCompletion: '6 weeks',
      tags: ['Databases', 'Web Development']
    },
    {
      id: 4,
      title: 'Attend the Web Development Summit',
      provider: 'WebDevCon',
      category: 'event',
      difficulty: 'all-levels',
      relevance: 'medium',
      description: 'A networking opportunity to connect with professionals and learn about the latest trends in web development.',
      skillsTargeted: ['Networking', 'Industry Knowledge', 'Latest Technologies'],
      estimatedCompletion: '3 days',
      tags: ['Web Development', 'Networking']
    },
    {
      id: 5,
      title: 'Data Science Project: Predictive Analytics',
      provider: 'Kaggle',
      category: 'project',
      difficulty: 'intermediate',
      relevance: 'high',
      description: 'Apply your skills in a real-world project to build a predictive analytics model for customer behavior.',
      skillsTargeted: ['Data Analysis', 'Predictive Modeling', 'Python'],
      estimatedCompletion: 'Flexible',
      tags: ['Data Science', 'Machine Learning']
    },
  ]);

  // Loading state for AI refresh
  const [loading, setLoading] = useState(false);

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
    maxRecommendations: 5
  });

  const handleConfigChange = (key, value) => {
    setConfig({
      ...config,
      [key]: value
    });

    toast({
      title: "Preference Updated",
      description: "Your AI recommendation preferences have been saved.",
    });
  };

  // Function to fetch AI-generated recommendations based on current settings
  const fetchAiRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          filter: activeFilter,
          interestLevel
        }),
      });
      const data = await response.json();
      // Assume the API returns an array in data.recommendations
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        toast({
          title: "Recommendations Refreshed",
          description: "Your AI recommendations have been updated based on your settings.",
        });
      } else {
        toast({
          title: "No Data",
          description: "No recommendations were returned from the AI service.",
        });
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to refresh recommendations.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold">AI Recommendations</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with configuration options */}
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
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Max Recommendations
                </label>
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
                  onClick={fetchAiRecommendations}
                  disabled={loading}
                >
                  <Brain size={14} className="mr-1" />
                  {loading ? "Refreshing..." : "Refresh Recommendations"}
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
              <h4 className="font-medium text-purple-800 text-sm">Suggested Path: Data Scientist</h4>
              <p className="text-xs text-purple-700 mt-1">
                Your progress: 37% complete
              </p>
              <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '37%' }}></div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main content area with recommendations */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filter tabs */}
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

          {/* Recommendations cards */}
          <div className="space-y-4">
            {filteredRecommendations.slice(0, config.maxRecommendations).map((recommendation) => (
              <GlassCard key={recommendation.id} className="animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full mr-2 ${recommendation.relevance === 'high'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}>
                        {recommendation.relevance === 'high' ? 'High Match' : 'Medium Match'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {recommendation.provider}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{recommendation.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {recommendation.skillsTargeted.map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-500 mb-2">
                      Est. completion: {recommendation.estimatedCompletion}
                    </div>
                    <GradientButton size="sm">View Details</GradientButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsPage;
