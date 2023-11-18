const express = require('express') 
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash') // !
const fileUpload = require('express-fileupload')
const helmet = require('helmet')
const compression = require('compression')

// const helmet = require('helmet')
// const compression = require('compression')
// Routerlar
const pageRouter = require('./router/page')
const authRouter  = require('./router/auth')
const apiRouter  = require('./router/api')
const productRouter  = require('./router/product')
const categoryRouter = require('./router/category')


// middleWare lar
const varMid = require('./middleware/var')
// const fileMiddleware = require('./middleware/file')
const keys = require('./keys/pro')

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs',hbs.engine)
app.set('view engine','hbs')
app.set('views','views')
app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
app.use(express.static(__dirname+'/assets'))
app.use('/images',express.static('images')) // !


app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-CSRF-Token');
    // res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


const store = new MongoStore({
    collection: 'session',
    uri: keys.MONGODB_URI
})
app.use(session({
    secret: keys.SESSION_SECRET,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 10,
        secure: false 
    },
    resave:true,
    store
}))


// app.use(fileMiddleware.single('img'))
// app.use(csrf())
app.use(cookieParser())

app.use((error,req,res,next)=>{
    const message = `This is the unexpected field -> ${error.field}`
    console.log(message)
    next()
})

app.use(flash()) // !
app.use(varMid)
app.use(helmet())
app.use(compression())

app.use('/auth',authRouter) 
app.use('/api',apiRouter)
app.use('/product',productRouter) 
app.use('/category',categoryRouter)
app.use('/call',require('./router/call'))
app.use(pageRouter)

const PORT = process.env.PORT || 3003

async function dev(){
    try {
        await mongoose.connect(keys.MONGODB_URI,{useNewUrlParser:true})
        app.listen(PORT,()=>{
            console.log(`tuning Server is running ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
dev()