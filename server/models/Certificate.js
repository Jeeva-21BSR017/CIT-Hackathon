const mongoose = require('mongoose');
const typePoints = {
    course: 50,
    event: 30,
    workshop: 40,
    coding: 60,
    project: 70
  };
const certificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date }, // Make this field optional
  description: { type: String },
  certificateUrl: { type: String },
  completionDate: { type: Date, required: true },
  type: {
    type: String,
    required: true,
    enum: ['event', 'workshop', 'coding', 'project', 'course']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'easy'
  },
 points: {
    type: Number,
    default: function() {
      return typePoints[this.type] || 0;
    }
},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Event specific
  eventLocation: { type: String },
  eventDate: { type: Date },
  // Workshop specific
  workshopDuration: { type: String },
  workshopInstructor: { type: String },
  // Coding specific
  codingPlatform: { type: String },
  codingLanguage: { type: String },
  // Project specific
  projectUrl: { type: String },
  projectTechnologies: { type: String },
  projectRole: { type: String },
  // Course specific
  courseDuration: { type: String },
  courseInstructor: { type: String },
  // Common fields
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);