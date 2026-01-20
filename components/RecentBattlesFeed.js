// components/RecentBattlesFeed.js

import { useState, useEffect } from 'react';
import { subscribeToRecentBattles } from '../lib/firebase';

export default function RecentBattlesFeed() {
  const [battles, setBattles] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToRecentBattles((data) => {
      setBattles(data);
    }, 5); // Show last 5 battles

    return () => unsubscribe();
  }, []);

  const getTeamColor = (teamName) => {
    if (teamName?.includes('Bombay')) return '#00D4FF';
    if (teamName?.includes('Delhi')) return '#FF4500';
    return '#FFD700';
  };

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: '800',
        color: '#fff',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>⚡</span>
        <span>Recent Battles</span>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#EF4444',
          animation: 'pulse 2s infinite',
          marginLeft: '8px'
        }} />
      </div>

      {battles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.9rem'
        }}>
          No battles yet. Start the first one! 🔥
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {battles.map((battle, index) => {
            const color1 = getTeamColor(battle.college1);
            const color2 = getTeamColor(battle.college2);
            const winnerColor = battle.winner === battle.college1 ? color1 : color2;

            return (
              <div
                key={battle.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  animation: index === 0 ? 'slideIn 0.5s ease' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* New badge for latest */}
                {index === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    letterSpacing: '0.5px'
                  }}>
                    NEW
                  </div>
                )}

                {/* Battle info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    <span style={{ color: color1 }}>{battle.college1}</span>
                    {' vs '}
                    <span style={{ color: color2 }}>{battle.college2}</span>
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: '600'
                  }}>
                    {timeAgo(battle.timestamp)}
                  </div>
                </div>

                {/* Scores */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '900',
                    color: battle.winner === battle.college1 ? color1 : 'rgba(255, 255, 255, 0.3)',
                    fontFamily: 'monospace'
                  }}>
                    {battle.score1}
                    {battle.winner === battle.college1 && ' 👑'}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: '600'
                  }}>
                    -
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '900',
                    color: battle.winner === battle.college2 ? color2 : 'rgba(255, 255, 255, 0.3)',
                    fontFamily: 'monospace'
                  }}>
                    {battle.score2}
                    {battle.winner === battle.college2 && ' 👑'}
                  </div>
                </div>

                {/* Template & User */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.4)'
                }}>
                  <span>{battle.template || 'Roast'}</span>
                  <span>by {battle.userName}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
    }
