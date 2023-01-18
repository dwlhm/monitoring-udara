const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const { User } = require("../sequelize")

const login = async (req, res, next) => {

    let key = process.env.PRIVATE_KEY

    if (req.signedCookies) {
        jwt.verify(
            req.signedCookies.token, 
            key, (err,) => {
                if (!err) return res.status(409).json({
                    code: 409,
                    message: 'conflict',
                    error: 'has login before'
                })
            }
        )
    }
        

    try {

        const auth = req.headers.authorization
        if (!auth) throw(new Error(400))
        
        let token = new Buffer.from(auth.split(" ")[1], 'base64')
        let [ username, password ] = token.toString().split(":")

        if (username === process.env.ADMIN_UNAME
            && password === process.env.ADMIN_PWD) {

            const checkAdmin = await User.findOne({
                where: {
                    username: process.env.ADMIN_UNAME
                }
            })

            if (!checkAdmin) {
        
                password = bcrypt.hashSync(password, 10) 

                let account = await User.create({
                    username: process.env.ADMIN_UNAME,
                    name: "admin",
                    email: "hi@admin.com",
                    isAdmin: true,
                    password: password
                })

                const token = jwt.sign({
                    id: account.id,
                    isAdmin: account.isAdmin,
                    token: uuid()
                }, key, {expiresIn: "7d"})

                res.cookie('token', token, { signed: true })

                return res.status(200).json({
                    code: 200,
                    message: 'success',
                    body: {
                        token
                    }
                })
            }
             
        }

        const account = await User.findOne({
            where: {
                username: process.env.ADMIN_UNAME
            }
        })

        if (account) {

            const dbPwd = account.password
            const cmpPwd = bcrypt.compareSync(password, dbPwd)

            if (!cmpPwd) throw(new Error(401))

            const token = jwt.sign({
                id: account.id,
                isAdmin: account.isAdmin,
                token: uuid()
            }, key, {expiresIn: "7d"})

            res.cookie('token', token, { signed: true })

            return res.status(200).json({
                code: 200,
                message: 'success',
                body: {
                    token
                }
            })
        }

        
    } catch (error) {

        console.error(error.stack)

        if (error.message === '401') return res.status(401).json({
            code: 401,
            message: "unauthorized",
            error: "wrong authentication token"
        })

        if (error.message === '400') return res.status(400).json({
            code: 401,
            message: "data uncompleted",
            error: "auth data not found"
        })

        return res.status(500).json({
            code: 500,
            message: 'internal server error',
            error: error.message
        })
    }    
}
const register = async (req, res, next) => {

    try {

        let { username, name, email, password } = req.body

        if (!username || !name || !email || !password) throw(new Error(401))

        password = bcrypt.hashSync(password, 10)

        await User.create({
            ...req.body
        })

        res.status(201).json({
            code: 201,
            message: 'created',
            body: {
                username, name, email, password
            }
        })
    } catch (error) {
        console.log(error)

        if (error.message === "Validation error") return res.status(400).json({
            code: 400,
            message: 'broken data',
            error: 'duplicates detected, use another username/email'
        })

        if (error.message === "401") return res.status(400).json({
                code: 400,
                message: 'uncomplete data',
                error: 'registration data not completed'
            })
        
        return res.status(500).json({
            code: 500,
            message: 'internal server error',
            error: error.message
        })
    }

    
}
const profil = async (req,res,next) => {

    let key = process.env.PRIVATE_KEY

    try {
        let profile
        if (req.signedCookies) {
            jwt.verify(
                req.signedCookies.token,
                key, (err, decoded) => {
                    if(err) throw(new Error(401))

                    profile = decoded
                }
            )
        }

        profile = await User.findByPk(profile.id, {
            attributes: ["name", "username", "email", "isAdmin"]
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            body: {
                profile
            }
        })
    } catch (error) {
        console.error(error.stack)
        if (error.message === '401') return res.status(401).json({
            code: 401,
            message: "unauthorized",
            error: "wrong authentication token"
        })

        return res.status(500).json({
            code: 500,
            message: 'internal server error',
            error: error.message
        })
    }
    
}

const logout = async (req, res, next) => {

    try {

        res.cookie('token', '', {signed: true})
        return res.status(200).json({
            code: 200,
            message: 'success',
            body: {
                action: 'logout',
                status: 'success'
            }
        })
        
    } catch (error) {
        console.log(error.stack)

        return res.status(500).json({
            code: 500,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = {login,register,profil,logout}