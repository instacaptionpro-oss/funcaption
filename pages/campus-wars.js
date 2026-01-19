import { useState, useEffect } from 'react';
import Head from 'next/head';
import CampusHeader from '../components/CampusHeader';
import CollegeLeaderboard from '../components/CollegeLeaderboard';
import { getAllCollegeNames } from '../data/colleges';

export default function CampusWars() {
  const [step, setStep] = useState('register'); // 'register' or 'battle'
  const [userData, setUserData] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    college: '',
    branch: 'CSE',
    name: ''
  });

  // Battle data
  const [battleData, setBattleData] = useState({
    topic: '',
    customTopic: '',
    rivalCollege: 'IIT Bombay',
    roastStyle: 'custom' // 'auto' or 'custom'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');

  const branches = [
    'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 
    'Chemical', 'Aerospace', 'Biotechnology', 'Other'
  ];

  const topics = [
    { id: 'placements', label: '💼 Placements', emoji: '💼' },
    { id: 'campus', label: '🏫 Campus Life', emoji: '🏫' },
    { id: 'food', label: '🍽️ Food & Hostel', emoji: '🍽️' },
    { id: 'academics', label: '📚 Academics', emoji: '📚' },
    { id: 'location', label: '📍 Location', emoji: '📍' },
    { id: 'fees', label: '💰 Fees vs Value', emoji: '💰' },
    { id: 'custom', label: '✍️ Custom Topic', emoji: '✍️' }
  ];

  useEffect(() => {
    // Load colleges
    setColleges(getAllCollegeNames());

    // Check if user already registered
    const saved = localStorage.getItem('campusWarUser');
    if (saved) {
      setUserData(JSON.parse(saved));
      setStep('battle');
    }
  }, []);

  const filteredColleges = colleges.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!formData.college || !formData.name) {
      alert('College and Name required!');
      return;
    }

    const user = {
      college: formData.college,
      name: formData.name,
      branch: formData.branch,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem('campusWarUser', JSON.stringify(user));
    setUserData(user);
    setStep('battle');
  };

  const handleLogout = () => {
    localStorage.removeItem('campusWarUser');
    setUserData(null);
    setStep('register');
    setResult(null);
  };

  const handleAddCollege = () => {
    if (newCollegeName.trim().length < 3) {
      alert('Enter valid college name (min 3 characters)');
      return;
    }

    // Add to local list
    setColleges([...colleges, newCollegeName.trim()]);
    setFormData({...formData, college: newCollegeName.trim()});
    
    // Submit to Google Form (you'll add this URL)
    // For now, just alert
    alert(`✅ "${newCollegeName}" submitted!\n\nWe'll add it in next update.\nFor now, you can use it!`);
    
    setShowAddCollege(false);
    setNewCollegeName('');
  };

  const handleGenerateRoast = async (e) => {
    e.preventDefault();

    const topic = battleData.topic === 'custom' ? 
      battleData.customTopic : 
      topics.find(t => t.id === battleData.topic)?.label || 'everything';

    if (!topic || (battleData.topic === 'custom' && !battleData.customTopic.trim())) {
      alert('Select topic or write custom topic!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-college-roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college: userData.college,
          branch: userData.branch,
          topic: topic,
          rivalCollege: battleData.rivalCollege
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
      // Fallback roast
      setResult({
        roast: `${userData.college} se ho? Chutiye IIT Bombay dekh ke jal rahe ho 💀\nUnka avg 21 LPA, tumhara sapne mein bhi nahi\nReality check lelo bc 😂`,
        yourScore: Math.floor(Math.random() * 30) + 40,
        rivalScore: 85,
        comparisons: [
          { metric: 'Placements', yours: 'Mid', theirs: 'Best', winner: 'rival' },
          { metric: 'Campus', yours: 'Good', theirs: 'Elite', winner: 'rival' }
        ],
        topic: topic
      });
    }

    setLoading(false);
  };

  const shareRoast = () => {
    const text = `🎓 Campus Wars Roast\n\n${userData.college} (${userData.branch})\nvs\n${battleData.rivalCollege}\n\n💀 ${result.roast}\n\nScore: ${result.yourScore}/100\n\nCheck yours: aurapro.app/campus-wars`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('📋 Copied to clipboard!');
    }
  };

  // REGISTRATION SCREEN
  if (step === 'register') {
    return (
      <div style={{ minHeight: '100vh', background: '#000', padding: '20px' }}>
        <Head>
          <title>Campus Wars - College Roast Battle</title>
        </Head>

        <div style={{
          maxWidth: '500px',
          margin: '50px auto',
          background: '#0a0a0a',
          border: '2px solid #00FFFF',
          borderRadius: '24px',
          padding: '40px 30px',
          boxShadow: '0 20px 60px rgba(0, 255, 255, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎓⚔️</div>
            <h1 style={{
              fontSize: '2.5rem',
              color: '#00FFFF',
              margin: '0 0 10px 0',
              fontWeight: '900',
              textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
            }}>
              CAMPUS WARS
            </h1>
            <p style={{ color: '#999', fontSize: '1rem', margin: 0 }}>
              Register to start roasting your college
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* College Selection */}
            <div>
              <label style={{
                display: 'block',
                color: '#00FFFF',
                fontWeight: '700',
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                Select Your College *
              </label>
              
              {!showAddCollege ? (
                <>
                  <input
                    type="text"
                    placeholder="🔍 Search college..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#000',
                      border: '2px solid #333',
                      borderRadius: '10px',
                      color: '#fff',
                      marginBottom: '10px',
                      fontSize: '0.95rem'
                    }}
                  />
                  
                  <select
                    value={formData.college}
                    onChange={(e) => setFormData({...formData, college: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: '#000',
                      border: '2px solid #333',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Choose your college</option>
                    {filteredColleges.map(college => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowAddCollege(true)}
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      padding: '10px',
                      background: 'none',
                      border: '1px dashed #666',
                      borderRadius: '8px',
                      color: '#999',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    + My college not listed
                  </button>
                </>
              ) : (
                <div>
                  <input
                    type="text"
                    value={newCollegeName}
                    onChange={(e) => setNewCollegeName(e.target.value)}
                    placeholder="Enter college name"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: '#000',
                      border: '2px solid #00FFFF',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      marginBottom: '10px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleAddCollege}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#00FFFF',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCollege(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#222',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#999',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Branch Selection */}
            <div>
              <label style={{
                display: 'block',
                color: '#00FFFF',
                fontWeight: '700',
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                Branch *
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#000',
                  border: '2px solid #333',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label style={{
                display: 'block',
                color: '#00FFFF',
                fontWeight: '700',
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                Your Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#000',
                  border: '2px solid #333',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '18px',
                background: 'linear-gradient(135deg, #00FFFF, #0088FF)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '1.1rem',
                fontWeight: '800',
                cursor: 'pointer',
                marginTop: '10px',
                fontFamily: 'inherit',
                boxShadow: '0 10px 30px rgba(0, 255, 255, 0.4)'
              }}
            >
              🔥 START BATTLE
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#666',
            marginTop: '20px'
          }}>
            Data saved locally. Anonymous roasting.
          </p>
        </div>
      </div>
    );
  }

  // BATTLE SCREEN
  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '20px' }}>
      <Head>
        <title>Campus Wars - Battle Arena</title>
      </Head>

      <CampusHeader 
        userCollege={userData.college}
        userName={userData.name}
        onLogout={handleLogout}
      />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 1024 ? '2fr 1fr' : '1fr',
        gap: '30px'
      }}>
        
        {/* Main Battle Section */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '20px',
          padding: '30px'
        }}>
          <h1 style={{
            fontSize: '2rem',
            color: '#00FFFF',
            marginBottom: '10px',
            fontWeight: '900'
          }}>
            ⚔️ START ROAST BATTLE
          </h1>
          <p style={{ color: '#999', marginBottom: '30px', fontSize: '0.95rem' }}>
            Select topic and rival to generate savage roast
          </p>

          {!result ? (
            <form onSubmit={handleGenerateRoast} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              
              {/* Topic Selection */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#00FFFF',
                  fontWeight: '700',
                  marginBottom: '12px',
                  fontSize: '0.95rem'
                }}>
                  Choose Roast Topic
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px'
                }}>
                  {topics.map(topic => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setBattleData({...battleData, topic: topic.id})}
                      style={{
                        padding: '15px',
                        background: battleData.topic === topic.id ? 
                          'rgba(0, 255, 255, 0.2)' : '#000',
                        border: battleData.topic === topic.id ? 
                          '2px solid #00FFFF' : '1px solid #333',
                        borderRadius: '12px',
                        color: battleData.topic === topic.id ? '#00FFFF' : '#999',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                    >
                      {topic.emoji} {topic.label.replace(topic.emoji, '').trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Topic Input */}
              {battleData.topic === 'custom' && (
                <div>
                  <input
                    type="text"
                    value={battleData.customTopic}
                    onChange={(e) => setBattleData({...battleData, customTopic: e.target.value})}
                    placeholder="e.g., Internship opportunities, Faculty quality..."
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: '#000',
                      border: '2px solid #00FFFF',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              )}

              {/* Rival Selection */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#00FFFF',
                  fontWeight: '700',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  Select Rival College (Benchmark)
                </label>
                <select
                  value={battleData.rivalCollege}
                  onChange={(e) => setBattleData({...battleData, rivalCollege: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#000',
                    border: '2px solid #333',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="IIT Bombay">IIT Bombay (Default Benchmark)</option>
                  {colleges.filter(c => c !== userData.college).map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !battleData.topic}
                style={{
                  padding: '18px',
                  background: loading || !battleData.topic ? 
                    '#333' : 'linear-gradient(135deg, #FF4500, #FF6347)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  cursor: loading || !battleData.topic ? 'not-allowed' : 'pointer',
                  marginTop: '10px',
                  fontFamily: 'inherit',
                  boxShadow: loading || !battleData.topic ? 'none' : '0 10px 30px rgba(255, 69, 0, 0.4)'
                }}
              >
                {loading ? '⏳ Generating Roast...' : '💀 GENERATE SAVAGE ROAST'}
              </button>
            </form>
          ) : (
            // RESULT CARD (Mobile-first vertical design)
            <div>
              <div style={{
                background: '#000',
                border: '2px solid #00FFFF',
                borderRadius: '20px',
                padding: '25px',
                marginBottom: '20px',
                boxShadow: '0 10px 40px rgba(0, 255, 255, 0.3)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    color: '#00FFFF',
                    margin: '0 0 5px 0',
                    fontWeight: '900'
                  }}>
                    BATTLE RESULT
                  </h2>
                  <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                    Topic: {result.topic}
                  </p>
                </div>

                {/* YOUR COLLEGE */}
                <div style={{
                  background: 'rgba(0, 255, 255, 0.1)',
                  border: '2px solid #00FFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#00FFFF',
                    fontWeight: '700',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                  }}>
                    YOUR COLLEGE
                  </div>
                  <div style={{
                    fontSize: '1.3rem',
                    color: '#fff',
                    fontWeight: '800',
                    marginBottom: '5px'
                  }}>
                    {userData.college}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#999',
                    marginBottom: '15px'
                  }}>
                    {userData.branch}
                  </div>
                  
                  <div style={{
                    fontSize: '2.5rem',
                    color: '#00FFFF',
                    fontWeight: '900',
                    marginBottom: '10px'
                  }}>
                    {result.yourScore}/100
                  </div>
                  
                  <div style={{
                    background: '#000',
                    height: '12px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #00FFFF40'
                  }}>
                    <div style={{
                      width: `${result.yourScore}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #00FFFF, #00AAFF)',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>

                {/* VS */}
                <div style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  color: '#FF4500',
                  fontWeight: '900',
                  margin: '15px 0'
                }}>
                  ⚔️ VS
                </div>

                {/* RIVAL COLLEGE */}
                <div style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '2px solid #FFD700',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#FFD700',
                    fontWeight: '700',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                  }}>
                    RIVAL / BENCHMARK
                  </div>
                  <div style={{
                    fontSize: '1.3rem',
                    color: '#fff',
                    fontWeight: '800',
                    marginBottom: '5px'
                  }}>
                    {battleData.rivalCollege}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#999',
                    marginBottom: '15px'
                  }}>
                    {userData.branch}
                  </div>
                  
                  <div style={{
                    fontSize: '2.5rem',
                    color: '#FFD700',
                    fontWeight: '900',
                    marginBottom: '10px'
                  }}>
                    {result.rivalScore}/100
                  </div>
                  
                  <div style={{
                    background: '#000',
                    height: '12px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #FFD70040'
                  }}>
                    <div style={{
                      width: `${result.rivalScore}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>

                {/* COMPARISONS */}
                {result.comparisons && result.comparisons.length > 0 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#999',
                      fontWeight: '700',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>
                      📊 COMPARISONS
                    </div>
                    {result.comparisons.map((comp, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: i < result.comparisons.length - 1 ? '1px solid #222' : 'none'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#666',
                          fontWeight: '600'
                        }}>
                          {comp.metric}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          fontSize: '0.85rem',
                          fontWeight: '700'
                        }}>
                          <span style={{ color: comp.winner === 'you' ? '#00FF00' : '#FF4444' }}>
                            {comp.yours}
                          </span>
                          <span style={{ color: '#666' }}>{comp.winner === 'you' ? '>' : '<'}</span>
                          <span style={{ color: comp.winner === 'rival' ? '#FFD700' : '#666' }}>
                            {comp.theirs}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ROAST TEXT */}
                <div style={{
                  background: 'rgba(255, 69, 0, 0.1)',
                  border: '2px solid #FF4500',
                  borderRadius: '16px',
                  padding: '20px'
                }}>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#FF4500',
                    fontWeight: '700',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    💀 THE ROAST
                  </div>
                  <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.7',
                    color: '#fff',
                    margin: 0,
                    fontWeight: '600',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {result.roast}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                <button
                  onClick={shareRoast}
                  style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #00FFFF, #0088FF)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#000',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  📱 Share Roast
                </button>
                
                <button
                  onClick={() => setResult(null)}
                  style={{
                    padding: '16px',
                    background: '#222',
                    border: '1px solid #666',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  🔄 New Battle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard (Desktop only) */}
        {window.innerWidth > 1024 && (
          <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <CollegeLeaderboard userCollege={userData.college} />
          </div>
        )}
      </div>
    </div>
  );
        }
