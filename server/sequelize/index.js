const { Sequelize, DataTypes } = require('sequelize')

require('dotenv').config()

const UserModel = require('./models/user')

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_UNAME, 
    process.env.DB_PASSWD,
    {
        host: process.env.DB_HOST,
        dialect: 'mariadb'
    }
)

try {
    (async () => {
        await sequelize.authenticate()
        await sequelize.sync({ force: false })
    })()
    console.info('server database established!')
} catch (error) {
    console.error(error.stack)
}

const User = UserModel(sequelize, DataTypes)

module.exports = {
    User
}