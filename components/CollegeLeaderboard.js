// /components/CollegeLeaderboard.js

export default function CollegeLeaderboard({ userCollege }) {
  // Fake leaderboard data (will be real later with database)
  const leaderboard = [
    { rank: 1, college: "IIT Bombay", avgScore: 78, totalRoasts: 2341 },
    { rank: 2, college: "BITS Pilani", avgScore: 76, totalRoasts: 1823 },
    { rank: 3, college: "IIT Delhi", avgScore: 74, totalRoasts: 2156 },
    { rank: 4, college: "IIT Madras", avgScore: 72, totalRoasts: 1891 },
    { rank: 5, college: "IIIT Hyderabad", avgScore: 70, totalRoasts: 1456 },
    { rank: 6, college: "NIT Trichy", avgScore: 68, totalRoasts: 1234 },
    { rank: 7, college: "DTU Delhi", avgScore: 65, totalRoasts: 1123 },
    { rank: 8, college: "NSUT Delhi", avgScore: 63, totalRoasts: 987 },
    { rank: 9, college: "VIT Vellore", avgScore: 60, totalRoasts: 876 },
    { rank: 10, college: "Manipal MIT", avgScore: 58, totalRoasts: 734 },
  ];

  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '20px',
      padding: '25px'
    }}>
      <h3 style={{
        color: '#FFD700',
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: '900',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🏆 College Rankings
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {leaderboard.map((item) => (
          <div
            key={item.rank}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: item.college === userCollege ? 
                'rgba(0, 255, 255, 0.1)' : '#000',
              border: item.college === userCollege ? 
                '2px solid #00FFFF' : '1px solid #222',
              borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
              <span style={{
                color: item.rank <= 3 ? '#FFD700' : '#666',
                fontWeight: '900',
                fontSize: '1.2rem',
                minWidth: '30px'
              }}>
                #{item.rank}
              </span>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  color: item.college === userCollege ? '#00FFFF' : '#fff',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  marginBottom: '4px'
                }}>
                  {item.college}
                  {item.college === userCollege && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '0.7rem',
                      background: '#00FFFF',
                      color: '#000',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      YOU
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#666'
                }}>
                  {item.totalRoasts.toLocaleString()} roasts
                </div>
              </div>
            </div>

            <div style={{
              color: '#00FFFF',
              fontWeight: '800',
              fontSize: '1.1rem'
            }}>
              {item.avgScore}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(0, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px dashed #00FFFF40'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#00FFFF',
          textAlign: 'center',
          marginBottom: '8px',
          fontWeight: '700'
        }}>
          💡 Boost Your College Rank
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: '#666',
          textAlign: 'center'
        }}>
          Generate more roasts to climb the leaderboard!
        </div>
      </div>
    </div>
  );
                }
