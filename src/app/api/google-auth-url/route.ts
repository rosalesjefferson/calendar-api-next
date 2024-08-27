import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// GENERATE URL
export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_DEV_APP_URL}/api/auth/callback/google` // Your redirect URI
    );

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];
    
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });
    console.log({url}, 'GENERATE URL')
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate Google OAuth URL' }
    );
  }
}

 // const redirectUri =
  // process.env.NODE_ENV === 'production'
  //   ? `${process.env.NEXT_PUBLIC_PROD_APP_URL}/api/auth/callback/google`
  //   : `${process.env.NEXT_PUBLIC_DEV_APP_URL}/api/auth/callback/google`;
