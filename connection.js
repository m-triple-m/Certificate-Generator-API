const mongoose = require('mongoose');
const dbName = 'CertificateGenerator';
const dbUrl = `mongodb+srv://mmm:mmm@cluster0.gvyon.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(dbUrl)
.then((result) => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

module.exports = mongoose;