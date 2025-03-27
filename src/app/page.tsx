'use client';

import { useContext } from 'react';
import { ChatAppContext } from '@/Context/ChatAppContext';
import Navbar from '@/Components/Navbar';

export default function Home() {
  const chatContext = useContext(ChatAppContext);

  if (!chatContext) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
        <h1 className="text-4xl font-bold">
          {chatContext.userName ? chatContext.userName : 'guest'}
        </h1>
    </div>
  );
}
