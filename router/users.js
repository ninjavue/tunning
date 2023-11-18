const {Router} = require('express')
const User = require('../modeles/user')
const Ads = require('../modeles/ads')
const auth  = require('../middleware/auth')
const admin  = require('../middleware/admin')
const router = Router()
const bcrypt = require('bcryptjs')
router.get('/',admin,async(req,res)=>{
    let users = await User.find().lean()
    users = users.map(user => {
        user.status = user.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'
        return user
    })
    res.render('users',{
        title: 'Пользователи',
        isUsers:true,
        layout:'admin',
        users
    })
})

router.get('/u/:id',admin,async(req,res)=>{
    let _id = req.params.id
    let user = await User.findOne({_id})
    res.send(user)
})

router.post('/checkphone',async(req,res)=>{
    let {phone} = req.body
    let checkUser = await User.findOne({phone})
    if (checkUser){
        res.send('yes')
    } else {
        res.send('no')
    }
})

router.post('/savepass',async(req,res)=>{
    let {phone,password} = req.body
    console.log(phone,password)
    let checkUser = await User.findOne({phone})
    if (checkUser){
        checkUser.password = await bcrypt.hash(password, 10)
        await checkUser.save()
        res.send('yes')
    } else {
        res.send('not exist')
    }
})

router.post('/getby/',async(req,res)=>{
    let {_id} = req.body
    let user = await User.findOne({_id}).select(['phone'])
    res.send(user)
})

router.get('/delete/:id',admin,async(req,res)=>{
    let _id = req.params.id
    let ads = await Ads.find({userId:_id})
    if (ads){
        ads.forEach(async(ad) => {
            await Ads.findByIdAndRemove(ad._id)
        })
    }
    await User.findByIdAndRemove({_id})
    req.flash('success', 'Успешно!')
    res.redirect('/users')
})

module.exports = router