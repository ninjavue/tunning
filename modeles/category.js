const {Schema, model} = require('mongoose')

const category = new Schema({
    name: {
        type: String,
        required: true
    },
    name_uz: String,
    name_en: String,
    slug:  String,
    status: {
        type: Number,
        default: 1,
    },
    order: {
        type: Number,
        default: 0
    }
})


module.exports = model('Category',category)