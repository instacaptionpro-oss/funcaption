// lib/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, onValue, update, increment } from 'firebase/database';

// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDMCRlv-gMmDIyaY9A7C-x7pCLvs68ndcg",
  authDomain: "iit-wars.firebaseapp.com",
  databaseURL: "https://iit-wars-default-rtdb.firebaseio.com", // ⚠️ MAKE SURE YOU HAVE THIS
  projectId: "iit-wars",
  storageBucket: "iit-wars.firebasestorage.app",
  messagingSenderId: "956116426600",
  appId: "1:956116426600:web:a6d135b6b11d4d77b5c0dd"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}

// ==========================================
// COMPETITION MANAGEMENT
// ==========================================

export const COMPETITION = {
  name: "IIT WARS 2025",
  startTime: new Date('2025-01-29T21:00:00+05:30'), // Today 9 PM IST
  endTime: new Date('2025-02-05T21:00:00+05:30'),   // 7 days later
  teams: ["IIT Bombay", "IIT Delhi"]
};

// Initialize competition
export async function initCompetition() {
  if (!db) {
    console.error('Database not initialized');
    return false;
  }

  try {
    const compRef = ref(db, 'competition/info');
    await set(compRef, {
      name: COMPETITION.name,
      startTime: COMPETITION.startTime.toISOString(),
      endTime: COMPETITION.endTime.toISOString(),
      status: 'live',
      teams: COMPETITION.teams,
      createdAt: Date.now()
    });

    // Initialize team scores
    for (const team of COMPETITION.teams) {
      const teamRef = ref(db, `leaderboard/${team}`);
      const snapshot = await get(teamRef);
      
      if (!snapshot.exists()) {
        await set(teamRef, {
          name: team,
          totalScore: 0,
          battles: 0,
          wins: 0,
          losses: 0,
          lastUpdated: Date.now()
        });
      }
    }

    console.log('✅ Competition initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Competition init failed:', error);
    return false;
  }
}

// Safe initialization (doesn't crash if fails)
export async function safeInitCompetition() {
  try {
    await initCompetition();
    return true;
  } catch (error) {
    console.error('Safe init failed, creating default data:', error);
    
    // Create minimal structure if Firebase fails
    try {
      const leaderboardRef = ref(db, 'leaderboard');
      await set(leaderboardRef, {
        "IIT Bombay": {
          name: "IIT Bombay",
          totalScore: 0,
          battles: 0,
          wins: 0,
          losses: 0,
          lastUpdated: Date.now()
        },
        "IIT Delhi": {
          name: "IIT Delhi",
          totalScore: 0,
          battles: 0,
          wins: 0,
          losses: 0,
          lastUpdated: Date.now()
        }
      });
      return true;
    } catch (fallbackError) {
      console.error('Even fallback failed:', fallbackError);
      return false;
    }
  }
}

// ==========================================
// SAVE BATTLE RESULT
// ==========================================

export async function saveBattle(battleData) {
  if (!db) {
    console.error('Database not initialized');
    return null;
  }

  try {
    const battleRef = push(ref(db, 'battles'));
    const battleId = battleRef.key;
    
    const battle = {
      id: battleId,
      college1: battleData.college1,
      college2: battleData.college2,
      score1: battleData.score1,
      score2: battleData.score2,
      winner: battleData.winner,
      template: battleData.template,
      roast: battleData.roast,
      userName: battleData.userName,
      userBranch: battleData.userBranch,
      timestamp: Date.now()
    };
    
    await set(battleRef, battle);
    
    // Update leaderboard
    await updateLeaderboard(battleData.college1, battleData.score1, battleData.winner === battleData.college1);
    await updateLeaderboard(battleData.college2, battleData.score2, battleData.winner === battleData.college2);
    
    // Increment total battles
    await incrementTotalBattles();
    
    console.log('✅ Battle saved:', battleId);
    return battleId;
  } catch (error) {
    console.error('❌ Save battle failed:', error);
    return null;
  }
}

// ==========================================
// UPDATE LEADERBOARD
// ==========================================

async function updateLeaderboard(college, score, isWinner) {
  if (!db) return;

  try {
    const collegeRef = ref(db, `leaderboard/${college}`);
    
    // Check if college exists
    const snapshot = await get(collegeRef);
    
    if (!snapshot.exists()) {
      // Create new entry
      await set(collegeRef, {
        name: college,
        totalScore: score,
        battles: 1,
        wins: isWinner ? 1 : 0,
        losses: isWinner ? 0 : 1,
        lastUpdated: Date.now()
      });
    } else {
      // Update existing
      await update(collegeRef, {
        totalScore: increment(score),
        battles: increment(1),
        wins: increment(isWinner ? 1 : 0),
        losses: increment(isWinner ? 0 : 1),
        lastUpdated: Date.now()
      });
    }
  } catch (error) {
    console.error('❌ Update leaderboard failed:', error);
  }
}

// ==========================================
// GET LEADERBOARD (REAL-TIME)
// ==========================================

export function subscribeToLeaderboard(callback) {
  if (!db) {
    console.error('Database not initialized');
    callback([]);
    return () => {};
  }

  const leaderboardRef = ref(db, 'leaderboard');
  
  return onValue(leaderboardRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const leaderboard = Object.values(data).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      callback(leaderboard);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('❌ Leaderboard subscription error:', error);
    callback([]);
  });
}

// ==========================================
// GET RECENT BATTLES (REAL-TIME)
// ==========================================

export function subscribeToRecentBattles(callback, limit = 10) {
  if (!db) {
    console.error('Database not initialized');
    callback([]);
    return () => {};
  }

  const battlesRef = ref(db, 'battles');
  
  return onValue(battlesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const battles = Object.values(data)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
      callback(battles);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('❌ Battles subscription error:', error);
    callback([]);
  });
}

// ==========================================
// GET LIVE STATS
// ==========================================

export function subscribeToLiveStats(callback) {
  if (!db) {
    callback({ totalBattles: 0, liveUsers: 0, lastBattleTime: null });
    return () => {};
  }

  const statsRef = ref(db, 'stats');
  
  return onValue(statsRef, (snapshot) => {
    const data = snapshot.val() || {
      totalBattles: 0,
      liveUsers: 0,
      lastBattleTime: null
    };
    callback(data);
  }, (error) => {
    console.error('❌ Stats subscription error:', error);
    callback({ totalBattles: 0, liveUsers: 0, lastBattleTime: null });
  });
}

// Update live users count
export async function updateLiveUsers(count) {
  if (!db) return;
  
  try {
    await set(ref(db, 'stats/liveUsers'), count);
  } catch (error) {
    console.error('❌ Update live users failed:', error);
  }
}

// Update total battles
export async function incrementTotalBattles() {
  if (!db) return;

  try {
    await update(ref(db, 'stats'), {
      totalBattles: increment(1),
      lastBattleTime: Date.now()
    });
  } catch (error) {
    console.error('❌ Increment battles failed:', error);
  }
}

// ==========================================
// COMPETITION STATUS
// ==========================================

export function getCompetitionStatus() {
  const now = new Date();
  const start = COMPETITION.startTime;
  const end = COMPETITION.endTime;
  
  if (now < start) {
    return {
      status: 'upcoming',
      message: 'Starts Soon',
      timeLeft: start - now
    };
  } else if (now >= start && now < end) {
    return {
      status: 'live',
      message: '🔴 LIVE NOW',
      timeLeft: end - now
    };
  } else {
    return {
      status: 'ended',
      message: 'Ended',
      timeLeft: 0
    };
  }
}

// ==========================================
// HEALTH CHECK
// ==========================================

export async function checkFirebaseConnection() {
  if (!db) {
    return { connected: false, error: 'Database not initialized' };
  }

  try {
    const testRef = ref(db, '.info/connected');
    const snapshot = await get(testRef);
    return { connected: true, data: snapshot.val() };
  } catch (error) {
    return { connected: false, error: error.message };
  }
  }
