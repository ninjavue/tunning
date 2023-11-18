const {Router} = require('express')
const router = Router()
const Blog = require('../modeles/blog')

router.get('/',async(req,res)=>{
    const blog = await Blog.find().lean()
    res.render('blog/index',{
        title: 'Bloglar ro`yhati',
        blog,
        isBlog:true,
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/show/:id',async(req,res)=>{
    const _id = req.params.id
    const blog = await Blog.findOne({_id}).lean()
    res.render('blog/view',{
        title: `${blog.title}`,
        blog,
        isBlog:true,
    })
})

router.get('/create',(req,res)=>{
    res.render('blog/create',{
        title: 'Yangi xabar'
    })
})

router.get('/edit/:id',async(req,res)=>{
    const _id = req.params.id
    const blog = await Blog.findOne({_id}).lean()
    res.render('blog/edit',{
        blog,
        isBlog:true,
        error: req.flash('error'),
        success: req.flash('success'),
        title: `${blog.title} ni tahrirlash`
    })
})

router.post('/save',async(req,res)=>{
    let {_id,title,slug,status,text} = req.body
    // console.log(typeof status)
    // let img = 'no-image'
    if (req.file){  
        img = req.file.path
    }
    if (status == undefined) status = 1
    const haveblog = await Blog.findOne({slug,_id: {$ne:_id}})
    if (haveblog){
        req.flash('error','Bunday blog bor!')
        res.redirect(`/blog/edit/${_id}`)
    } else {
        const blog = await Blog.findByIdAndUpdate(_id,{title,slug,status,text,img})
        console.log(blog)
        await blog.save()
        req.flash('success','Blog muvaffaqiyatli o`zgardi')
        res.redirect('/blog')
    }
})

router.get('/change/:id/:status',async(req,res)=>{
    const _id = req.params.id
    let status = req.params.status
    status = (parseInt(status)==0)?1:0
    let blog = await Blog.findByIdAndUpdate(_id,{status})
    blog.save()
    res.redirect('/blog')
})

router.get('/delete/:id',async(req,res)=>{
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/blog')
})

router.post('/',async(req,res)=>{
    const {title,slug,status,text} = req.body
    let img = 'no-image'
    if (status == undefined) status = 1
    if (req.file){
        img = req.file.path
    }
    const haveblog = await Blog.findOne({slug})
    if (haveblog){
        req.flash('error','Bunday blog bor!')
        res.redirect('/blog')
    } else {
        const blog = await new Blog({title,slug,status,img,text})
        await blog.save()
        req.flash('success','Yangi blogni ro`yhatdan o`tkazildi')
        res.redirect('/blog')
    }
})

router.get('/items',async(req,res)=>{
    const blog = await Blog.findOne().sort({'_id':-1}).lean()
    res.send(blog)
})

router.get('/all',async(req,res)=>{
    const blogs = await Blog.find().sort({_id:-1}).lean()
    res.send(blogs)
})

router.get('/view/:slug',async(req,res)=>{
    const slug = req.params.slug
    const blog = await Blog.findOne({slug}).lean()
    res.send(blog)
})


module.exports = router