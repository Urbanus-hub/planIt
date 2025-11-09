'use client';

import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
export default function UsersPage(){
    const [users,setUsers]=useState([]);
    useEffect(()=>{
      (async ()=>{
        try{
          const response=await authAPI.getAllUser();
            if(response.data.success){
                setUsers(response.data.data);
            }
        }catch(err){
            console.error("Failed to fetch users:",err);
        }
      })();
    },[])
    console.log("users",users);
    
    return(
        <div>
        welocme to users admin
        </div>
    )
}