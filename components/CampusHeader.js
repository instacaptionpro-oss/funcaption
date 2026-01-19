// /components/CampusHeader.js

export default function CampusHeader({ userCollege, userName, onLogout }) {
  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto 30px auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '16px',
      flexWrap: 'wrap',
      gap: '15px'
    }}>
      <div style={{
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flex: 1
      }}>
        <div style={{
          background: '#00FFFF',
          color: '#000',
          padding: '8px 20px',
          borderRadius: '20px',
          fontWeight: '800',
          fontSize: '0.9rem'
        }}>
          {userCollege}
        </div>
        <span style={{
          color: '#999',
          fontSize: '0.95rem'
        }}>
          {userName}
        </span>
      </div>
      
      <button
        onClick={onLogout}
        style={{
          padding: '10px 20px',
          background: 'none',
          border: '1px solid #666',
          color: '#999',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          fontFamily: 'inherit'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#00FFFF';
          e.target.style.color = '#00FFFF';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#666';
          e.target.style.color = '#999';
        }}
      >
        🔄 Change College
      </button>
    </div>
  );
  }
