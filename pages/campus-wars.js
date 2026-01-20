// pages/campus-wars.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import CampusHeader from '../components/CampusHeader';
import TemplateSelector from '../components/TemplateSelector';
import CampusRoastCard from '../components/CampusRoastCard';
import LiveLeaderboard from '../components/LiveLeaderboard';
import RecentBattlesFeed from '../components/RecentBattlesFeed';
import { getAllCollegeNames } from '../data/colleges';
import { getTemplate } from '../lib/templateRoasts';

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
    roastStyle: 'template', // 'template' or 'classic'
    selectedTemplate: null
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');

  const branches = [
    'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 
    'Chemical', 'Aerospace', 'Biotechnology', 'Other'
  ];

  // Classic topics (keep for backwards compatibility)
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

    // Initialize Firebase Competition
    const initFirebase = async () => {
      try {
        const { initCompetition } = await import('../lib/firebase');
        await initCompetition();
        console.log('✅ Firebase Competition Initialized!');
      } catch (error) {
        console.error('Firebase init failed:', error);
      }
    };

    initFirebase();
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

    setColleges([...colleges, newCollegeName.trim()]);
    setFormData({...formData, college: newCollegeName.trim()});
    
    alert(`✅ "${newCollegeName}" submitted!\n\nWe'll add it in next update.\nFor now, you can use it!`);
    
    setShowAddCollege(false);
    setNewCollegeName('');
  };

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setBattleData({
      ...battleData,
      selectedTemplate: template,
      topic: template.id,
      roastStyle: 'template'
    });
  };

  // Enhanced roast generation with Firebase save
  const handleGenerateRoast = async (e) => {
    e.preventDefault();

    let finalTopic = '';
    
    if (battleData.roastStyle === 'template' && battleData.selectedTemplate) {
      finalTopic = battleData.selectedTemplate.label;
    } else if (battleData.topic === 'custom') {
      finalTopic = battleData.customTopic;
    } else {
      finalTopic = topics.find(t => t.id === battleData.topic)?.label || 'everything';
    }

    if (!finalTopic || (battleData.topic === 'custom' && !battleData.customTopic.trim())) {
      alert('Select template or topic first!');
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
          topic: finalTopic,
          rivalCollege: battleData.rivalCollege,
          templateId: battleData.selectedTemplate?.id,
          useTemplate: battleData.roastStyle === 'template'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data.roast);
        
        // 🔥 SAVE TO FIREBASE
        try {
          const { saveBattle } = await import('../lib/firebase');
          await saveBattle({
            college1: userData.college,
            college2: battleData.rivalCollege,
            score1: data.roast.yourScore,
            score2: data.roast.rivalScore,
            winner: data.roast.yourScore > data.roast.rivalScore ? userData.college : battleData.rivalCollege,
            template: battleData.selectedTemplate?.label || finalTopic,
            roast: data.roast.roast,
            userName: userData.name,
            userBranch: userData.branch
          });
          console.log('✅ Battle saved to Firebase!');
        } catch (firebaseError) {
          console.error('Firebase save failed:', firebaseError);
          // Don't block user, just log error
        }
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (error) {
      console.error(error);
      // Fallback roast
      setResult({
        roast: `${userData.college} se ho? Chutiye ${battleData.rivalCollege} dekh ke jal rahe ho 💀\n\nReality check lelo bc 😂`,
        yourScore: Math.floor(Math.random() * 30) + 40,
        rivalScore: 85,
        comparisons: [
          { metric: 'Overall', yours: 'Mid', theirs: 'Elite', winner: 'rival' }
        ],
        topic: finalTopic
      });
    }

    setLoading(false);
  };

  const shareRoast = () => {
    const templateName = battleData.selectedTemplate?.label || 'Roast';
    const text = `🎓 IIT Wars - ${templateName}\n\n${userData.college} (${userData.branch})\nvs\n${battleData.rivalCollege}\n\n💀 ${result.roast}\n\nScore: ${result.yourScore}/100\n\nJoin the battle: aurapro.app/campus-wars`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('📋 Copied to clipboard!');
    }
  };

  const handleNewBattle = () => {
    setResult(null);
    setBattleData({
      ...battleData,
      selectedTemplate: null,
      topic: '',
      customTopic: ''
    });
  };

  // ==========================================
  // REGISTRATION SCREEN
  // ==========================================
  if (step === 'register') {
    return (
      <div style={{ minHeight: '100vh', background: '#000', padding: '20px' }}>
        <Head>
          <title>IIT Wars - Register for Battle</title>
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
              IIT WARS 2025
            </h1>
            <p style={{ color: '#999', fontSize: '1rem', margin: 0 }}>
              IIT Bombay vs IIT Delhi - 7 Day Battle
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
              🔥 JOIN THE WAR
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#666',
            marginTop: '20px'
          }}>
            7-day competition • Live leaderboard • Real-time battles
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // BATTLE SCREEN
  // ==========================================
  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '20px' }}>
      <Head>
        <title>IIT Wars - Live Battle Arena</title>
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
        gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth > 1024 ? '1fr 420px' : '1fr',
        gap: '30px'
      }}>
        
        {/* ==========================================
            MAIN BATTLE SECTION (LEFT)
            ========================================== */}
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
            Select template and rival to generate savage roast
          </p>

          {!result ? (
            <form onSubmit={handleGenerateRoast} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              
              {/* MODE SELECTOR */}
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => setBattleData({...battleData, roastStyle: 'template', topic: ''})}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: battleData.roastStyle === 'template' ? '#00FFFF' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: battleData.roastStyle === 'template' ? '#000' : '#999',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  🎨 Template Mode
                </button>
                <button
                  type="button"
                  onClick={() => setBattleData({...battleData, roastStyle: 'classic', selectedTemplate: null})}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: battleData.roastStyle === 'classic' ? '#00FFFF' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: battleData.roastStyle === 'classic' ? '#000' : '#999',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  ⚡ Quick Mode
                </button>
              </div>

              {/* TEMPLATE MODE */}
              {battleData.roastStyle === 'template' && (
                <TemplateSelector 
                  onSelectTemplate={handleSelectTemplate}
                  selectedTemplate={battleData.selectedTemplate}
                />
              )}

              {/* CLASSIC MODE */}
              {battleData.roastStyle === 'classic' && (
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

                  {battleData.topic === 'custom' && (
                    <div style={{ marginTop: '12px' }}>
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
                  Select Rival College
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
                  <option value="IIT Bombay">IIT Bombay</option>
                  <option value="IIT Delhi">IIT Delhi</option>
                  {colleges.filter(c => c !== userData.college && c !== 'IIT Bombay' && c !== 'IIT Delhi').map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || (battleData.roastStyle === 'template' ? !battleData.selectedTemplate : !battleData.topic)}
                style={{
                  padding: '18px',
                  background: loading || (battleData.roastStyle === 'template' ? !battleData.selectedTemplate : !battleData.topic) ? 
                    '#333' : 'linear-gradient(135deg, #FF4500, #FF6347)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  cursor: loading || (battleData.roastStyle === 'template' ? !battleData.selectedTemplate : !battleData.topic) ? 'not-allowed' : 'pointer',
                  marginTop: '10px',
                  fontFamily: 'inherit',
                  boxShadow: loading || (battleData.roastStyle === 'template' ? !battleData.selectedTemplate : !battleData.topic) ? 'none' : '0 10px 30px rgba(255, 69, 0, 0.4)'
                }}
              >
                {loading ? '⏳ Generating Roast...' : '💀 GENERATE SAVAGE ROAST'}
              </button>
            </form>
          ) : (
            <CampusRoastCard 
              result={result}
              userData={userData}
              battleData={battleData}
              selectedTemplate={battleData.selectedTemplate}
              onShare={shareRoast}
              onNewBattle={handleNewBattle}
            />
          )}
        </div>

        {/* ==========================================
            LIVE LEADERBOARD & FEED (RIGHT SIDEBAR)
            ========================================== */}
        {typeof window !== 'undefined' && window.innerWidth > 1024 && (
          <div style={{ 
            position: 'sticky', 
            top: '20px', 
            height: 'fit-content',
            maxHeight: 'calc(100vh - 40px)',
            overflowY: 'auto'
          }}>
            <LiveLeaderboard />
            <RecentBattlesFeed />
          </div>
        )}
      </div>

      {/* ==========================================
          MOBILE LEADERBOARD (BOTTOM)
          ========================================== */}
      {typeof window !== 'undefined' && window.innerWidth <= 1024 && !result && (
        <div style={{ maxWidth: '1400px', margin: '30px auto 0' }}>
          <LiveLeaderboard />
          <RecentBattlesFeed />
        </div>
      )}
    </div>
  );
               }
