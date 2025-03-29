import React from 'react';

const CodingCertificateFields = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label htmlFor="codingPlatform" className="form-label block mb-3">Platform</label>
        <input
          id="codingPlatform"
          name="codingPlatform"
          type="text"
          placeholder="e.g., LeetCode, HackerRank"
          className="form-input"
          value={formData.codingPlatform}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="codingLanguage" className="form-label block mb-3">Programming Language(s)</label>
        <input
          id="codingLanguage"
          name="codingLanguage"
          type="text"
          placeholder="e.g., Python, JavaScript"
          className="form-input"
          value={formData.codingLanguage}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CodingCertificateFields;
