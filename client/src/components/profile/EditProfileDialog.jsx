import React, { useState } from 'react';
import { User, Mail, Briefcase, MapPin, Calendar, Award, Edit, Upload, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';

// EditProfileDialog Component
const EditProfileDialog = ({ profileData, onSave, onClose }) => {
  // Local state to hold the edited data, initialized with the current profile data
  const [editedData, setEditedData] = useState({
    name: profileData?.username || "",
    email: profileData?.email || "",
    department: profileData?.department || "",
    location: profileData?.location || "",
    bio: profileData?.bio || "",
    aoi: profileData?.aoi || [],
  });


  // Handle changes to text inputs and textarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes to interests (convert comma-separated string to array)
  const handleInterestsChange = (e) => {
    const aoi = e.target.value.split(',').map((i) => i.trim());
    setEditedData((prev) => ({ ...prev, aoi }));
  };

  // Handle form submission to save changes
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close dialog when clicking outside
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the dialog
      >
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editedData.username || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editedData.email || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                name="department"
                value={editedData.department || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={editedData.location || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={editedData.bio}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
              <input
                type="text"
                value={(editedData.aoi || []).join(', ')}
                onChange={handleInterestsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileDialog