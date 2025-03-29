
import React from 'react';
import { BarChart3, Medal, Award, Calendar } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const ActivitySummary = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard className="flex items-center">
        <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
          <Medal size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Certificates</p>
          <p className="text-2xl font-semibold">{stats.totalCertificates}</p>
        </div>
      </GlassCard>
      
      <GlassCard className="flex items-center">
        <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600">
          <Award size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Points</p>
          <p className="text-2xl font-semibold">{stats.totalPoints}</p>
        </div>
      </GlassCard>
      
      <GlassCard className="flex items-center">
        <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 text-purple-600">
          <Calendar size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Recent Activities</p>
          <p className="text-2xl font-semibold">{stats.recentActivities}</p>
        </div>
      </GlassCard>
      
      <GlassCard className="flex items-center">
        <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 text-orange-600">
          <BarChart3 size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Department Rank</p>
          <p className="text-2xl font-semibold">#{stats.rank}</p>
        </div>
      </GlassCard>
    </div>
  );
};

export default ActivitySummary;
