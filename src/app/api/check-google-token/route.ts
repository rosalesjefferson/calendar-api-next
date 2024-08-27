import { NextRequest, NextResponse } from 'next/server';
import { google, } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    const cookiesStore = request.cookies;    
    const accessToken = cookiesStore.get('googleAccessToken')?.value;
    const refreshToken = cookiesStore.get('googleRefreshToken')?.value;
    
    console.log({ accessToken, refreshToken }, 'CHECK-GOOGLE-TOKEN');

    if (accessToken) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken || undefined,
      });

      try {
        const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
       
        if (!tokenInfo.scopes.includes('https://www.googleapis.com/auth/calendar')) {
          console.log({ accessToken, refreshToken, tokenInfo }, ' SCOPESS');
          return NextResponse.redirect('/google-auth?reason=insufficient_scope');
        } 
          console.log('insuficient code')
          return NextResponse.json({ isAuthenticated: true });
      } catch (tokenError) {
         // Token may have expired, try refreshing it
         console.log({tokenError} ,'tokenError')
        
        if (refreshToken) {
          const newTokens = await oauth2Client.refreshAccessToken();
          const newAccessToken = newTokens.credentials.access_token;

          console.log({newTokens} ,'newTokens')

          const response = NextResponse.json({ isAuthenticated: true });
        
          if(newAccessToken) {
            response.cookies.set('googleAccessToken', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 1000, // 1 hour
            });
          }

          if (newTokens.credentials.refresh_token) {
            response.cookies.set('googleRefreshToken', newTokens.credentials.refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
          }
          return response

        } else {
          return NextResponse.json({ isAuthenticated: false, error: 'No valid refresh token available' });
        }
      }
    }
    console.error('NO TOKENS')
    return NextResponse.json({ isAuthenticated: false });

  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ isAuthenticated: false, error: 'Invalid or expired token' });
  }
}