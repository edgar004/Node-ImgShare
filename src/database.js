const mongoose = require('mongoose');

const { database } = require('./keys');

mongoose.connect(database.URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

.then(db => console.log('DB is connected'))
    .catch(err => console.log(err));