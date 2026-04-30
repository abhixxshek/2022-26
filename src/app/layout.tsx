
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'GEC Idukki Memories | Batch 2022-2026',
  description: 'The official digital archive and yearbook for Government Engineering College Idukki. Preserving the legacy of our journey together.',
  keywords: ['GEC Idukki', 'Batch 2026', 'College Memories', 'Digital Yearbook', 'GEC Alumni'],
  authors: [{ name: 'GEC Idukki Contributors' }],
  openGraph: {
    title: 'GEC Idukki Memories | Batch 2022-2026',
    description: 'The official digital archive for Government Engineering College Idukki. A journey worth remembering.',
    url: 'https://gec-idukki-memories.web.app',
    siteName: 'GEC Idukki Memories Archive',
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
  twitter: {
    card: 'summary_large_image',
    title: 'GEC Idukki Memories | Batch 2022-2026',
    description: 'The legacy of Government Engineering College Idukki.',
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
