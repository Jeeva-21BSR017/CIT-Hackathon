const mongoose = require("mongoose");
const bcrypt = require("bcrypt");




const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    department: { type: String },
    college: { type: String },
    yearOfStudy: { type: String },
    aoi: { type: [String], default: [] },
    bio: { type: String },
    profileImage: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" }
});


const User = mongoose.model("User", UserSchema);
module.exports = User;