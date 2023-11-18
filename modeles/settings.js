const {Schema, model} = require('mongoose')

const settings = new Schema({
    title: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 1
    }
})

module.exports = model('Settings',settings)