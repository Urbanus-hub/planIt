'use server'

import { cookies } from "next/headers"

const AUTH_COOKIE= "authToken"

export const setCookie = async(name:string, value:any)=>{
    const cookieStore = await cookies()


    const cooki = await cookieStore.set(name, value, {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'development' ? false : true,
        maxAge: 60*60*30*1000
    })


    return cooki

}


export const getCookie = async(name:string):Promise<string| undefined>=>{
    const cookieStore = await cookies();

    return cookieStore.get(name)?.value
}


export const setAuthCookie = async(value:any)=>{
    return await setCookie(AUTH_COOKIE, value)
}


export const getAuthCookie = async()=>{
    return await getCookie(AUTH_COOKIE)
}