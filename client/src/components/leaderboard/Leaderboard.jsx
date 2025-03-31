import React, { useState } from 'react';
import { Search } from 'lucide-react';
import LeaderboardCard from './LeaderboardCard';

// Sample data
const students = [
  {
    id: '1',
    name: 'Jeeva',
    department: 'MCA',
    points: 500,
    rank: 1,
    previousRank: 1,
    certificates: 18,
  },
  {
    id: '2',
    name: 'Annisha',
    department: 'MCA',
    points: 350,
    rank: 2,
    previousRank: 3,
    certificates: 15,
  },
  {
    id: '3',
    name: 'Jabastin',
    department: 'MCA',
    points: 300,
    rank: 3,
    previousRank: 4,
    certificates: 14,
  },
  {
    id: '4',
    name: 'Dharshini',
    department: 'MCA',
    points: 290,
    rank: 4,
    previousRank: 2,
    certificates: 16,
  },
  {
    id: '5',
    name: 'Jegadeep',
    department: 'MCA',
    points: 280,
    rank: 5,
    previousRank: 5,
    certificates: 13,
  },
  {
    id: '6',
    name: 'Kaviarasu',
    department: 'MCA',
    points: 200,
    rank: 6,
    previousRank: 6,
    certificates: 12,
  },
  {
    id: '7',
    name: 'Ajay kanna',
    department: 'MCA',
    points: 120,
    rank: 7,
    previousRank: 7,
    certificates: 11,
  },
  {
    id: '8',
    name: 'Aravindh Samy',
    department: 'MCA',
    points: 80,
    rank: 8,
    previousRank: 10,
    certificates: 8,
  },
  {
    id: '9',
    name: 'Dinesh',
    department: 'MCA',
    points: 70,
    rank: 9,
    previousRank: 8,
    certificates: 10,
  },
  {
    id: '10',
    name: 'Dhanush',
    department: 'MCA',
    points: 50,
    rank: 10,
    previousRank: 9,
    certificates: 9,
  },
];

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Department Leaderboard</h1>
        <p className="text-gray-600">See who's leading in certifications and achievements</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <LeaderboardCard 
              key={student.id} 
              student={student} 
              position={index + 1} 
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
