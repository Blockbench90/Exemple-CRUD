import React, {useContext} from "react";
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

//наше навигационное меню
export const Navbar = () => {
    const auth = useContext(AuthContext)    //достаем наш контекст
    const history = useHistory()
    const logoutHandler = event => {
        event.preventDefault()  //отменим дефолтное поведение ссылки, чтобы не обрабатывалась
        auth.logout()           //вызываем метод выхода
        history.push('/')       //и чтобы редиректнуться с помощью хистори
    }
    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
                <span className="brand-logo">Сокращение ссылок</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to='/create'>Создать</NavLink></li>
                    <li><NavLink to='/links'>Ссылки</NavLink></li>
                    <li><a href='/' onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}



