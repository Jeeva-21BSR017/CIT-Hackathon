import { useEffect, useState } from 'react';
import CertificateCard from './CertificateCard';

const CertificatesList = ({ searchQuery, filterType }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9000/api/certificates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch certificates');

      // Log the raw response text
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid JSON response');
      }

      // Merge with local storage data
      const localCerts = JSON.parse(localStorage.getItem('localCertificates') || '[]');
      const merged = data.map(dbCert => ({
        ...dbCert,
        ...(localCerts.find(lc => lc.id === dbCert._id) || {})
      }));
      
      setCertificates(merged);
      
    } catch (error) {
      console.error('Fetch error:', error);
      // Fallback to local storage if API fails
      const localCerts = JSON.parse(localStorage.getItem('localCertificates') || '[]');
      setCertificates(localCerts);
    } finally {
      setLoading(false);
    }
  };

  fetchCertificates();
}, []);

  // Filter and search logic
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearchQuery = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilterType = filterType ? cert.type === filterType : true;
    
    return matchesSearchQuery && matchesFilterType;
  });

  if (loading) return <div className="text-center py-8">Loading certificates...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredCertificates.length > 0 ? (
        filteredCertificates.map(cert => (
          <CertificateCard 
            key={cert._id || cert.id}
            certificate={cert} 
            className="w-full"
          />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 py-8">
          No certificates found
        </div>
      )}
    </div>
  );
};

export default CertificatesList;
