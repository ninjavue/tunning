const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const User = require('../modeles/user')
const Chat = require('../modeles/chat')

const axios = require('axios')
const bcrypt = require('bcryptjs')
var FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
router.get('/newproduct',async(req,res)=>{
    const products = await Ads.find().lean().limit(4).sort({_id:-1})
    res.send(products)
})






module.exports = router