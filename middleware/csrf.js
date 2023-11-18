const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true }) 

module.exports = (req,res,next)=>{
    if (!req.session.isAuthed){
        return res.redirect('/')
    }
    next()
}