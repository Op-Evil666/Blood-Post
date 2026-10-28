const mongoose = require("mongoose");

const tokenFamilySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    role:{
        type: String,
        enum: ["user", "admin", "owner"],
        default: "user"
    },
    familyId:{
        type: String,
        required: true,
        unique: true
    },
    tokenHash:{
        type: String,
        required: true
    },
    pastTokenHashes:{
        type: [String],
        default: []
    },
    expiresAt:{
        type: Date,
        required: true
    },
    revoked:{
        type: Boolean,
        default: false
    },
    revokedAt:{
        type: Date,
        default: null
    }
},
{ timestamps: true });

const tokenFamily = mongoose.model("TokenFamily", tokenFamilySchema);
module.exports = tokenFamily;