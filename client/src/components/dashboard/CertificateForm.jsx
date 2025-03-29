import React, { useState, useRef } from 'react';
import {
  Calendar,
  Users,
  Code,
  Briefcase,
  BookOpen,
  X,
  ArrowLeft,
  Upload,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import GradientButton from '../ui/GradientButton';
import { useToast } from '@/hooks/use-toast';
import EventCertificateFields from '../certificates/EventCertificateFields';
import WorkshopCertificateFields from '../certificates/WorkshopCertificateFields';
import ProjectCertificateFields from '../certificates/ProjectCertificateFields';
import CourseCertificateFields from '../certificates/CourseCertificateFields';
import { verifyPdfCertificate } from '@/lib/certificateUtils';

const CertificateForm = ({ selectedType, onSelectType, onClose }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    certificateUrl: '',
    completionDate: '',
    // Event specific
    eventLocation: '',
    eventDate: '',
    // Workshop specific
    workshopDuration: '',
    workshopInstructor: '',
    // Coding specific
    codingPlatform: '',
    codingLanguage: '',
    profileUrl: '',
    easyProblems: '',
    mediumProblems: '',
    hardProblems: '',
    // Project specific
    projectUrl: '',
    projectTechnologies: '',
  });

  const [certificateFile, setCertificateFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setFileError('');
    setVerificationStatus(null);

    // Validate file type (PDF or Image formats)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF and image formats (JPEG, PNG, GIF) are supported');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit');
      return;
    }

    setCertificateFile(file);

    // Verify certificate authenticity
    try {
      setIsVerifying(true);
      const isAuthentic = await verifyPdfCertificate(file);
      setIsVerifying(false);

      if (isAuthentic) {
        setVerificationStatus({
          isValid: true,
          message: 'Certificate verified successfully',
        });
      } else {
        setVerificationStatus({
          isValid: false,
          message: 'This certificate appears to be edited or invalid',
        });
      }
    } catch (error) {
      setIsVerifying(false);
      setVerificationStatus({
        isValid: false,
        message: 'Unable to verify certificate',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (verificationStatus && !verificationStatus.isValid) {
      toast({
        title: 'Invalid Certificate',
        description: 'Please upload an authentic certificate',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    // Create FormData object
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('issuer', formData.issuer);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('completionDate', formData.completionDate);
    formDataToSend.append('type', selectedType);
    
    if (certificateFile) {
      formDataToSend.append('certificateFile', certificateFile);
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:9000/api/certificates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Read error response
        throw new Error(errorData.message || 'Failed to save certificate');
      }

      const result = await response.json();

      // Show success toast
      toast({
        title: 'Certificate Added',
        description: `Your ${selectedType} certificate has been successfully added.`,
        duration: 3000,
      });

      console.log('Form submitted:', result);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message, // Show actual backend error message
        variant: 'destructive',
        duration: 3000,
      });
      console.error('Error submitting form:', error);
    }
  };

  const handleBackButton = () => {
    onSelectType('');
  };

  // Type selection view
  if (!selectedType) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Certification</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Select the type of certification you'd like to add:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onSelectType('event')}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
          >
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-200">
              <Calendar size={24} />
            </div>
            <span className="font-medium text-gray-800">Event</span>
            <span className="text-xs text-gray-500 mt-1">Conferences, Summits</span>
          </button>

          <button
            onClick={() => onSelectType('workshop')}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all duration-200 group"
          >
            <div className="p-3 rounded-full bg-teal-100 text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-200">
              <Users size={24} />
            </div>
            <span className="font-medium text-gray-800">Workshop</span>
            <span className="text-xs text-gray-500 mt-1">Training Sessions</span>
          </button>

          <button
            onClick={() => onSelectType('coding')}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 group"
          >
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-200">
              <Code size={24} />
            </div>
            <span className="font-medium text-gray-800">Coding</span>
            <span className="text-xs text-gray-500 mt-1">Challenges, Contests</span>
          </button>

          <button
            onClick={() => onSelectType('project')}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all duration-200 group"
          >
            <div className="p-3 rounded-full bg-cyan-100 text-cyan-600 mb-4 group-hover:scale-110 transition-transform duration-200">
              <Briefcase size={24} />
            </div>
            <span className="font-medium text-gray-800">Project</span>
            <span className="text-xs text-gray-500 mt-1">Practical Applications</span>
          </button>
        </div>

        <button
          onClick={() => onSelectType('course')}
          className="mt-4 w-full flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
        >
          <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3 group-hover:scale-110 transition-transform duration-200">
            <BookOpen size={20} />
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-800">Course or Certification</span>
            <p className="text-xs text-gray-500">Online courses, Professional certifications, Degrees</p>
          </div>
        </button>
      </div>
    );
  }

  // Form with type already selected
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-scale-in overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBackButton}
            className="mr-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold capitalize flex items-center">
            {selectedType === 'event' && <Calendar size={20} className="mr-2 text-purple-500" />}
            {selectedType === 'workshop' && <Users size={20} className="mr-2 text-teal-500" />}
            {selectedType === 'coding' && <Code size={20} className="mr-2 text-indigo-500" />}
            {selectedType === 'project' && <Briefcase size={20} className="mr-2 text-cyan-500" />}
            {selectedType === 'course' && <BookOpen size={20} className="mr-2 text-blue-500" />}
            Add {selectedType} Certificate
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className="form-label  block mb-2">
              Title*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder={`${
                selectedType === 'event'
                  ? 'Event'
                  : selectedType === 'workshop'
                  ? 'Workshop'
                  : selectedType === 'coding'
                  ? 'Challenge'
                  : selectedType === 'project'
                  ? 'Project'
                  : 'Course'
              } title`}
              className="form-input"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="issuer" className="form-label  block mb-2">
              {selectedType === 'coding' ? 'Platform Name*' : 'Issuer/Provider*'}
            </label>
            <input
              id="issuer"
              name="issuer"
              type="text"
              required
              placeholder={`${
                selectedType === 'event'
                  ? 'Event organizer'
                  : selectedType === 'workshop'
                  ? 'Workshop provider'
                  : selectedType === 'coding'
                  ? 'Platform name (e.g., LeetCode, HackerRank)'
                  : selectedType === 'project'
                  ? 'Organization'
                  : 'Institution name'
              }`}
              className="form-input"
              value={formData.issuer}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Common fields for all types */}
        <div>
          <label htmlFor="description" className="form-label  block mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Brief description of what you learned or accomplished"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="completionDate" className="form-label  block mb-2">
            Completion Date*
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input
              id="completionDate"
              name="completionDate"
              type="date"
              required
              className="form-input pl-10"
              value={formData.completionDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Type-specific fields */}
        {selectedType === 'event' && <EventCertificateFields formData={formData} handleChange={handleChange} />}

        {selectedType === 'workshop' && (
          <WorkshopCertificateFields formData={formData} handleChange={handleChange} />
        )}

        {selectedType === 'coding' && (
          <div className="space-y-5">
            <div>
              <label htmlFor="profileUrl" className="form-label  block mb-2">
                Profile URL*
              </label>
              <input
                id="profileUrl"
                name="profileUrl"
                type="url"
                required
                placeholder="Your profile URL (e.g., https://leetcode.com/username)"
                className="form-input"
                value={formData.profileUrl}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label htmlFor="easyProblems" className="form-label  block mb-2">
                  Easy Problems Solved
                </label>
                <input
                  id="easyProblems"
                  name="easyProblems"
                  type="number"
                  placeholder="Number of easy problems solved"
                  className="form-input"
                  value={formData.easyProblems}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="mediumProblems" className="form-label  block mb-2">
                  Medium Problems Solved
                </label>
                <input
                  id="mediumProblems"
                  name="mediumProblems"
                  type="number"
                  placeholder="Number of medium problems solved"
                  className="form-input"
                  value={formData.mediumProblems}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="hardProblems" className="form-label  block mb-2">
                  Hard Problems Solved
                </label>
                <input
                  id="hardProblems"
                  name="hardProblems"
                  type="number"
                  placeholder="Number of hard problems solved"
                  className="form-input"
                  value={formData.hardProblems}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {selectedType === 'project' && (
          <ProjectCertificateFields formData={formData} handleChange={handleChange} />
        )}

        {selectedType === 'course' && <CourseCertificateFields formData={formData} handleChange={handleChange} />}

        <div className="border-t border-gray-100 pt-5 mt-5">
          <div className="flex flex-col md:flex-row gap-5 mb-5">
            <div
              className={`flex-1 border border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                fileError ? 'border-red-300 bg-red-50' : certificateFile ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
              onClick={handleFileClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                className="hidden"
              />

              {!certificateFile ? (
                <>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-3">
                    <Upload size={24} />
                  </div>
                  <p className="font-medium text-gray-800">Upload Certificate</p>
                  <p className="text-xs text-gray-500 mt-1">PDF or image formats (Max 5MB)</p>

                  {fileError && (
                    <div className="mt-3 flex items-center text-red-500 text-sm">
                      <AlertTriangle size={16} className="mr-1" />
                      <span>{fileError}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mb-3">
                    <FileText size={24} />
                  </div>
                  <p className="font-medium text-gray-800 truncate max-w-full">{certificateFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(certificateFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  {isVerifying && (
                    <div className="mt-3 flex items-center text-blue-500 text-sm">
                      <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                      <span>Verifying certificate...</span>
                    </div>
                  )}

                  {verificationStatus && (
                    <div
                      className={`mt-3 flex items-center text-sm ${
                        verificationStatus.isValid ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {verificationStatus.isValid ? (
                        <>
                          <span className="inline-block w-4 h-4 rounded-full bg-green-100 border border-green-500 flex items-center justify-center mr-2">
                            <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
                          </span>
                          <span>{verificationStatus.message}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} className="mr-1" />
                          <span>{verificationStatus.message}</span>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    className="mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCertificateFile(null);
                      setVerificationStatus(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove file
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>

            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
              {verificationStatus && !verificationStatus.isValid && (
                <div className="text-sm text-red-500 flex items-center">
                  <AlertTriangle size={16} className="mr-1 flex-shrink-0" />
                  <span>Invalid certificate detected</span>
                </div>
              )}
              <GradientButton
                type="submit"
                disabled={certificateFile && verificationStatus && !verificationStatus.isValid}
                className="w-full md:w-auto"
              >
                Save Certificate
              </GradientButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;