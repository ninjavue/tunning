const {Router} = require('express')
const router = Router()
const Product = require('../modeles/product')
const Order = require('../modeles/order')
const Feedback = require('../modeles/feedback')
const Category = require('../modeles/category')
const Quote = require('../modeles/quote')
const auth = require('../middleware/auth')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true }) 

router.get('/',auth,async(req,res)=>{
    let products = await Product.find().populate('category').lean()
    products = products.map((product,index) => {
        product.index = index+1
        product.img = product.img[0]
        return product
    })
    const category = await Category.find().lean()
    res.render('product/index',{
        title: 'Tовары',
        layout:'admin',
        category,
        isProduct:true,
        products
    })
})

router.get('/productall',async(req,res)=>{
    let products = await Product.find().lean()
    res.send(products)
})

router.get('/top',async(req,res)=>{
    let products = await Product.find({top:1}).lean()
    res.send(products)
})

router.get('/order',auth,async(req,res)=>{
    let order = await Order.find().populate('products._id').sort({_id:-1}).lean()
    order = order.map((o,index) =>{
        o.index = index + 1
        o.createdAt = o.createdAt.toLocaleString('ru-RU')
        return o
    })
    res.render('product/order',{
        title:'Заказы',
        layout:'admin',
        order,
        isOrder:true
    })
})
router.get('/feedback',auth,async(req,res)=>{
    let feedback = await Feedback.find().lean()
    feedback = feedback.map((o,index) =>{
        o.index = index + 1
        o.createdAt = o.createdAt.toLocaleString('ru-RU')
        return o
    })
    res.render('product/feedback',{
        title:'Заявка на звонок',
        layout:'admin',
        feedback,
        isFeedback:true
    })
})

router.post('/order',async(req,res)=>{
    if (req.body){
        let {products, name, phone} = req.body 
        products = JSON.parse(products)
        let newOrder = await new Order({products,name,phone,createdAt:Date.now()})
        await newOrder.save()
        res.send('ok')
    }
})



router.get('/orderdel/:id',auth,async(req,res)=>{
    if (req.params){
        let {id} = req.params
        await Order.findByIdAndRemove(id)
        res.redirect('/product/order')
    }
})
router.get('/feedbackdel/:id',auth,async(req,res)=>{
    if (req.params){
        let {id} = req.params
        await Feedback.findByIdAndRemove(id)
        res.redirect('/product/feedback')
    }
})
router.post('/feedback',async(req,res)=>{
    if (req.body){
        let {comment,email,type, name, phone} = req.body 
        type = type || 0
        comment = comment || ''
        email = email || ''
        type = type || ''
        let newOrder = await new Feedback({name,phone,comment,email,type,createdAt:Date.now()})
        console.log(newOrder)
        await newOrder.save()
        res.send('ok')
    }
})

router.get('/create',auth,async(req,res)=>{
    const category = await Category.find().lean()
    res.render('product/new',{
        title: 'Yangi tovarni kiritish',
        isProduct:true,
        category
    })
})


router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Product.findByIdAndDelete({_id})
    res.redirect('/product/')
})

router.post('/quote',async(req,res)=>{
    try {
        let {name,text,mark,car,need,marks,product} = req.body
        marks = JSON.parse(marks)
        let status =  0
        let createdAt = Date.now()
        let img = ''
        if (req.files){
            let files = req.files
            const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            for(key in files){
                let filepath = `images/${uniquePreffix}_${files[key].name}`
                await files[key].mv(filepath)
                img = filepath
            }
        }
            const newproduct = await new Quote({name,text,mark,car,need,marks,product,img,status,createdAt})
            await newproduct.save()
            res.send(newproduct)
    } catch (error) {
        console.log(error)
    }
})


router.post('/',auth,async(req,res)=>{
    try {
        let {title,price,category,top,text,stock,status} = req.body
        // console.log(currency)
        status = status || 0
        top = top || 0
        let createdAt = new Date().toISOString()
        let img = []
        if (req.files){
            let files = req.files
            let img = []
            const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            for(key in files){
                let filepath = `images/${uniquePreffix}_${files[key].name}`
                await files[key].mv(filepath)
                img.push(filepath)
            }
            const product = await new Product({title,price,stock,category,top,text,img,status,createdAt})
            await product.save()
            res.send(product)
            
        } else {
            res.send('error')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',auth,async(req,res)=>{
    let {_id,title,price,category,top,text,stock,status} = req.body
    top = top || 0
    status = status || 0
    let product = {title,price,category,top,text,stock,status}
    if (req.files){
        let files = req.files
        let img = []
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        for(key in files){
            let filepath = `images/${uniquePreffix}_${files[key].name}`
            await files[key].mv(filepath)
            img.push(filepath)
        }
        product.img = img
    }
    // console.log(ads,_id)
    await Product.findByIdAndUpdate({_id},product)
    res.send(JSON.stringify('ok'))
})

router.get('/get/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const product = await Product.findOne({_id}).lean()
    res.send(product)
})

router.get('/show/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const product = await Product.findOne({_id}).populate('categoryId').lean()
        product.newPrice = product.price*(100-product.sale)/100
        res.render('product/view',{
            title: `${product.categoryId.name} | ${product.title} | ${product.price} so'm`,
            product,
            isProduct:true,
        })
    
})

router.get('/view/:id',async(req,res)=>{
    const _id = req.params.id
    let product = await Product.findOne({_id}).populate('category').lean()
    let quotes = await Quote.find({product: _id}).sort({_id:-1})
    let others = await Product.find({category: product.category._id}).where({_id: {$ne:_id}})
    res.send({product,quotes,others})
})
// /product/getbycat/634cd5a767fc3958c2f53d37
router.get('/getbycat/:id',async(req,res)=>{
    if (req.params){
        let {id} = req.params
        let category = await Category.findOne({_id:id}).lean()
        let products = await Product.find({category: id}).lean()
        res.send({products,category})
    }
})

const kirlot = (text) => {
    let lat = {'a':'а','q':'қ','s':'с','d':'д','e':'е','r':'р','f':'ф','t':'т','g':'г','y':'й','h':'ҳ','u':'у','j':'ж','i':'и','k':'к','o':'о','l':'л','p':'п','z':'з','x':'х','s':'с','v':'в','b':'б','n':'н','m':'м','ch':'ч',' ':' '}
    let kir = {'а':'a','қ':'q','с':'s','д':'d','е':'e','р':'r','ф':'f','т':'t','г':'g','й':'y','ҳ':'h','у':'u','ж':'j','и':'i','к':'k','о':'o','л':'l','п':'p','з':'z','х':'x','с':'s','в':'v','б':'b','н':'n','м':'m','ш':'sh','ч':'ch', ' ':' '}
    let res = ''
    text = text.toLowerCase().split('')
    let letterCount = 0
    while (letterCount < text.length) {
        if (text[letterCount]+text[letterCount+1]=='sh') {
            res+='ш'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ch') {
            res+='ч'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='yo') {
            res+='ё'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ya') {
            res+='я'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="o'") {
            res+='ў'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="g'") {
            res+='ғ'
            letterCount+=2
            continue
        }
        if (lat[text[letterCount]]) {
            res+=lat[text[letterCount]]
        }
        if (kir[text[letterCount]]) {
            res+=kir[text[letterCount]]
        }
        letterCount++
    }

    return res
}

router.get('/search/:title',async(req,res)=>{
    const title = req.params.title
    if (title.length>0) {
        let othertitle = kirlot(title)
        let ads = await Product
            .find({
                $or: [
                    {
                        'title': {
                            $regex: new RegExp( title.toLowerCase(), 'i')
                        }
                    },
                    {
                        'title': {
                            $regex: new RegExp( othertitle.toLowerCase(), 'i')
                        }
                    }
                ]
            }
                ).select(['title','price','img']).populate('category').sort({_id:-1}).limit(10).lean()
        if (ads.length > 0) {
            res.send(ads)
        } else {
            res.send([])
        }
    } else {
        res.send('error')
    }
})


router.post('/ids',async(req,res)=>{
    let {favs} = req.body
    // console.log(favs)
    if (favs.length>0){
        let products = await Product.find({_id: {$in: favs}}).populate('category').lean()
        if (products){
            res.send(products)
        } else {
            res.send('error')
        }
    } else {
        res.send('error')
    }
})


module.exports = router