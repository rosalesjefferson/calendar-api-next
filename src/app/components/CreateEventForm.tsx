'use client'

import axios from 'axios';
import { useState } from 'react';

export default function CreateEventForm() {
  const [dateTime, setDateTime] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const event = { dateTime, email, subject }
      const res = await axios.post('/api/create-event', event, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setMessage(res.data?.message || 'Event created successfully.');
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || 'An error occurred while creating the event.'
        
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Event</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateTime">
            Date & Time
          </label>
          <input
            id="dateTime"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Event
        </button>

        {message && (
          <div className="mt-4 text-center text-red-500">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

    // const res = await fetch('/api/create-event', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ dateTime, email, subject }),
      // });
         // const data = await res
      // if (res.ok) {
      //   setMessage(data.message);
      // } else {
      //   setMessage(data.error);
      // }

