const {model,Schema} = require('../connection');

const templateSchema = new Schema({
    title: String,
    file: String,
    thumbnail: String,
    createdAt : Date
})

module.exports = model('templates', templateSchema);