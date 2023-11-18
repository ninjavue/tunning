const {Router} = require('express')
const router = Router()






router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err
        res.redirect('/')
    })
})


router.post('/login', async(req, res) =>{
    if (req.body) {
        let {username, password} = req.body


        if(username == 'admin' && password == '123'){
        
        req.session.isAuthed = true

        res.redirect('/admin')
        } else{
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
})

module.exports = router