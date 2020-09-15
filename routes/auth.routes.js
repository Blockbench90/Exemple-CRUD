const {Router} = require('express') //подключаем роутер
const router = Router()             // и передаем результат вызова переменной router
const bcrypt = require('bcryptjs')  //подключаем библиотеку для шифрования паролей
const User = require("../models/User")  //подключаем модель пользователя
const {check, validationResult} = require('express-validator')//подключаем валидатор для корректной работы пользователя на фронте
const jwt = require('jsonwebtoken') //библиотека для создания токена
const config = require("config")


//  /api/auth/register так будет выглядеть путь после конкотенации, при регистрации пользователя
router.post('/register',
    [                                                           //массив валидаторов как еще один мидлвеер
        check('email', "Некорректный email").isEmail(),   //1.Что проверяем, 2.Сообщение об ошибке, 3.isEmail() - метод, который проверит
        check('password', "Минимальная длинна пароля 6 символов").isLength({min: 6})//Таже беда, только проверяем на длинну
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)//Подключаем валидатор, который из req возьмет что мы указали выше и провалидирует
            if (!errors.isEmpty()) {            //И проверяем методом isEmpty. И если он не пустой,
                return res.status(400).json({   //то возвращаем ошибки на фронт и задаем статус ошибки code:400
                    errors: errors.array(),               // передаем на фронт обьект ошибок и переводим его в массив
                    message: "Некорректные данные при регистрации"
                })
            }

            const {email, password} = req.body  // в поле req сюда придут параметры, что мы отправляем с фронта

            const candidate = await User.findOne({email}) //перед регистрацией проверяем, есть ли такой пользователь в базе
            if (candidate) {    //если есть
                return res.status(400).json({massage: "Такой пользователь уже существует"}) //то сделаем return и вернем ошибку
            }

            const hashedPassword = await bcrypt.hash(password, 12)      //как только пароль приходит с фронта, мы его сразу хешируем и на его основе
            const user = new User({email, password: hashedPassword})    //уже создаем нового пользователя и
            await user.save()                                           // данной строкой ждем пока он сохранится, и только после выполнения промиса
            res.status(201).json({message: "Пользователь создан"})//отвечает на фронт через res, отдавая код успеха:201 и сообщение
        } catch (e) {   //обработка ошибок, в случае такового, отослать код ошибки (500) и сообщение в json формате
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})//базовая ошибка из HTTP протокола, если не отработает
        }                                                                                       // код више
    })

//  /api/auth/login так будет выглядеть путь после конкотенации, при регистрации пользователя
router.post('/login',
    [
        check('email', "Введите корректный email").normalizeEmail().isEmail(),  //Добавляем еще один валидатор normalizeEmail
        check('password', "Введите пароль").exists()                            //exists - тоесть, пароль должен быть
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при входу в систему"
                })
            }

            const {email, password} = req.body          //из запроса берем данные пользователя
            const user = await User.findOne({email})    //исходя из email ищем такого в базе
            if (!user){                                 //если не находим,
                return res.status(400).json({message: "Пользователь не найден"})    //выдаем ошибку
            }

            const isMatch = await bcrypt.compare(password, user.password)   //если пользователь найден, сравниваем пароль (bcrypt.compare), тот который пришел с тем, которых хранится в базе
            if (!isMatch){  //Если пароли не совпадают, тоесть совпадений не найдено
                return res.status(500).json({message: "Неверный пароль, попробуйте еще раз"})   //возвращаем ошибку на фронт
            }
            const token = jwt.sign(         //создаем токен и передаем в метод опции
                {userId: user.id},  //идентификатор пользователя первый параметр
                config.get("jwtSecret"),    //секретный ключ, второй параметр, у меня это белебердовая фраза, которую я вынес в конфиг("jwtSecret": "always is good")
                { expiresIn:'1h' }  //expiresIn - через сколько убить этот токен, сколько ему работать
            )
            res.json({token, userId: user.id})  //после создания токена, передаем его на фронт, без статус кода, он по умолчанию 200(успех), и на всяк пожарный передаю id
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'}) //базовая ошибка из HTTP протокола, если не отработает
        }                                                                                       // код више
    })
module.exports = router;