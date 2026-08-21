const mongoose = require("mongoose");

const tokenFamilySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
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