var bcrypt = require('bcryptjs');

exports.encrypt = password => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(7).then(salt => {
            bcrypt.hash(password, salt).then(hash => {
                resolve(hash)
            }, err => {
                reject(err)
            });
        })
    })
}

exports.comparePassword = (_password, hash) => {
    return new Promise((resolve,reject)=>{
        bcrypt.compare(_password, hash).then(success => {
            resolve(success)
        },fail=>{
            reject(fail)
        })
    })
}
