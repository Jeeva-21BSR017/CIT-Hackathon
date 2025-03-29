import React from 'react';

const WorkshopCertificateFields = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label htmlFor="workshopDuration" className="form-label block mb-3">Workshop Duration</label>
        <input
          id="workshopDuration"
          name="workshopDuration"
          type="text"
          placeholder="e.g., 2 hours, 1 day"
          className="form-input"
          value={formData.workshopDuration}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="workshopInstructor" className="form-label block mb-3">Instructor/Facilitator</label>
        <input
          id="workshopInstructor"
          name="workshopInstructor"
          type="text"
          placeholder="Name of the instructor"
          className="form-input"
          value={formData.workshopInstructor}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default WorkshopCertificateFields;