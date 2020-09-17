import {useCallback} from "react";

//нужен для отображения ошибок с помощью крутой фичи в материалайз
export const useMessage = () => {
    return useCallback(text => {
        if(window.M && text) {      //в глобальном обьекте window, М это фишка материалайза, и если она  есть
            window.M.toast({ html: text })  //то выводим ее таким способом на экран
        }
    }, [])
}