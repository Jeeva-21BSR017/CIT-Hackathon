import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

const EventCertificateFields = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="eventLocation" className="form-label block mb-3">Event Location</label>
        <div className="relative">
          <MapPin size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
          <input
            id="eventLocation"
            name="eventLocation"
            type="text"
            placeholder="City, Country"
            className="form-input pl-10"
            value={formData.eventLocation}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="eventDate" className="form-label">Event Date</label>
        <div className="relative">
          <Calendar size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            className="form-input pl-10"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EventCertificateFields;
