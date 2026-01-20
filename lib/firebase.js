// lib/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, onValue, update, increment } from 'firebase/database';

// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDMCRlv-gMmDIyaY9A7C-x7pCLvs68ndcg",
  authDomain: "iit-wars.firebaseapp.com",
  databaseURL: "https://iit-wars-default-rtdb.firebaseio.com", // ⚠️ ADD YOUR DATABASE URL HERE
  projectId: "iit-wars",
  storageBucket: "iit-wars.firebasestorage.app",
  messagingSenderId: "956116426600",
  appId: "1:956116426600:web:a6d135b6b11d4d77b5c0dd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
  const compRef = ref(db, 'competition/info');
  await set(compRef, {
    name: COMPETITION.name,
    startTime: COMPETITION.startTime.toISOString(),
    endTime: COMPETITION.endTime.toISOString(),
    status: 'live',
    teams: COMPETITION.teams
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
}

// ==========================================
// SAVE BATTLE RESULT
// ==========================================

export async function saveBattle(battleData) {
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
  
  return battleId;
}

// ==========================================
// UPDATE LEADERBOARD
// ==========================================

async function updateLeaderboard(college, score, isWinner) {
  const collegeRef = ref(db, `leaderboard/${college}`);
  
  await update(collegeRef, {
    totalScore: increment(score),
    battles: increment(1),
    wins: increment(isWinner ? 1 : 0),
    losses: increment(isWinner ? 0 : 1),
    lastUpdated: Date.now()
  });
}

// ==========================================
// GET LEADERBOARD (REAL-TIME)
// ==========================================

export function subscribeToLeaderboard(callback) {
  const leaderboardRef = ref(db, 'leaderboard');
  
  return onValue(leaderboardRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const leaderboard = Object.values(data).sort((a, b) => b.totalScore - a.totalScore);
      callback(leaderboard);
    } else {
      callback([]);
    }
  });
}

// ==========================================
// GET RECENT BATTLES (REAL-TIME)
// ==========================================

export function subscribeToRecentBattles(callback, limit = 10) {
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
  });
}

// ==========================================
// GET LIVE STATS
// ==========================================

export function subscribeToLiveStats(callback) {
  const statsRef = ref(db, 'stats');
  
  return onValue(statsRef, (snapshot) => {
    const data = snapshot.val() || {
      totalBattles: 0,
      liveUsers: 0,
      lastBattleTime: null
    };
    callback(data);
  });
}

// Update live users count
export async function updateLiveUsers(count) {
  await set(ref(db, 'stats/liveUsers'), count);
}

// Update total battles
export async function incrementTotalBattles() {
  await update(ref(db, 'stats'), {
    totalBattles: increment(1),
    lastBattleTime: Date.now()
  });
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
      message: 'Competition starts soon!',
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
      message: 'Competition Ended',
      timeLeft: 0
    };
  }
}
