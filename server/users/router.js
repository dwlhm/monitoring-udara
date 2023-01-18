const {login,register, profil, logout} = require('./controller')

const express = require('express')
const router = express.Router()

router.get('/',profil)
router.post('/',register)
router.post('/login',login)
router.post('/logout',logout)

module.exports = router