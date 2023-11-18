const {Schema, model} = require('mongoose')

const Quote = new Schema({
    name: String,
    img:String,
    text:String,
    mark:Number,
    car:String,
    need:String,
    marks:[
        {
            title:String,
            mark:Number,
        }
    ],
    product: {
        type: Schema.Types.ObjectId,
        ref:'Product'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0
    }
})


module.exports = model('Quote',Quote)