const {Schema, model} = require('mongoose')

const ads = new Schema({
    title: {
        type: String,
        
    },
    price: {
        type: String,
        default: ''
    },
    sale: {
        type: String,
        default: ''
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategory:{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    phone:String,
    place: {
        type: String,
    },
    district:String,
    img: [String],
    status: {
        type: Number,
        default: 1,
    },
    state: {
        type: Number,
        default: 0,
    },
    seller: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
    currency: {
        type: Number,
        default: 0,
    },
    type: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        required:false,
        default: []
    },
    views: {
        type: Number,
        default: 0
    },
    text:{
        type:String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    endAt: {
        type: Date,
        default: Date.now()
    },
})

module.exports = model('Ads',ads)