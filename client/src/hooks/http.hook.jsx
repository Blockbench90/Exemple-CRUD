import {useCallback, useState} from "react";

export const useHttp = () => {                      // делаем хук, который будет работать с асинхронными запросами на сервер, использоя нативный API браузера tetch
    const [loading, setLoading] = useState(false)   // для контроля загрузки
    const [error, setError] = useState(null)        // для контроля над ошибками

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {     //useCallback - чтобы не входить в рекурсию, и 4 параметра для работы
        setLoading(true)                                                //флаг о начале загрузки
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {body, method, headers})  //нативный API, принимает два параметра, адрес и обьект хедерсов
            const data = await response.json()                          //приводим data в json формат
            if (!response.ok) {                                         //если вдруг, ответ не "ок", значит отображаем ошибку
                throw new Error(data.message || "Что-то пошло не так")
            }
            setLoading(false)                                           //если ошибки не произошло, и поле "ок" в состоянии окей, приостановим флаг загрузки
            return data                                                 //и вернет обьект data в request
        } catch (e) {                       //если мы всеже попали в этот блок, значит всетаки есть ошибка
            setLoading(false)               //ставим флаг загрузки в false, он всетаки отработал, пускай и с ошибкой
            setError(e.message)             //фиксируем эту ошибку
            throw e                         //и выкидываем ее, для обработки
        }
    }, [])
    const clearError = useCallback(() => setError(null), [])        //простая функция для зачистки ошибок в стейте, с useCallback, чтобы избежать рекурсии

    return {loading, request, error, clearError}    // по умолчанию будем возвращать эти флаги
}