module.exports = (req,res,next)=>{
    if (!req.session.isAuthed){
        return res.redirect('/')
    }
    next()
}