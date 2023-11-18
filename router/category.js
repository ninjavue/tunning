const {Router} = require('express')
const router = Router()
const Category = require('../modeles/category')
const Product = require('../modeles/product')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Ads = require('../modeles/ads')
router.get('/',auth,async(req,res)=>{
    const category = await Category.find().lean()
        res.render('category/index',{
            title: 'Список категории',
            category, 
            layout:'admin',
            isCategory:true,
            error: req.flash('error'),
            success: req.flash('success')
        })
    
})
router.get('/create',auth,(req,res)=>{
    res.render('category/create',{
        title: 'Новая категория',
    })
})

router.get('/catall',async(req,res)=>{
    let categories = await Category.find().sort({order:-1})
    res.send(categories)
})




router.get('/edit/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const category = await Category.findOne({_id}).lean()
    res.send(category)
})

router.post('/save',auth,async(req,res)=>{
    let {_id,name,name_uz,slug,name_en,status,order} = req.body
    // console.log(typeof status)
    status = status || 0
    await Category.findByIdAndUpdate(_id,{name,name_uz,slug,name_en,order,status})
    res.send(JSON.stringify('ok'))

})

router.get('/changestatus/:id/',auth,async(req,res)=>{
    const _id = req.params.id
    let category = await Category.findOne({_id})
    category.status = category.status == 0 ? 1 : 0
    await Category.findByIdAndUpdate(_id,category)
    await category.save()
    res.send(JSON.stringify(category.status))
})

router.get('/delete/:id',auth,async(req,res)=>{
    await Category.findByIdAndDelete(req.params.id)
    res.redirect('/category')
})

router.post('/',auth,async(req,res)=>{
    const {name,name_en,status,order,slug,name_uz} = req.body
    const category = await new Category({name,name_en,status,order,slug,name_uz})
    await category.save()
    req.flash('success','Новая категория создано')
    res.redirect('/category')
    
})



router.get('/:id',async(req,res)=>{
    if (req.params){
        const _id = req.params.id
        const subcats = await Subcategory.find({category:_id}).lean()
        const category = await Category.findOne({_id}).lean()
        let ads = await Ads.find().where({status:1,categoryId:_id}).sort({createdAt:-1}).lean()
        ads = ads.map(ad => {
            ad.photo = ad.img[0]
            ad.price = +ad.price
            ad.price = ad.price.toLocaleString('ru-RU')
            return ad
        })
        res.render('category/show',{
            title: `${category.name}`,
            category, subcats, ads
        })
    } else {
        res.redirect('/')
    }
})



router.get('/:slug',async(req,res)=>{
    const slug = req.params.slug
    // console.log(slug)
    if (slug == 'allproduct'){
        const products = await Product.find().where({'status':0}).sort({_id:-1}).lean()
        res.send(products)
    } else {
        const category = await Category.findOne({slug})
        const products = await Product.find().where({'categoryId':category._id,'status':0}).sort({_id:-1}).lean()
        res.send(products)
    }

})

router.delete('/delete/:id',admin,async(req,res)=>{
    if (req.params){
        let _id = req.params.id
        // console.log(_id);
        await Category.findByIdAndRemove(_id)
        res.send('ok')
    }
})

// API




module.exports = router