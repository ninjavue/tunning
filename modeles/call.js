const {Schema, model} = require('mongoose')

const Call = new Schema({
    name: String,
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0
    }
})


module.exports = model('Call',Call)