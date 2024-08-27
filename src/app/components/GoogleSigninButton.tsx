'use client';

import { ComponentProps, useMemo, useState } from 'react';
import axios from 'axios';

type IProps = ComponentProps<'button'>

const GoogleSignInButton = ({ className, ...props }: IProps) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/google-auth-url');
      console.log({data}, 'handleGoogleSignIn')
      if (data.url) {
        window.location.href = data.url; // Redirect to Google OAuth URL
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  const errMessage = useMemo(() => {
    if(typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const reason = urlParams.get('reason');
      if(reason === 'insufficient_scope') {
        return 'You need additional permissions to access this resource. Please sign in again to update your permissions.';
      }
    }
      return ''
  }, [])
  

  return (
    <>
      {errMessage}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md ${className}`}
        {...props}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </>
  );
};

export default GoogleSignInButton;

   // TODO
    //  'missing_refresh_token':
    //   message = 'Your session has expired. Please sign in again to continue.';
    //   
    //  'not_authenticated':
    //   message = 'You need to be signed in to access this page.';
    //   
    //  'error':
    //   message = 'An error occurred during authentication. Please sign in again.';
