'use client';

import { useContext } from 'react';
import { ChatAppContext } from '@/Components/ChatAppContext';

export default function Home() {
  const { title } = useContext(ChatAppContext);

  return (
    <div>
        <h1 className="text-4xl font-bold">{title}</h1>
    </div>
  );
}
