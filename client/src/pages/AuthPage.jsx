import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)    //передаем наш созданный контекст
    const message = useMessage()        //импортируем хук с обработкой ошибок с выводом библиотекой материалайз
    const {loading, request, error, clearError} = useHttp()   //вызываем наш хук, и достаем от туда функции
    const [form, setForm] = useState({
        email: '', password: ''
    })
    useEffect( () => {
        message(error)  //передаем в хук ошибку
        clearError()    //и после защичаем
    }, [error, message, clearError])        //зависимости, чтобы не уходило в рекурсию
    useEffect(()=> {    //делаем активными поля ввода в материалайзе
        window.M.updateTextFields()
    }, [])
    const changeHandler = event => {                                          // Принимает событие
        setForm({...form, [event.target.name]: event.target.value})     // разворачиваем спрет оператором форму, и меняем значение в onChange
    }
    const registerHandler = async () => {                                                           //функция для регистрации пользователя
        try {
            const data = await request("/api/auth/register", "POST", {...form})     //создаем обьект дату и ждем пока выполнится наша функция реквест
                                                                                                     // "/api/auth/register" - путь указанный на бекенде в auth.routes.js
                                                                                                     // "POST" - метод
                                                                                                     //{...form} сама дата, которую мы передаем на сервер
            message(data.message)
        } catch (e) {}                                                                              //оставляем пустым, ведь мы его обработали в useHttp
    }
    const loginHandler = async () => {                                                          //таже беда что и с регистрацией, просто в другом url
        try {
            const data = await request("/api/auth/login", "POST", {...form})
            auth.login(data.token, data.userId)     //вытягиваем с контекста нужные данные
        } catch (e) {       //оставляем пустым, ведь мы его обработали в useHttp
        }
    }
        return (
            <div>
                <div className="col s6 offset-s3">
                    <h1>Сократи ссылку</h1>
                    <div className="card blue darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Авторизация</span>
                            <div>

                                <div className="input-field">
                                    <input placeholder="Введите Email"
                                           id="email"
                                           type="text"
                                           name="email"
                                           value={form.email}
                                           className="yellow-input"
                                           onChange={changeHandler}/>
                                    <label htmlFor="email">Email</label>
                                </div>

                                <div className="input-field">
                                    <input placeholder="Введите пароль"
                                           id="password"
                                           type="password"
                                           name="password"
                                           value={form.password}
                                           className="yellow-input"
                                           onChange={changeHandler}/>
                                    <label htmlFor="password">Password</label>
                                </div>

                            </div>
                        </div>
                        <div className="card-action">

                            <button
                                onClick={loginHandler}
                                className="btn yellow darken-4"
                                disabled={loading}                          //если в значении true, кнопка будет не активна
                                style={{marginRight: 10}}>Войти
                            </button>

                            <button
                                onClick={registerHandler}
                                disabled={loading}                              //если в значении true, кнопка будет не активна
                                className="btn grey lighten-1 black-text">Регистрация
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
}