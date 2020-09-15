import React, {useCallback, useContext, useState, useEffect} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {LinkCard} from "../components/LinkCard";
import {useParams} from "react-router-dom";


export const DetailPage = () => {
    const {auth} = useContext(AuthContext)
    const [link, setLink] = useState(null)
    const {request, loading} = useHttp()
    const linkId = useParams().id

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer${auth.token}`
            })
            setLink(fetched)
        } catch (e) {}
    }, [auth, linkId, request])

    useEffect(() => {
        getLink()
    }, [getLink])

    if (loading) {
        return <Loader/>
    }
    return (
        <>
            {!loading && link && <LinkCard link={link}/>}
        </>
    )
}