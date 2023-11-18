const {Schema, model} = require('mongoose')

const blog = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1,
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    img: String
})


module.exports = model('Blog',blog)