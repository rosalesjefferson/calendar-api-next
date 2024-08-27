'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

import GoogleSignInButton from '../components/GoogleSigninButton';

const GoogleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const getAuthStatus = async() => {
        try{
          const res = await axios.get('/api/check-google-token')
          console.log(res, 'getAuthStatus')
          setIsAuthenticated(res?.data?.isAuthenticated)
        } catch (err) {
          console.log({ err }, 'catch')
        }       
    }
    getAuthStatus()
  }, [])

  return (
    <div className='w-screen h-screen flex items-center justify-center gap-10'>
        {!isAuthenticated ? 
             <GoogleSignInButton />
        : <div>Authenticated!</div>}
    </div>
  )
};

export default GoogleAuth;

