const express = require("express") //подключаем различные пакеты, для дальнейшей работы
const config = require("config")
const mongoose = require("mongoose")
const path = require('path')

const app = express()  //переменная теперь будет результатом вызова функции, тоесть иметь в себе все зависимости и методы express

app.use(express.json({extended: true}))  //мидлвеер для перевода в формат json

app.use('/api/auth', require('./routes/auth.routes'))  //регистрируем роуты для обработки запросов с фронта, где первый параметр - префикс к пути
app.use('/api/link', require('./routes/link.routes'))  //второй сам роут, файл
app.use('/t', require('./routes/redirect.routes'))      //Router по сути мидлвеер, тоесть промежуточный слой, для соединение и передачи чего-то с чем-то

if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = config.get('port') || 5000 //для удобства вынес Порт в файл config, а таким методом я его подключаю
                                        //и на всяк пожарный, если не сработает включаю порт 5000

async function start () {
    try{
        await mongoose.connect(config.get('mongoUrl'), {  //подключаемся к базе данных, которую захардкодим в файл конфиг
            useNewUrlParser: true,                          // и добавим несколько параметров для корректной работы
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, ()=>console.log(`App has been started an port ${PORT}`)) //прослушиваем Порт 5000, который для удобства вынес в файл config
    }catch (e) {
        console.log('Server Error', e.message)    //в случае если что-то пошло не так, выдаем ошибку
        process.exit(1)                         // и завершаем процесс
    }
}
start();

