const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['course', 'certification', 'project', 'event'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
        required: true
    },
    relevance: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skillsTargeted: {
        type: [String],
        default: []
    },
    estimatedCompletion: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    },
    saved: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);