const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    // file: {
    //     data: Buffer,
    //     contentType: String
    // },
    file: {
        path: String,
        contentType: String,
        AWSKEY: String
    },
    uploadBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    accessList: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]
}, {timestamps: true})


module.exports = mongoose.model("File", fileSchema)