const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    phone: Number,
    verified: {
        type: Boolean,
        default: false
    },
     todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }]
});
