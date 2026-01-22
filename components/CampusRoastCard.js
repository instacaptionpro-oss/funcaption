import { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function CampusRoastCard({ 
  result, 
  userData, 
  battleData, 
  selectedTemplate,
  onShare,
  onNewBattle 
}) {
  const cardRef = useRef(null);

  if (!result) return null;

  const downloadAsImage = async () => {
    if (!cardRef.current) return;

    try {
      const actionButtons = cardRef.current.nextElementSibling;
      if (actionButtons) actionButtons.style.display = 'none';

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false
      });

      if (actionButtons) actionButtons.style.display = 'grid';

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `campus-wars-battle.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Download failed. Try again.');
    }
  };

  return (
    <div>
      {/* Result Card */}
      <div 
        ref={cardRef}
        style={{
          background: '#0a0a0a',
          border: '2px solid #00FFFF',
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '20px'
        }}
      >
        
        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #333'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '900',
            color: '#00FFFF',
            margin: '0'
          }}>
            BATTLE RESULT
          </h2>
        </div>

        {/* Scores */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '20px',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          
          {/* College 1 Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#999',
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              {userData.college}
            </div>
            <div style={{
              fontSize: '4rem',
              fontWeight: '900',
              color: result.yourScore > result.rivalScore ? '#00FF00' : '#fff',
              fontFamily: 'monospace'
            }}>
              {result.yourScore}
            </div>
          </div>

          {/* VS */}
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            color: '#FF0000'
          }}>
            VS
          </div>

          {/* College 2 Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#999',
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              {battleData.rivalCollege}
            </div>
            <div style={{
              fontSize: '4rem',
              fontWeight: '900',
              color: result.rivalScore > result.yourScore ? '#00FF00' : '#fff',
              fontFamily: 'monospace'
            }}>
              {result.rivalScore}
            </div>
          </div>
        </div>

        {/* Winner */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '10px 30px',
            background: '#00FFFF',
            color: '#000',
            borderRadius: '8px',
            fontWeight: '900',
            fontSize: '1.2rem'
          }}>
            {result.yourScore > result.rivalScore ? 
              `${userData.college} WINS` : 
              `${battleData.rivalCollege} WINS`
            }
          </div>
        </div>

        {/* Roast */}
        <div style={{
          background: '#000',
          border: '2px solid #FF0000',
          borderRadius: '8px',
          padding: '30px',
          marginTop: '30px'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#FF0000',
            fontWeight: '900',
            marginBottom: '15px',
            textAlign: 'center',
            letterSpacing: '2px'
          }}>
            THE ROAST
          </div>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#fff',
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {result.roast}
          </p>
        </div>

      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px'
      }}>
        <button
          onClick={downloadAsImage}
          style={{
            padding: '15px',
            background: '#333',
            border: '1px solid #666',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Download
        </button>

        <button
          onClick={onShare}
          style={{
            padding: '15px',
            background: '#00FFFF',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Share
        </button>
        
        <button
          onClick={onNewBattle}
          style={{
            padding: '15px',
            background: '#333',
            border: '1px solid #666',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          New Battle
        </button>
      </div>
    </div>
  );
            }
