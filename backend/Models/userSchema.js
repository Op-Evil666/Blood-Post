const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    bio:{
        type: String,
        default: "Using this blog to share my thoughts and ideas...",
        trim: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
},
{
    strict: true,
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;