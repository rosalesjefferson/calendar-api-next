import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: `${process.env.NEXT_PUBLIC_DEV_APP_URL}/api/auth/callback/google`,
    grant_type: 'authorization_code',
  }).toString();

  try {
    const res = await axios.post(
      'https://oauth2.googleapis.com/token',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token } = res.data;

    console.log( {res }, 'CALLBACK')

    const nextResponse = NextResponse.redirect(`${process.env.NEXT_PUBLIC_DEV_APP_URL}/appointment`);

    nextResponse.cookies.set('googleAccessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    nextResponse.cookies.set('googleRefreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return nextResponse;
  } catch (error: any) {
    console.error('Error exchanging code for tokens:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Error exchanging code for tokens' }, { status: 500 });
  }
}

  // const redirectUri =
  // process.env.NODE_ENV === 'production'
  //   ? `${process.env.NEXT_PUBLIC_PROD_APP_URL}/api/auth/callback/google`
  //   : `${process.env.NEXT_PUBLIC_DEV_APP_URL}/api/auth/callback/google`;
