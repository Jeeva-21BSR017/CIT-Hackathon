
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import LeaderboardCard from './LeaderboardCard';

// Sample data
const students = [
  {
    id: '1',
    name: 'Emma Johnson',
    department: 'Computer Science',
    points: 2450,
    rank: 1,
    previousRank: 1,
    certificates: 18,
  },
  {
    id: '2',
    name: 'Liam Smith',
    department: 'Computer Science',
    points: 2310,
    rank: 2,
    previousRank: 3,
    certificates: 16,
  },
  {
    id: '3',
    name: 'Olivia Davis',
    department: 'Electrical Engineering',
    points: 2180,
    rank: 3,
    previousRank: 2,
    certificates: 15,
  },
  {
    id: '4',
    name: 'Noah Wilson',
    department: 'Computer Science',
    points: 1980,
    rank: 4,
    previousRank: 5,
    certificates: 14,
  },
  {
    id: '5',
    name: 'Ava Taylor',
    department: 'Information Systems',
    points: 1850,
    rank: 5,
    previousRank: 4,
    certificates: 13,
  },
  {
    id: '6',
    name: 'William Brown',
    department: 'Data Science',
    points: 1720,
    rank: 6,
    previousRank: 7,
    certificates: 12,
  },
  {
    id: '7',
    name: 'Sophia Thomas',
    department: 'Mechanical Engineering',
    points: 1650,
    rank: 7,
    previousRank: 6,
    certificates: 11,
  },
  {
    id: '8',
    name: 'James Miller',
    department: 'Computer Science',
    points: 1580,
    rank: 8,
    previousRank: 10,
    certificates: 10,
  },
  {
    id: '9',
    name: 'Isabella Moore',
    department: 'Information Systems',
    points: 1450,
    rank: 9,
    previousRank: 8,
    certificates: 9,
  },
  {
    id: '10',
    name: 'Benjamin White',
    department: 'Electrical Engineering',
    points: 1380,
    rank: 10,
    previousRank: 9,
    certificates: 9,
  },
];

const departments = [
  { id: 'all', name: 'All Departments' },
  { id: 'cs', name: 'Computer Science' },
  { id: 'ee', name: 'Electrical Engineering' },
  { id: 'is', name: 'Information Systems' },
  { id: 'ds', name: 'Data Science' },
  { id: 'me', name: 'Mechanical Engineering' },
];

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || 
                             (selectedDepartment === 'cs' && student.department === 'Computer Science') ||
                             (selectedDepartment === 'ee' && student.department === 'Electrical Engineering') ||
                             (selectedDepartment === 'is' && student.department === 'Information Systems') ||
                             (selectedDepartment === 'ds' && student.department === 'Data Science') ||
                             (selectedDepartment === 'me' && student.department === 'Mechanical Engineering');
    
    return matchesSearch && matchesDepartment;
  });

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
        
        <div className="flex items-center">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
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
