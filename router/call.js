const {Router} = require('express')
const router = Router()
const Call = require('../modeles/call')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
router.get('/',auth,async(req,res)=>{
    const call = await Call.find().lean()
        res.render('call/index',{
            title: 'Список заявок',
            call, 
            layout:'admin',
            isCall:true,
            error: req.flash('error'),
            success: req.flash('success')
        })
    
})





router.get('/edit/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const call = await Call.findOne({_id}).lean()
    res.send(call)
})

router.post('/save',auth,async(req,res)=>{
    let {_id,name,name_uz,slug,name_en,status,order} = req.body
    // console.log(typeof status)
    status = status || 0
    await Call.findByIdAndUpdate(_id,{name,name_uz,slug,name_en,order,status})
    res.send(JSON.stringify('ok'))

})

router.get('/changestatus/:id/',auth,async(req,res)=>{
    const _id = req.params.id
    let call = await Call.findOne({_id})
    call.status = call.status == 0 ? 1 : 0
    await Call.findByIdAndUpdate(_id,call)
    await call.save()
    res.send(JSON.stringify(call.status))
})

router.get('/delete/:id',auth,async(req,res)=>{
    await Call.findByIdAndDelete(req.params.id)
    res.redirect('/call')
})

router.post('/',auth,async(req,res)=>{
    try {
        const {name,phone} = req.body
        if (name && phone){
            const call = await new Call({name,phone,createdAt:Date.now(),status:0})
            await call.save()
            res.send(call)
        }
    } catch (error) {
        res.send(error)
    }
})



router.get('/:id',async(req,res)=>{
    if (req.params){
        const _id = req.params.id
        const subcats = await Subcall.find({call:_id}).lean()
        const call = await Call.findOne({_id}).lean()
        let ads = await Ads.find().where({status:1,callId:_id}).sort({createdAt:-1}).lean()
        ads = ads.map(ad => {
            ad.photo = ad.img[0]
            ad.price = +ad.price
            ad.price = ad.price.toLocaleString('ru-RU')
            return ad
        })
        res.render('call/show',{
            title: `${call.name}`,
            call, subcats, ads
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
        const call = await Call.findOne({slug})
        const products = await Product.find().where({'callId':call._id,'status':0}).sort({_id:-1}).lean()
        res.send(products)
    }

})

router.delete('/delete/:id',admin,async(req,res)=>{
    if (req.params){
        let _id = req.params.id
        // console.log(_id);
        await Call.findByIdAndRemove(_id)
        res.send('ok')
    }
})

// API




module.exports = router