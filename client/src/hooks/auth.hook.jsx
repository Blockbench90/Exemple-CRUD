import {useCallback, useEffect, useState} from "react";

const storageName = 'userData'

export const useAuth = () => {                          //данная функция будет создавать стейт и хранить данные пользователя в куке
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)

    const login = useCallback( (jwtToken, id) => {      //метод для входа, где мы будем принимать с бека jwtToken, id
        setToken(jwtToken)              //установим в стейт
        setUserId(id)                   //установим в стейт
        localStorage.setItem(storageName, JSON.stringify({      //установим в базовый браузерный API
            userId: id, token:jwtToken
        }))
    }, [])
    const logout = useCallback( () => {                 //метод для выхода
        setToken(null)                                      //зануляем токен
        setUserId(null)                                     //зануляем id
        localStorage.removeItem(storageName)                     //перезатираем  localStorage
    }, [])

    useEffect(()=>{     //чтобы при загрузке проперять localStorage, создадим этот метод
        const data = JSON.parse(localStorage.getItem(storageName))  //переводим в json формат
        //и небольшая проверка, если в localStorage уже есть данные пользователя
        if (data && data.token) {           //если данные есть,
            login(data.token, data.userId)  //то вызываем логин, и пользователь заходит уже как зарегестрированный
        }
        setReady(true)
    }, [login])     //указываем зависимость, поскольку мы ее используем
    return {login, logout, token, userId, ready}                //возвращаем наши методы, для доступа из вне
}