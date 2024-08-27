
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { dateTime, email, subject } = await request.json();
  const accessToken = request.cookies.get('googleAccessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'No access token available' }, { status: 401 });
  }

  const formattedDateTime = `${dateTime}:00+08:00`; 

  const event = {
    summary: subject,
    start: {
      dateTime: formattedDateTime,
      timeZone: 'Asia/Manila',
    },
    end: {
      dateTime: formattedDateTime,
      timeZone: 'Asia/Manila',
    },
    attendees: [{ email }],
    conferenceData: {
      createRequest: {
        requestId: generateUniqueRequestId(),
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  console.log({ accessToken, payload: event }, 'CREATE EVENT');

  try {
    const res = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      event,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Event created:', res.data);
    return NextResponse.json({ message: 'Event created successfully', event: res.data });
  } catch (error: any) {
    console.error('Error creating calendar event:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to create event', details: error.response?.data }, { status: 500 });
  }
}

// Function to generate a unique request ID
function generateUniqueRequestId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}