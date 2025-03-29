import React, { useState,useEffect } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import ActivitySummary from './ActivitySummary';
import GradientButton from '../ui/GradientButton';
import CertificateForm from './CertificateForm';
import { Toaster } from "@/components/ui/toaster";
import CertificatesList from './CertificatesList';


const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    totalPoints: 0,
    recentActivities: 0,
    rank: 0,
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9000/api/certificates/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);
  const filterOptions = [
    { value: null, label: 'All Types' },
    { value: 'course', label: 'Courses' },
    { value: 'event', label: 'Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'coding', label: 'Coding' },
    { value: 'project', label: 'Projects' },
  ];
  
  const handleAddCertificate = () => {
    setShowForm(true);
    setSelectedFormType('');
  };
  
  const handleFormTypeSelect = (type) => {
    setSelectedFormType(type);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedFormType('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Your Certification Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your certifications and achievements</p>
        </div>
        <GradientButton onClick={handleAddCertificate}>
          <Plus size={16} className="mr-1" />
          Add Activity
        </GradientButton>
      </div>
      
      <ActivitySummary stats={stats} />
      
      {showForm && (
        <div className="w-full animate-scale-in">
          <CertificateForm 
            selectedType={selectedFormType} 
            onSelectType={handleFormTypeSelect} 
            onClose={handleCloseForm} 
          />
        </div>
      )}
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value === '' ? null : e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              {filterOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <CertificatesList 
          searchQuery={searchQuery}
          filterType={filterType}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Dashboard;
