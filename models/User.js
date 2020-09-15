const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    links: [{ type: Types.ObjectId, ref: 'Link'}]
})

module.exports = model('User', schema)  // модель называется "User", и создана на основе схемы


// Это модель пользователя, созданная на основе схемы. Тоесть, модель пользователя будет иметь в базе данных
// все те поля, которые мы указали в схеме нашей модели, и дали ей название "User"