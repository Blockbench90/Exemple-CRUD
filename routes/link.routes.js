const {Router} = require('express')
const Link = require('../models/Link')
const config = require('config')
const shortid = require('shortid')
const auth = require('../middleware/auth.middleware')

const router = Router()
//для отправки ссылки с пути /generate
router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')   //получаем путь, который на продакшене надо поменаять на доменное имя
        const {from} = req.body                 //с фронта придет наш обьект из заполненной форми

        const code = shortid.generate()         //метод генерации короткой ссылки

        const existing = await Link.findOne({from}) //проверка на уже присутствие ссылки в базе
        if( existing ) {
            return res.json({link:existing})
        }

        const to = baseUrl + '/t/' + code
        const link = new Link({                     //создаем новую короткую ссылку
            code, to, from, owner: req.user.userId
        })

        await link.save()
        res.status(201).json({link})        //передаем в json формате ссылку на фронт
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})
// для получения всех ссылок с базы
router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({owner: req.user.userId})
        res.json(links)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})
//для получения определенной ссылки по id
router.get('/:id', auth, async (req, res) => {
    try {

        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})


module.exports = router