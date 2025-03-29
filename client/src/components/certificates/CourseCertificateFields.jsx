import React from 'react';
import { Award } from 'lucide-react';

const CourseCertificateFields = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="certificateUrl" className="form-label block mb-3">Credential URL</label>
        <div className="relative">
          <Award size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
          <input
            id="certificateUrl"
            name="certificateUrl"
            type="url"
            placeholder="https://example.com/verify/credential"
            className="form-input pl-10"
            value={formData.certificateUrl}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseCertificateFields;
