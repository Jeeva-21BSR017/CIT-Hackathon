import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, MapPin, Calendar, Award, Edit, Upload, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import EditProfileDialog from './EditProfileDialog';

const Profile = () => {
  // State for profile data
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    department: '',
    location: '',
    joinedDate: '',
    totalPoints: 0,
    rank: 0,
    bio: '',
    aoi: [],
    recentCertificates: [],
    profileImage: '',
  });

  // State for AI recommendations
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Derived values for level-up progress
  const pointsToLevel = 500;
  const currentPoints = profileData.totalPoints;
  const currentLevel = Math.floor(currentPoints / pointsToLevel) + 1;
  const levelProgress = currentPoints % pointsToLevel;
  const progressPercentage = (levelProgress / pointsToLevel) * 100;
  const nextLevel = currentLevel + 1;

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result; // Base64 encoded image
        setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
        localStorage.setItem('profileImage', imageUrl); // Save to localStorage
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  // Helper function to extract recommendations by label using regex
  const extractRecommendation = (text, label) => {
    const regex = new RegExp(`- \\*\\*${label}:\\*\\*\\s*(.*?)(?=\\n- \\*\\*|$)`, 'is');
    const match = text.match(regex);
    return match ? match[1].trim() : 'No recommendation available.';
  };

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedProfile = localStorage.getItem('profileData');
        const storedLocation = localStorage.getItem('location');
        const storedProfileImage = localStorage.getItem('profileImage');
        if (storedProfile) {
          setProfileData(JSON.parse(storedProfile));
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
        setProfileData({
          username: data.user?.username || '',
          email: data.user?.email || '',
          department: data.user?.department || '',
          location: storedLocation || '',
          joinedDate: data.user?.joinedDate || '',
          totalPoints: data.user?.totalPoints || 0,
          rank: data.user?.rank || 0,
          bio: data.user?.bio || '',
          aoi: Array.isArray(data.user?.aoi) ? data.user.aoi : [],
          recentCertificates: Array.isArray(data.user?.recentCertificates) ? data.user.recentCertificates : [],
          profileImage: storedProfileImage || '',
        });
        localStorage.setItem('profileData', JSON.stringify(data.user));
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login if token is invalid or missing
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch AI recommendations when profile data changes
  useEffect(() => {
    const fetchAiSuggestions = async () => {
      const prompt = `
        You are an AI career coach and level-up advisor.
        Based on the user's profile below, provide three personalized recommendations to advance their skills and career, each clearly labeled as follows:
        - **Next Step:** A specific, actionable step they can take immediately (e.g., start a project, enroll in a course).
        - **Career Insight:** A broader perspective on how their skills and interests align with potential career paths.
        - **Skill Boost:** A targeted skill or area to focus on for growth.
        - important: Make sure you reply with label words ("Next Step", "Career Insight", "Skill Boost"), useful for message extraction.
        User Profile:
        - Department: ${profileData.department}
        - Bio: ${profileData.bio}
        - Interests: ${profileData.aoi.join(', ')}
        - Recent Certifications: ${profileData.recentCertificates.map(cert => cert.name).join(', ')}

        Ensure each recommendation is concise, directly tied to their profile, and aligns with their interests.
      `;

      try {
        const response = await fetch('http://localhost:9000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt }),
        });
        const data = await response.json();
        if (data.reply) {
          const reply = data.reply;
          const nextStep = extractRecommendation(reply, 'Next Step');
          const careerInsight = extractRecommendation(reply, 'Career Insight');
          const skillBoost = extractRecommendation(reply, 'Skill Boost');
          setAiSuggestions([nextStep, careerInsight, skillBoost]);
        }
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
        setAiSuggestions(['Error loading recommendations. Please try again later.']);
      }
    };

    fetchAiSuggestions();
  }, [profileData]);

  // Handle profile save
  const handleSaveProfile = async (newData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      localStorage.setItem('location', newData.location);
      if (newData.profileImage) {
        localStorage.setItem('profileImage', newData.profileImage);
      }

      const response = await fetch('http://localhost:9000/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setProfileData({
        ...updatedUser.user,
        location: newData.location,
        profileImage: newData.profileImage,
      });
      localStorage.setItem('profileData', JSON.stringify(updatedUser.user));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Your Level-Up Profile</h1>
          <p className="text-gray-600">Manage your profile, track progress, and achieve new milestones</p>
        </div>
        <GradientButton variant="outline" onClick={() => setIsEditDialogOpen(true)}>
          <Edit size={16} className="mr-1" />
          Edit Profile
        </GradientButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Picture and Points */}
          <GlassCard className="text-center py-8">
            <div className="relative mx-auto w-24 h-24 rounded-full bg-gray-100 mb-4 flex items-center justify-center">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleProfilePhotoUpload}
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <Upload size={14} />
              </button>
            </div>
            <h2 className="text-xl font-semibold">{profileData.username}</h2>
            <p className="text-gray-600">{profileData.department}</p>
            <div className="mt-6 flex justify-center items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mx-auto w-max">
              <Award size={16} className="mr-2" />
              {profileData.totalPoints} Points • Rank #{profileData.rank}
            </div>
          </GlassCard>

          {/* Level-Up Progress Card */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Level-Up Progress</h3>
            <p className="text-gray-600 mb-2">Level {currentLevel} → Level {nextLevel}</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progressPercentage.toFixed(0)}% towards Level {nextLevel}</p>
          </GlassCard>

          {/* Contact Information */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-3 text-gray-400" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase size={16} className="mr-3 text-gray-400" />
                <span>{profileData.department}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-3 text-gray-400" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-3 text-gray-400" />
                <span>Joined {profileData.joinedDate}</span>
              </div>
            </div>
          </GlassCard>

          {/* Interests */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {(profileData.aoi || []).map((interest, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendations */}
          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">AI Recommendations</h3>
              <Link to="/ai-recommendations" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                View Full Page <ExternalLink size={14} className="ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${index === 0
                      ? 'border-green-100 bg-green-50'
                      : index === 1
                        ? 'border-blue-100 bg-blue-50'
                        : 'border-purple-100 bg-purple-50'
                      }`}
                  >
                    <h4
                      className={`font-medium ${index === 0 ? 'text-green-800' : index === 1 ? 'text-blue-800' : 'text-purple-800'
                        }`}
                    >
                      {index === 0 ? 'Next Step' : index === 1 ? 'Career Insight' : 'Skill Boost'}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${index === 0 ? 'text-green-700' : index === 1 ? 'text-blue-700' : 'text-purple-700'
                        }`}
                    >
                      {suggestion}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Loading AI recommendations...</p>
              )}
            </div>
          </GlassCard>

          {/* About Me */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">About Me</h3>
            <p className="text-gray-600">{profileData.bio}</p>
          </GlassCard>

          {/* Recent Certifications */}
          <GlassCard>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold">Recent Certifications</h3>
    <a
  href="#"
  onClick={(e) => e.preventDefault()}
  className="text-sm text-blue-600 hover:text-blue-700"
>
  View All
</a>
  </div>
  <div className="space-y-4">
    {(profileData.recentCertificates || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sort most recent first
      .slice(0, 3) // take only the first three certificates
      .map((cert) => (
        <div
          key={cert.id}
          className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
        >
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">{cert.name}</h4>
              <p className="text-sm text-gray-500">{cert.issuer}</p>
            </div>
            <div className="text-sm text-gray-500">{cert.date}</div>
          </div>
        </div>
      ))}
  </div>
</GlassCard>
        </div>
      </div>

      {isEditDialogOpen && (
        <EditProfileDialog
          profileData={profileData}
          onSave={handleSaveProfile}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;