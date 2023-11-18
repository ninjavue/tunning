const {Schema, model} = require('mongoose')

const order = new Schema({
    products:[
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            count:Number
        }
    ],
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


module.exports = model('Order',order)