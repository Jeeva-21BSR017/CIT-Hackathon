
import React from 'react';
import { Award, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const LeaderboardCard = ({ student, position }) => {
  const rankChange = student.previousRank - student.rank;
  
  let rankIndicator;
  if (rankChange > 0) {
    rankIndicator = (
      <div className="flex items-center text-green-600 text-xs">
        <ArrowUp size={14} />
        <span>{rankChange}</span>
      </div>
    );
  } else if (rankChange < 0) {
    rankIndicator = (
      <div className="flex items-center text-red-600 text-xs">
        <ArrowDown size={14} />
        <span>{Math.abs(rankChange)}</span>
      </div>
    );
  } else {
    rankIndicator = (
      <div className="flex items-center text-gray-400 text-xs">
        <Minus size={14} />
      </div>
    );
  }
  
  const positionStyles = {
    1: "bg-yellow-50 border-yellow-200 text-yellow-700",
    2: "bg-gray-50 border-gray-200 text-gray-700",
    3: "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200">
      <div className="p-5 flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${positionStyles[position] || "bg-blue-50 border-blue-200 text-blue-600"} mr-4`}>
          {position}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center">
            <h3 className="font-semibold">{student.name}</h3>
            {rankIndicator}
          </div>
          <p className="text-sm text-gray-500">{student.department}</p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end text-blue-600 font-semibold">
            <Award size={16} className="mr-1" />
            {student.points}
          </div>
          <p className="text-xs text-gray-500">{student.certificates} certificates</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
