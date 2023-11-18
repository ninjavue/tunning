const {Schema, model} = require('mongoose')

const Feedback = new Schema({
    name: String,
    phone: String,
    type:{
        type:Number,
        default:0,
    },
    email:String,
    comment:String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0
    }
})


module.exports = model('Feedback',Feedback)