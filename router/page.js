const {Router} = require('express')
const router = Router() 
const auth = require('../middleware/auth')

const Product = require('../modeles/product')
const Category = require('../modeles/category')

const csrf = require('csurf')
const Page = require('../modeles/page')
const User = require('../modeles/user')
const admin = require('../middleware/admin')

router.get('/',  async(req,res)=>{
    res.render('index',{
        error: req.flash('error'),
        success: req.flash('success'),
        title: 'Главная страница',
        layout:'nohead'
    })
})

router.get('/admin',admin,async(req,res)=>{
    const categories = await Category.find().lean()
    
    
    res.render('page/admin',{
        layout:'admin',
        categories
    })
})





module.exports = router