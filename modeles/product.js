const {Schema, model} = require('mongoose')

const product = new Schema({
    title: {
        type: String,
        required: true
    },
    price: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }, 
    top:Number,
    text:String,
    img: [String],
    status: {
        type: Number,
        default: 0,
    },
    createdAt:Date,
    stock:Number,
})


module.exports = model('Product',product)