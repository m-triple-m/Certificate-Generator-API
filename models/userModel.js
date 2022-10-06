const {model,Schema} = require('../connection');

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    createdAt: Date
})

module.exports = model('users',userSchema);