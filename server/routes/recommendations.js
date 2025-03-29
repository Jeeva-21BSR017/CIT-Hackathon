const express = require("express");
const { OpenAI } = require("openai");
const router = express.Router();

// Initialize OpenAI with API key from .env
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

// Default user profile data to use when no user-specific data is provided
const defaultUserProfile = {
    skills: ["JavaScript", "React", "Python", "Basic Machine Learning"],
    interests: ["Web Development", "Machine Learning", "Data Science"],
    experience: "intermediate",
    careerGoals: ["Data Scientist", "Full Stack Developer"],
    completedCourses: ["Introduction to Machine Learning", "React Fundamentals"],
    industryFocus: ["Technology", "Education"],
};

// Function to generate the prompt for ChatGPT
function generatePrompt(config, filter, interestLevel, userProfile = defaultUserProfile) {
    // Build difficulty level filter
    const difficultyLevels = [];
    if (config.showBeginner) difficultyLevels.push("beginner");
    if (config.showIntermediate) difficultyLevels.push("intermediate");
    if (config.showAdvanced) difficultyLevels.push("advanced");

    // Build category filter
    const category = filter === "all" ? "any category" : filter;

    // Build focus area
    const focus = config.focusOnCareerGrowth ? "career growth" : "personal interest";

    return `
Generate ${config.maxRecommendations} technology learning recommendations for a user with the following profile:

Skills: ${userProfile.skills.join(", ")}
Interests: ${userProfile.interests.join(", ")}
Experience Level: ${userProfile.experience}
Career Goals: ${userProfile.careerGoals.join(", ")}
Completed Courses: ${userProfile.completedCourses.join(", ")}
Industry Focus: ${userProfile.industryFocus.join(", ")}

Please consider these parameters:
- Focus on: ${focus}
- Difficulty level(s): ${difficultyLevels.length > 0 ? difficultyLevels.join(", ") : "any"}
- Category: ${category}
- User's self-reported interest level: ${interestLevel}

For each recommendation, include:
- title: The title of the recommendation
- provider: The organization/platform offering it
- category: One of [course, certification, project, event]
- difficulty: One of [beginner, intermediate, advanced, all-levels]
- relevance: How relevant this is to the user [high, medium, low]
- description: A brief description
- skillsTargeted: Array of specific skills this develops
- estimatedCompletion: Estimated time to complete
- tags: Array of relevant tags

Format your response as a JSON object with a single key "recommendations" containing an array of recommendation objects.
`;
}

// Sample recommendations in case the API fails
const fallbackRecommendations = [
    {
        id: 1,
        title: "Advanced Deep Learning",
        provider: "DeepLearning.ai",
        category: "course",
        difficulty: "advanced",
        relevance: "high",
        description:
            "This course builds on your machine learning knowledge to explore advanced deep learning techniques, neural networks, and practical applications.",
        skillsTargeted: ["Neural Networks", "TensorFlow", "Computer Vision"],
        estimatedCompletion: "8 weeks",
        tags: ["Machine Learning", "AI"],
    },
    {
        id: 2,
        title: "Cloud Deployment for ML Models",
        provider: "Google Cloud",
        category: "certification",
        difficulty: "intermediate",
        relevance: "high",
        description:
            "Learn how to deploy and scale machine learning models in production environments using cloud infrastructure.",
        skillsTargeted: ["Cloud Computing", "MLOps", "Containerization"],
        estimatedCompletion: "4 weeks",
        tags: ["Cloud Computing", "Machine Learning"],
    },
    {
        id: 3,
        title: "Database Design and Implementation",
        provider: "MongoDB University",
        category: "course",
        difficulty: "beginner",
        relevance: "medium",
        description:
            "Fill your skill gap in database technologies with this comprehensive course on database design principles and implementation strategies.",
        skillsTargeted: ["Database Design", "NoSQL", "Data Modeling"],
        estimatedCompletion: "6 weeks",
        tags: ["Databases", "Web Development"],
    },
    {
        id: 4,
        title: "Attend the Web Development Summit",
        provider: "WebDevCon",
        category: "event",
        difficulty: "all-levels",
        relevance: "medium",
        description:
            "A networking opportunity to connect with professionals and learn about the latest trends in web development.",
        skillsTargeted: ["Networking", "Industry Knowledge", "Latest Technologies"],
        estimatedCompletion: "3 days",
        tags: ["Web Development", "Networking"],
    },
    {
        id: 5,
        title: "Data Science Project: Predictive Analytics",
        provider: "Kaggle",
        category: "project",
        difficulty: "intermediate",
        relevance: "high",
        description:
            "Apply your skills in a real-world project to build a predictive analytics model for customer behavior.",
        skillsTargeted: ["Data Analysis", "Predictive Modeling", "Python"],
        estimatedCompletion: "Flexible",
        tags: ["Data Science", "Machine Learning"],
    },
];

// AI recommendations endpoint
router.post("/ai-recommendations", async (req, res) => {
    try {
        const { config, filter, interestLevel, userProfile } = req.body;

        // Use provided user profile or default to sample data
        const profileData = userProfile || defaultUserProfile;

        // Generate prompt for ChatGPT based on user preferences and profile
        const prompt = generatePrompt(config, filter, interestLevel, profileData);

        // Call ChatGPT API
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use the same model as in your chat.js
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI career advisor specializing in technology education recommendations. Format your response as JSON only.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" },
        });

        // Parse the response
        let recommendations = [];
        try {
            const content = JSON.parse(response.choices[0].message.content);
            recommendations = content.recommendations || [];

            // Add unique IDs to each recommendation
            recommendations = recommendations.map((rec, index) => ({
                ...rec,
                id: Date.now() + index,
            }));
        } catch (error) {
            console.error("Error parsing ChatGPT response:", error);
            // Use fallback recommendations instead of failing
            recommendations = fallbackRecommendations;
        }

        // Return the recommendations
        res.json({ recommendations });
    } catch (error) {
        console.error("Error generating AI recommendations:", error);
        // Return fallback recommendations in case of API error
        res.json({
            recommendations: fallbackRecommendations,
            note: "Using fallback recommendations due to API error",
        });
    }
});

module.exports = router;
