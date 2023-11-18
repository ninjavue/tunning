const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const User = require('../modeles/user')
const Ads = require('../modeles/ads')
const Msg = require('../modeles/msg')
router.get('/',auth,async(req,res)=>{
    const user = req.session.user
    let ads = await Ads.find({userId:user._id}).populate('userId').lean()
    ads = ads.map(ad => {
        ad.photo = ad.img[0]
        return ad
    })
    res.render('profile/index',{
        title: `Страница ${user.name} пользователья`, user,
        ads,
        error: req.flash('error'), success: req.flash('success')
    })
})
router.get('/msg',auth,async (req,res)=>{
    const user = req.session.user
    const adsIdList = await Ads.find({userId:user._id}).populate('userId').select('_id')
    const toMsg = await Msg.find({from:user._id}).populate('from').populate('adsId').lean()
    const fromMsg = await Msg.find({to:user._id}).populate('from').populate('adsId').lean()
    res.render('profile/msg',{
        title: `Страница ${user.name} пользователья`, user,
        fromMsg, toMsg,
        error: req.flash('error'), success: req.flash('success')
    })
})
router.post('/msg',auth,async (req,res)=>{
    const {_id,msg} = req.body
    const user = req.session.user
    const msgOne = await Msg.findOne({_id})
    let to = false
    // console.log(msgOne)
    // console.log(user)
    if (msgOne.from.equals(user._id)) {
        // console.log('to')
        to = true
    }
    msgOne.msg.push({
        text:msg,
        date: new Date().toISOString(),
        to
    })
    msgOne.notif = true
    await msgOne.save()
    res.redirect('/profile/msg/'+_id)
})

router.get('/msg/notif',async (req,res)=>{
    if (req.session.user) {
        const msg = await Msg.find({to:req.session.user._id,notif:true}).select('_id').lean()
        if (msg)
        res.send(JSON.stringify(msg.length))
        else
            res.send('0')
    } else {
        res.send('0')
    }
})

router.get('/msg/:id',auth,async (req,res)=>{
    const _id = req.params.id

    const toggleMsg = await Msg.findOne({_id})
    toggleMsg.notif = false
    await toggleMsg.save()
    const msg = await Msg.findOne({_id}).populate('adsId').populate('to').populate('from').lean()

    res.render('profile/msgview',{
        title: `Сообщение`,
        msg, error: req.flash('error'), success: req.flash('success')
    })
})

router.post('/save',auth,async(req,res)=>{
    const {_id,name,lname,email} = req.body
    const checkUser = await User.findOne({email,_id: {$ne: _id}})
    if (checkUser){
        req.flash('error','Пользователь с таким почтой уже имеется. Выберите другую')
        res.redirect('/profile/')
    } else {
        const user = await User.findOne({_id})
        if (req.file){
            const img = req.file.path
            user.img = img }
        user.name = name
        user.email = email
        await user.save()
        req.session.user = user
        req.flash('success','Все обновлено!')
        res.redirect('/profile/')
    }
})
module.exports = router