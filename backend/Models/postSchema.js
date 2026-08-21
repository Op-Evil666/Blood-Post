const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    content:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [{
           type: String,
           lowercase: true,
           trim: true
        }],
        default: [],
        validate: {
           validator: function(tags) {
            if (!tags) return true;
            return new Set(tags).size === tags.length;
    },
    message: "Tags must be unique"
}
    },
    status:{
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    }
},
{ timestamps: true});

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;