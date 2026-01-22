import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000', 
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Head>
        <title>Campus Wars - AI College Battle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        maxWidth: '600px', 
        width: '100%',
        textAlign: 'center'
      }}>
        
        {/* Title */}
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          color: '#00FFFF',
          margin: '0 0 20px 0',
          letterSpacing: '-2px'
        }}>
          CAMPUS WARS
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.5rem',
          color: '#fff',
          margin: '0 0 40px 0',
          fontWeight: '600'
        }}>
          Which college wins?
        </p>

        {/* Description */}
        <p style={{
          fontSize: '1rem',
          color: '#999',
          margin: '0 0 60px 0',
          lineHeight: '1.6'
        }}>
          AI battles two colleges and decides the winner.
          <br />
          Get savage roasts, real comparisons, live rankings.
        </p>

        {/* Start Button */}
        <Link href="/campus-wars">
          <button style={{
            padding: '24px 48px',
            background: '#00FFFF',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontSize: '1.2rem',
            fontWeight: '900',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
            START BATTLE
          </button>
        </Link>

        {/* Stats */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', color: '#00FFFF', fontWeight: '900' }}>1,247</div>
            <div>Battles Today</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', color: '#00FFFF', fontWeight: '900' }}>47</div>
            <div>Live Now</div>
          </div>
        </div>

      </div>
    </div>
  );
}
