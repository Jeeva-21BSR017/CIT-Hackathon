import React, { useEffect, useState } from 'react';
import { Calendar, Award, ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const CertificateCard = ({ certificate, className }) => {
  const [localCertificates, setLocalCertificates] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('localCertificates');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Merge with backend data
  const mergedCertificate = {
    ...(certificate || {}),
    ...(localCertificates.find(lc => lc.id === certificate?._id) || {})
  };

  const typePoints = {
    course: 50,
    event: 30,
    workshop: 40,
    coding: 60,
    project: 70
  };

  const points = typePoints[mergedCertificate.type] || 0;

  useEffect(() => {
    if (!certificate) return;
    
    const certId = certificate._id || certificate.id;
    const existing = localCertificates.find(lc => lc.id === certId);
    
    if (!existing) {
      const newLocalCerts = [
        ...localCertificates,
        {
          id: certId,
          ...certificate,
          points
        }
      ];
      localStorage.setItem('localCertificates', JSON.stringify(newLocalCerts));
      setLocalCertificates(newLocalCerts);
    }
  }, [certificate]);

  const typeColor = {
    course: 'bg-blue-50 text-blue-600',
    event: 'bg-purple-50 text-purple-600',
    workshop: 'bg-teal-50 text-teal-600',
    coding: 'bg-indigo-50 text-indigo-600',
    project: 'bg-cyan-50 text-cyan-600'
  };

  if (!mergedCertificate.type) return null;

  return (
    <div className={cn(
      "bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group",
      className
    )}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor[mergedCertificate.type]}`}>
            {mergedCertificate.type.charAt(0).toUpperCase() + mergedCertificate.type.slice(1)}
          </span>
          <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
            <Award size={14} className="mr-1" />
            {points} pts
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
          {mergedCertificate.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">
          Issued by {mergedCertificate.issuer}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar size={14} className="mr-1" />
          {new Date(mergedCertificate.completionDate).toLocaleDateString()}
        </div>
      </div>

      {/* View Certificate Section */}
      {mergedCertificate.certificateUrl && (
        <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-between items-center">
          {mergedCertificate.certificateUrl.endsWith('.pdf') ? (
            <a href={`http://localhost:9000/${mergedCertificate.certificateUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors flex items-center">
              <FileText size={16} className="mr-1" /> View Certificate (PDF)
            </a>
          ) : (
            <img src={`http://localhost:9000/${mergedCertificate.certificateUrl}`} alt="Certificate" className="w-full h-auto rounded-lg border mt-2" />
          )}
        </div>
      )}
    </div>
  );
};

export default CertificateCard;
