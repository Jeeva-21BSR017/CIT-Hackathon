import React from 'react';
import { Link, Code, User } from 'lucide-react';

const ProjectCertificateFields = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="projectUrl" className="form-label block mb-3">Project URL</label>
        <div className="relative">
          <Link size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
          <input
            id="projectUrl"
            name="projectUrl"
            type="url"
            placeholder="https://example.com/project"
            className="form-input pl-10"
            value={formData.projectUrl}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="projectTechnologies" className="form-label block mb-3">Technologies Used</label>
          <div className="relative">
            <Code size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input
              id="projectTechnologies"
              name="projectTechnologies"
              type="text"
              placeholder="e.g. React, Node.js"
              className="form-input pl-10"
              value={formData.projectTechnologies}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="projectRole" className="form-label block mb-3">Your Role</label>
          <div className="relative">
            <User size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input
              id="projectRole"
              name="projectRole"
              type="text"
              placeholder="e.g. Lead Developer"
              className="form-input pl-10"
              value={formData.projectRole}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCertificateFields;
