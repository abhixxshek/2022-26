
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'JNV Memories | Batch 2018-2025',
  description: 'The official digital archive and yearbook for Jawahar Navodaya Vidyalaya Batch of 2018-2025. Preserving a seven-year legacy.',
  openGraph: {
    title: 'JNV Memories | Batch 2018-2025',
    description: 'The official digital archive for Jawahar Navodaya Vidyalaya Batch of 2018-2025. Once a Navodayan, Always a Navodayan.',
    url: 'https://jnv-memories.web.app',
    siteName: 'JNV Memories Archive',
    images: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/en/d/d1/Navodaya_Vidyalaya_Samiti_logo.png',
        width: 800,
        height: 800,
        alt: 'JNV Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
