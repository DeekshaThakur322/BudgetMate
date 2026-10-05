import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../ApiClient/interceptor';

const SignOut=()=> {
    const {setUser} = useAuth();
    const navigate = useNavigate();
    const logout= async ()=>{
    try{
        await apiClient.post("/auth/sign-out");
        setUser(null);
        navigate("/signin");
    }catch(err){
        console.log(err.message);
    }
    };
    useEffect(()=> {
        logout();
    },[]);
  return <></>
  
};

export default SignOut;
