const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},  //required - обязательно, unique - уникальное
    password: {type: String, required: true},
    links: [{ type: Types.ObjectId, ref: 'Link'}]   // у каждого пользователя будет свой массив ссылок, это поле,
})                                                  // как раз для этого

//Types.ObjectId связывает пользователя с базой данных
//ref: 'Link' к этой модели, которая создана в модели Link

module.exports = model('User', schema)  // модель называется "User", и создана на основе схемы


// Это модель пользователя, созданная на основе схемы. Тоесть, модель пользователя будет иметь в базе данных
// все те поля, которые мы указали в схеме нашей модели, и дали ей название "User"