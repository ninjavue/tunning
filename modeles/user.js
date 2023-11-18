const {Schema, model} = require('mongoose')
const user = new Schema({
    name: { type: String, required: true },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    control: {
        type: Boolean,
        default:false
    },
    role: {
        type: Number,
        default: 1, 
        // 0 -> superAdmin
        // 1 -> Boss
        // 2 -> Little Boss
        // 3 -> Capitan
        // 4 -> Sergant
        // 5 -> Soldier
    },
    token:String,
    tokenExp: Date,
    resetToken: String,
    resetTokenExp: Date,
    img: String,
})
module.exports = model('User',user)