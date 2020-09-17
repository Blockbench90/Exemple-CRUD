const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {  //OPTIONS метод проверяет доступность сервера
        return next()       //тоесть если все гуд, продолжаем делать запрос
    }
    
    try {

        const token = req.headers.authorization.split(" ")[1]   //достаем из заголовков токен, из первого елемента
        if(!token) {        //и проверяем, если его нету выдаем ошибку авторизации
            return res.status(401).json({message: 'Нет авторизации'})
        }
        const decoded = jwt.verify(token, config.get('jwtSecret'))  //он приходит закодированным, вот так мы его декодируем
        req.user = decoded  //создаем в реквесте поле юзер и ложим туда наш раскодированный токен
        next()  //продолжаем выполнение запроса
    } catch (e) {
        res.status(401).json({message: 'Нет авторизации'})
    }
}