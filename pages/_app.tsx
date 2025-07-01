import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Import font từ Google Fonts
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Cleanup function khi route change
    const handleRouteChange = (url: string) => {
      // Log route changes hoặc analytics
      console.log('App is changing to: ', url);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    // Cleanup
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}
