const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')

require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000


const userRoute = require('./users/router')

app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser("seismograf"))
app.use(bodyParser.json())
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      "block-all-mixed-content": true,
      "upgrade-insecure-requests": true,
      directives: {
        "default-src": [
            "'self'"
        ],
        "base-uri": "'self'",
        "font-src": [
            "'self'",
            "https:",
            "data:"
        ],
        "frame-ancestors": [
            "'self'"
        ],
        "img-src": [
            "'self'",
            "data:",
            "https://a.tile.openstreetmap.org",
            "https://b.tile.openstreetmap.org",
            "https://c.tile.openstreetmap.org"
        ],
        "object-src": [
            "'none'"
        ],
        "script-src": [
            "'self'",
            "https://cdnjs.cloudflare.com"
        ],
        "script-src-attr": "'none'",
        "style-src": [
            "'self'",
            "https://cdnjs.cloudflare.com",
            "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        ],
      },
    }),
    helmet.dnsPrefetchControl({
        allow: true
    }),
    helmet.frameguard({
        action: "deny"
    }),
    helmet.hidePoweredBy(),
    helmet.hsts({
        maxAge: 123456,
        includeSubDomains: false
    }),
    helmet.ieNoOpen(),
    helmet.noSniff(),
    helmet.referrerPolicy({
        policy: [ "origin", "strict-origin" ]
    }),
    helmet.xssFilter()
)

app.get('/', (req,res) => {
    res.status(200).json({
        code: 200,
        message: 'success'
    })
})

app.use('/user',userRoute)

app.use((req,res,next) => {
    res.status(404).json({
        code: 404,
        message: 'not found'
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        code: 500,
        message: 'internal server error'
    })
})

app.listen(PORT, () => {
    console.info(`Server running! - localhost:${PORT}`)
})