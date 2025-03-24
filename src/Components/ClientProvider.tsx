'use client';

import { ChatAppProvider } from '../Components/ChatAppContext';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    return <ChatAppProvider>{children}</ChatAppProvider>;
} 