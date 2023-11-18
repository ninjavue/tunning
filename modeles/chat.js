const {Schema, model} = require('mongoose')

const chat = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ads: {
        type: Schema.Types.ObjectId,
        ref: 'Ads'
    },
    msg: [{
        text: String,
        date: {
            type: Date,
            default: Date.now()
        },
        to: Boolean,
        notif: Boolean,
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

module.exports = model('Chat',chat)