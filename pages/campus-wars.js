import { useState, useEffect } from 'react';
import Head from 'next/head';
import CampusRoastCard from '../components/CampusRoastCard';
import { getAllCollegeNames } from '../data/colleges';

export default function CampusWars() {
  const [colleges, setColleges] = useState([]);
  const [college1, setCollege1] = useState('');
  const [college2, setCollege2] = useState('IIT Bombay');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setColleges(getAllCollegeNames());
  }, []);

  const handleBattle = async (e) => {
    e.preventDefault();
    
    if (!college1 || !college2) {
      alert('Select both colleges!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-college-roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college: college1,
          branch: 'CSE',
          topic: 'Overall Comparison',
          rivalCollege: college2,
          useTemplate: false
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data.roast);
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (error) {
      console.error(error);
      setResult({
        roast: `${college1} vs ${college2}\n\nAI couldn't decide. Both are mid. 💀`,
        yourScore: Math.floor(Math.random() * 30) + 50,
        rivalScore: Math.floor(Math.random() * 30) + 50,
        topic: 'Battle'
      });
    }

    setLoading(false);
  };

  const handleNewBattle = () => {
    setResult(null);
    setCollege1('');
    setCollege2('IIT Bombay');
  };

  const shareRoast = () => {
    const text = `${college1} vs ${college2}\n\n${result.roast}\n\nScore: ${result.yourScore} vs ${result.rivalScore}\n\nTry it: funcaption.space`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000', 
      color: '#fff',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Head>
        <title>Campus Wars - Battle Arena</title>
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: '#00FFFF',
            margin: '0 0 10px 0'
          }}>
            CAMPUS WARS
          </h1>
          <p style={{ color: '#999', fontSize: '1rem' }}>
            AI decides which college wins
          </p>
        </div>

        {!result ? (
          // BATTLE FORM
          <form onSubmit={handleBattle} style={{
            background: '#0a0a0a',
            border: '2px solid #00FFFF',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            
            {/* College 1 */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: '#00FFFF',
                fontWeight: '700',
                marginBottom: '10px',
                fontSize: '1rem'
              }}>
                College 1
              </label>
              <select
                value={college1}
                onChange={(e) => setCollege1(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#000',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Select college</option>
                {colleges.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* VS */}
            <div style={{
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: '900',
              color: '#FF0000',
              margin: '20px 0'
            }}>
              VS
            </div>

            {/* College 2 */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                color: '#00FFFF',
                fontWeight: '700',
                marginBottom: '10px',
                fontSize: '1rem'
              }}>
                College 2
              </label>
              <select
                value={college2}
                onChange={(e) => setCollege2(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#000',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              >
                {colleges.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !college1}
              style={{
                width: '100%',
                padding: '18px',
                background: loading || !college1 ? '#333' : '#00FFFF',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontSize: '1.1rem',
                fontWeight: '900',
                cursor: loading || !college1 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {loading ? 'BATTLING...' : 'START BATTLE'}
            </button>

          </form>
        ) : (
          // RESULTS
          <div>
            <CampusRoastCard 
              result={result}
              userData={{ college: college1, branch: 'CSE', name: 'User' }}
              battleData={{ rivalCollege: college2 }}
              selectedTemplate={{ color: '#00FFFF', label: 'Battle Result' }}
              onShare={shareRoast}
              onNewBattle={handleNewBattle}
            />
          </div>
        )}

      </div>
    </div>
  );
        }
