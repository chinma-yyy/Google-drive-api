const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    user: {
        type: String,
    },
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

module.exports=mongoose.model('Tokens',tokenSchema);