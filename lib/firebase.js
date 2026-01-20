// lib/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, onValue, update, increment } from 'firebase/database';

// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDMCRlv-gMmDIyaY9A7C-x7pCLvs68ndcg",
  authDomain: "iit-wars.firebaseapp.com",
  databaseURL: "https://iit-wars-default-rtdb.firebaseio.com",
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
  console.log('✅ ========================================');
  console.log('✅ FIREBASE INITIALIZED SUCCESSFULLY');
  console.log('✅ Database URL:', firebaseConfig.databaseURL);
  console.log('✅ ========================================');
} catch (error) {
  console.error('❌ ========================================');
  console.error('❌ FIREBASE INITIALIZATION FAILED');
  console.error('❌ Error:', error.message);
  console.error('❌ Config:', firebaseConfig);
  console.error('❌ ========================================');
}

// ==========================================
// COMPETITION MANAGEMENT - REAL DATES
// ==========================================

export const COMPETITION = {
  name: "IIT WARS 2025",
  startTime: new Date('2025-01-20T21:00:00+05:30'), // 20th Jan 2025, 9 PM IST
  endTime: new Date('2025-01-28T21:00:00+05:30'),   // 28th Jan 2025, 9 PM IST (8 DAYS)
  teams: ["IIT Bombay", "IIT Delhi"]
};

// Initialize competition - NO SAMPLE DATA
export async function initCompetition() {
  if (!db) {
    console.error('❌ [INIT COMPETITION] Database not initialized');
    return false;
  }

  try {
    console.log('🔄 [INIT COMPETITION] Starting...');
    console.log('📅 [INIT COMPETITION] Start:', COMPETITION.startTime.toISOString());
    console.log('📅 [INIT COMPETITION] End:', COMPETITION.endTime.toISOString());
    
    const compRef = ref(db, 'competition/info');
    await set(compRef, {
      name: COMPETITION.name,
      startTime: COMPETITION.startTime.toISOString(),
      endTime: COMPETITION.endTime.toISOString(),
      status: 'live',
      teams: COMPETITION.teams,
      createdAt: Date.now()
    });

    console.log('✅ [INIT COMPETITION] Competition info saved');

    // Initialize team scores ONLY if they don't exist
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
        console.log(`✅ [INIT COMPETITION] Created leaderboard for ${team} with ZERO score`);
      } else {
        const currentData = snapshot.val();
        console.log(`ℹ️ [INIT COMPETITION] ${team} already exists - Score: ${currentData.totalScore}, Battles: ${currentData.battles}`);
      }
    }

    console.log('✅ [INIT COMPETITION] Competition initialized - NO FAKE DATA ADDED');
    return true;
  } catch (error) {
    console.error('❌ [INIT COMPETITION] Failed:', error.message);
    console.error('❌ [INIT COMPETITION] Stack:', error.stack);
    return false;
  }
}

// Safe initialization (doesn't crash if fails)
export async function safeInitCompetition() {
  try {
    console.log('🔄 [SAFE INIT] Starting safe initialization...');
    await initCompetition();
    return true;
  } catch (error) {
    console.error('❌ [SAFE INIT] Failed:', error.message);
    
    // Create minimal structure if Firebase fails
    try {
      console.log('🔄 [SAFE INIT] Attempting fallback initialization...');
      const leaderboardRef = ref(db, 'leaderboard');
      
      // Check if data already exists
      const snapshot = await get(leaderboardRef);
      
      if (!snapshot.exists()) {
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
        console.log('✅ [SAFE INIT] Fallback initialization successful - ZERO scores');
      } else {
        console.log('ℹ️ [SAFE INIT] Leaderboard already exists, keeping current data');
      }
      return true;
    } catch (fallbackError) {
      console.error('❌ [SAFE INIT] Even fallback failed:', fallbackError.message);
      return false;
    }
  }
}

// ==========================================
// SAVE BATTLE RESULT - REAL DATA ONLY
// ==========================================

export async function saveBattle(battleData) {
  if (!db) {
    console.error('❌ [SAVE BATTLE] Database not initialized');
    return null;
  }

  try {
    console.log('🔄 [SAVE BATTLE] Saving REAL battle:', battleData.college1, 'vs', battleData.college2);
    console.log('📊 [SAVE BATTLE] Scores:', battleData.score1, 'vs', battleData.score2);
    console.log('🏆 [SAVE BATTLE] Winner:', battleData.winner);
    
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
    console.log('✅ [SAVE BATTLE] Battle saved with ID:', battleId);
    
    // Update leaderboard with REAL scores
    await updateLeaderboard(battleData.college1, battleData.score1, battleData.winner === battleData.college1);
    await updateLeaderboard(battleData.college2, battleData.score2, battleData.winner === battleData.college2);
    
    // Increment total battles
    await incrementTotalBattles();
    
    console.log('✅ [SAVE BATTLE] Leaderboard updated with REAL scores');
    return battleId;
  } catch (error) {
    console.error('❌ [SAVE BATTLE] Failed:', error.message);
    console.error('❌ [SAVE BATTLE] Battle data:', battleData);
    return null;
  }
}

// ==========================================
// UPDATE LEADERBOARD - REAL SCORES ONLY
// ==========================================

async function updateLeaderboard(college, score, isWinner) {
  if (!db) {
    console.error('❌ [UPDATE LEADERBOARD] Database not initialized');
    return;
  }

  try {
    console.log(`🔄 [UPDATE LEADERBOARD] Updating ${college}`);
    console.log(`📊 [UPDATE LEADERBOARD] Adding Score: ${score}, Winner: ${isWinner}`);
    
    const collegeRef = ref(db, `leaderboard/${college}`);
    
    // Check if college exists
    const snapshot = await get(collegeRef);
    
    if (!snapshot.exists()) {
      console.log(`ℹ️ [UPDATE LEADERBOARD] Creating new entry for ${college}`);
      await set(collegeRef, {
        name: college,
        totalScore: score,
        battles: 1,
        wins: isWinner ? 1 : 0,
        losses: isWinner ? 0 : 1,
        lastUpdated: Date.now()
      });
      console.log(`✅ [UPDATE LEADERBOARD] ${college} created - Initial score: ${score}`);
    } else {
      const oldData = snapshot.val();
      console.log(`ℹ️ [UPDATE LEADERBOARD] ${college} old score: ${oldData.totalScore}`);
      
      await update(collegeRef, {
        totalScore: increment(score),
        battles: increment(1),
        wins: increment(isWinner ? 1 : 0),
        losses: increment(isWinner ? 0 : 1),
        lastUpdated: Date.now()
      });
      
      const newSnapshot = await get(collegeRef);
      const newData = newSnapshot.val();
      console.log(`✅ [UPDATE LEADERBOARD] ${college} new score: ${newData.totalScore} (added ${score})`);
    }
  } catch (error) {
    console.error(`❌ [UPDATE LEADERBOARD] Failed for ${college}:`, error.message);
  }
}

// ==========================================
// GET LEADERBOARD (REAL-TIME)
// ==========================================

export function subscribeToLeaderboard(callback) {
  if (!db) {
    console.error('❌ [SUBSCRIBE LEADERBOARD] Database not initialized');
    callback([]);
    return () => {};
  }

  console.log('🔄 [SUBSCRIBE LEADERBOARD] Setting up real-time listener...');
  const leaderboardRef = ref(db, 'leaderboard');
  
  return onValue(leaderboardRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const leaderboard = Object.values(data).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      console.log('✅ [SUBSCRIBE LEADERBOARD] REAL DATA received:', leaderboard.length, 'entries');
      leaderboard.forEach(college => {
        console.log(`📊 [LEADERBOARD] ${college.name}: ${college.totalScore} points (${college.battles} battles, ${college.wins}W/${college.losses}L)`);
      });
      callback(leaderboard);
    } else {
      console.warn('⚠️ [SUBSCRIBE LEADERBOARD] No data found - leaderboard is empty');
      callback([]);
    }
  }, (error) => {
    console.error('❌ [SUBSCRIBE LEADERBOARD] Subscription error:', error.message);
    callback([]);
  });
}

// ==========================================
// GET RECENT BATTLES (REAL-TIME)
// ==========================================

export function subscribeToRecentBattles(callback, limit = 10) {
  if (!db) {
    console.error('❌ [SUBSCRIBE BATTLES] Database not initialized');
    callback([]);
    return () => {};
  }

  console.log('🔄 [SUBSCRIBE BATTLES] Setting up real-time listener...');
  const battlesRef = ref(db, 'battles');
  
  return onValue(battlesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const battles = Object.values(data)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
      console.log('✅ [SUBSCRIBE BATTLES] REAL DATA received:', battles.length, 'battles');
      battles.slice(0, 3).forEach((battle, i) => {
        console.log(`📊 [RECENT BATTLE ${i+1}] ${battle.college1} (${battle.score1}) vs ${battle.college2} (${battle.score2}) - Winner: ${battle.winner}`);
      });
      callback(battles);
    } else {
      console.warn('⚠️ [SUBSCRIBE BATTLES] No battles found - waiting for first battle');
      callback([]);
    }
  }, (error) => {
    console.error('❌ [SUBSCRIBE BATTLES] Subscription error:', error.message);
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
    console.log('✅ [SUBSCRIBE STATS] Stats updated - Battles:', data.totalBattles, 'Live Users:', data.liveUsers);
    callback(data);
  }, (error) => {
    console.error('❌ [SUBSCRIBE STATS] Subscription error:', error.message);
    callback({ totalBattles: 0, liveUsers: 0, lastBattleTime: null });
  });
}

// Update live users count
export async function updateLiveUsers(count) {
  if (!db) return;
  
  try {
    await set(ref(db, 'stats/liveUsers'), count);
  } catch (error) {
    console.error('❌ [UPDATE LIVE USERS] Failed:', error.message);
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
    console.log('✅ [INCREMENT BATTLES] Total battles count incremented');
  } catch (error) {
    console.error('❌ [INCREMENT BATTLES] Failed:', error.message);
  }
}

// ==========================================
// COMPETITION STATUS
// ==========================================

export function getCompetitionStatus() {
  const now = new Date();
  const start = COMPETITION.startTime;
  const end = COMPETITION.endTime;
  
  const nowIST = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log('📅 [COMPETITION STATUS] Current time (IST):', nowIST);
  console.log('📅 [COMPETITION STATUS] Start:', start.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('📅 [COMPETITION STATUS] End:', end.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  
  if (now < start) {
    console.log('ℹ️ [COMPETITION STATUS] Status: UPCOMING - Competition has not started yet');
    return {
      status: 'upcoming',
      message: 'Starting Soon',
      timeLeft: start - now
    };
  } else if (now >= start && now < end) {
    const hoursLeft = Math.floor((end - now) / (1000 * 60 * 60));
    console.log(`✅ [COMPETITION STATUS] Status: LIVE - ${hoursLeft} hours remaining`);
    return {
      status: 'live',
      message: '🔴 LIVE NOW',
      timeLeft: end - now
    };
  } else {
    console.log('⚠️ [COMPETITION STATUS] Status: ENDED - Competition is over');
    return {
      status: 'ended',
      message: 'Competition Ended',
      timeLeft: 0
    };
  }
}

// ==========================================
// HEALTH CHECK
// ==========================================

export async function checkFirebaseConnection() {
  if (!db) {
    console.error('❌ [HEALTH CHECK] Database not initialized');
    return { connected: false, error: 'Database not initialized' };
  }

  try {
    console.log('🔄 [HEALTH CHECK] Testing Firebase connection...');
    const testRef = ref(db, 'leaderboard');
    const snapshot = await get(testRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const colleges = Object.values(data);
      console.log('✅ [HEALTH CHECK] Connection successful');
      colleges.forEach(c => {
        console.log(`   📊 ${c.name}: ${c.totalScore} points, ${c.battles} battles`);
      });
    } else {
      console.log('✅ [HEALTH CHECK] Connection successful - Leaderboard empty (no battles yet)');
    }
    
    return { connected: true, hasData: snapshot.exists() };
  } catch (error) {
    console.error('❌ [HEALTH CHECK] Connection failed:', error.message);
    return { connected: false, error: error.message };
  }
}

// Auto-run health check on import
setTimeout(async () => {
  console.log('');
  console.log('🔍 ======================================== 🔍');
  console.log('🔍 RUNNING FIREBASE HEALTH CHECK');
  console.log('🔍 ======================================== 🔍');
  
  const health = await checkFirebaseConnection();
  const status = getCompetitionStatus();
  
  console.log('');
  console.log('📊 ======== COMPETITION INFO ======== 📊');
  console.log(`📅 Competition: ${COMPETITION.name}`);
  console.log(`🚦 Status: ${status.message}`);
  console.log(`🔥 Only REAL battle scores count!`);
  console.log(`⚔️ No fake data - Pure competition!`);
  console.log('📊 ==================================== 📊');
  console.log('');
  
  if (health.connected) {
    console.log('✅ ======================================== ✅');
    console.log('✅ FIREBASE STATUS: OPERATIONAL');
    console.log('✅ Data exists:', health.hasData);
    console.log('✅ Ready for REAL battles!');
    console.log('✅ ======================================== ✅');
  } else {
    console.error('❌ ======================================== ❌');
    console.error('❌ FIREBASE STATUS: FAILED');
    console.error('❌ Error:', health.error);
    console.error('❌ ======================================== ❌');
  }
  console.log('');
}, 2000);
