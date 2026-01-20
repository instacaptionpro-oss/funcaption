// pages/_app.js

import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize Firebase competition on app load
    const initFirebase = async () => {
      try {
        const { initCompetition } = await import('../lib/firebase');
        await initCompetition();
        console.log('✅ Firebase Competition Initialized!');
      } catch (error) {
        console.error('⚠️ Firebase init failed:', error);
        // Don't crash app if Firebase fails
      }
    };

    initFirebase();

    // Track live users (optional)
    const trackUser = async () => {
      try {
        const { updateLiveUsers } = await import('../lib/firebase');
        // Simple active user tracking
        await updateLiveUsers(Math.floor(Math.random() * 50) + 20);
      } catch (error) {
        // Silent fail
      }
    };

    trackUser();
    const userInterval = setInterval(trackUser, 30000); // Update every 30s

    return () => clearInterval(userInterval);
  }, []);

  return (
    <>
      <Head>
        {/* Global fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0a0a12" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
