const {Schema, model} = require('mongoose')

const msg = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    adsId: {
        type: Schema.Types.ObjectId,
        ref: 'Ads'
    },
    msg: [{
        text: String,
        date: Date,
        to: Boolean
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    notif: {
        type: Boolean,
        default: true
    }
})

module.exports = model('Msg',msg)