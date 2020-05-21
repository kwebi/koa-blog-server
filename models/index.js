const Sequelize = require('sequelize')
const { DATABASE } = require('../config')
const fs = require('fs')
const path = require('path')

const sequelize = new Sequelize(DATABASE.database, DATABASE.user, DATABASE.password, {
    ...DATABASE.options
});
const db = {}

fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js')
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize;

module.exports = db;
