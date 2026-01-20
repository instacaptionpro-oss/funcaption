// lib/templateRoasts.js

// Template definitions with enhanced prompts
export const ROAST_TEMPLATES = {
  placement: {
    id: 'placement',
    emoji: '💰',
    label: 'Placement Package Battle',
    color: '#FFD700',
    description: 'Compare salary packages & job offers',
    
    metrics: ['Average Package', 'Highest Package', 'Top Companies', 'Placement %'],
    
    prompt: `Focus on PLACEMENTS comparison. Use these exact numbers:
- Average packages (e.g., 21 LPA vs 8 LPA)
- Highest packages
- Top recruiters (Google, Microsoft vs local startups)
- Placement percentage
- Off-campus struggle stories

ROAST ANGLE: Money talks. Show the SALARY GAP brutally.`,
    
    comparisonMetrics: ['Average Package', 'Highest Package', 'Top Recruiters']
  },

  food: {
    id: 'food',
    emoji: '🍔',
    label: 'Hostel Food & Mess',
    color: '#FF6B35',
    description: 'Mess food quality showdown',
    
    metrics: ['Mess Quality', 'Variety', 'Student Rating', 'Hygiene'],
    
    prompt: `Focus on FOOD & HOSTEL comparison:
- Mess food quality (paneer tikka vs dal chawal repeat)
- Variety (15 items vs 3 items)
- Student complaints
- Hostel facilities

ROAST ANGLE: One college feeds students, other feeds disappointment.`,
    
    comparisonMetrics: ['Mess Food Quality', 'Variety', 'Hostel Facilities']
  },

  wifi: {
    id: 'wifi',
    emoji: '📶',
    label: 'WiFi & Internet Speed',
    color: '#00D4FF',
    description: 'Internet speed battle',
    
    metrics: ['WiFi Speed', 'Availability', 'Coverage', 'Reliability'],
    
    prompt: `Focus on INTERNET & WIFI comparison:
- WiFi speed (1 Gbps vs 2 Mbps)
- 24/7 availability vs limited hours
- Can stream 4K vs can't load memes
- LAN vs struggling with hotspot

ROAST ANGLE: One downloads movies, other waits 3 hours for WhatsApp.`,
    
    comparisonMetrics: ['WiFi Speed', 'Availability', 'Quality']
  },

  professors: {
    id: 'professors',
    emoji: '🎓',
    label: 'Teaching Quality & Professors',
    color: '#8B5CF6',
    description: 'Faculty & teaching comparison',
    
    metrics: ['PhD %', 'Teaching Style', 'Industry Experience', 'Student Rating'],
    
    prompt: `Focus on PROFESSORS & TEACHING:
- PhD percentage (85% vs 12%)
- Teaching style (interactive vs copy from board)
- Industry experience vs textbook only
- Student feedback

ROAST ANGLE: One teaches concepts, other teaches attendance.`,
    
    comparisonMetrics: ['Faculty Quality', 'Teaching Method', 'Student Rating']
  },

  infrastructure: {
    id: 'infrastructure',
    emoji: '🏟️',
    label: 'Campus & Infrastructure',
    color: '#10B981',
    description: 'Facilities & campus comparison',
    
    metrics: ['Campus Size', 'Buildings', 'Sports Facilities', 'Library'],
    
    prompt: `Focus on INFRASTRUCTURE comparison:
- Campus size (325 acres vs 5 acres)
- Modern AC buildings vs 1970s structure
- Olympic pool vs one cricket bat
- 24/7 library vs 9-5 with hard chairs

ROAST ANGLE: One is tech park, other survived partition.`,
    
    comparisonMetrics: ['Campus Size', 'Facilities', 'Modernization']
  },

  fest: {
    id: 'fest',
    emoji: '🎪',
    label: 'College Fest & Events',
    color: '#EC4899',
    description: 'Cultural fest comparison',
    
    metrics: ['Celebrity Guest', 'Footfall', 'Budget', 'Media Coverage'],
    
    prompt: `Focus on COLLEGE FESTS:
- Celebrity performers (Diljit vs local singer)
- Footfall (50,000 vs 200 forced students)
- Budget (₹2 crore vs ₹50k)
- Media coverage (national news vs WhatsApp group)

ROAST ANGLE: One is Coachella, other is society birthday party.`,
    
    comparisonMetrics: ['Celebrity Factor', 'Budget', 'Footfall']
  },

  roi: {
    id: 'roi',
    emoji: '💸',
    label: 'Fees vs Value (ROI)',
    color: '#F59E0B',
    description: 'Return on investment analysis',
    
    metrics: ['Total Fees', 'Avg Package', 'ROI Time', 'Worth'],
    
    prompt: `Focus on FEES VS VALUE:
- Total fees (₹8L vs ₹20L)
- Average package (18 LPA vs 4 LPA)
- ROI recovery time (8 months vs age 35)
- Worth it? (100% YES vs parents crying)

ROAST ANGLE: Show the brutal math of investment vs returns.`,
    
    comparisonMetrics: ['Total Fees', 'Avg Package', 'ROI']
  },

  alumni: {
    id: 'alumni',
    emoji: '👑',
    label: 'Alumni Success & Network',
    color: '#EF4444',
    description: 'Notable alumni achievements',
    
    metrics: ['Notable Alumni', 'CEOs', 'Avg Salary', 'Network'],
    
    prompt: `Focus on ALUMNI SUCCESS:
- Notable alumni (Sundar Pichai vs local CA uncle)
- CEO count (200+ vs 0)
- Average alumni salary (₹45 LPA vs ₹6 LPA)
- Unicorn founders (75+ vs 0)

ROAST ANGLE: One produces CEOs, other produces LinkedIn posts.`,
    
    comparisonMetrics: ['Notable Alumni', 'CEO Count', 'Success Rate']
  },

  library: {
    id: 'library',
    emoji: '📚',
    label: 'Library & Study Facilities',
    color: '#3B82F6',
    description: 'Study resources comparison',
    
    metrics: ['Hours', 'Book Count', 'Seats', 'Digital Access'],
    
    prompt: `Focus on LIBRARY & STUDY:
- Hours (24/7 vs 9-5)
- Books (3 lakh vs 500 missing)
- AC seats (1000+ vs 50 no AC)
- Digital access (IEEE, Springer vs Google maybe)

ROAST ANGLE: One has library, other has "library" in name only.`,
    
    comparisonMetrics: ['Library Hours', 'Resources', 'Facilities']
  },

  campusLife: {
    id: 'campusLife',
    emoji: '😎',
    label: 'Campus Life & Freedom',
    color: '#14B8A6',
    description: 'Overall vibe & freedom',
    
    metrics: ['Freedom Level', 'Vibe', 'Dating Scene', 'Fun Factor'],
    
    prompt: `Focus on CAMPUS LIFE:
- Freedom (high vs prison)
- Overall vibe (chill vs strict)
- Dating scene (active vs "hi" = suspended)
- Fun factor (9/10 vs 2/10)

ROAST ANGLE: One lives best life, other lives attendance anxiety.`,
    
    comparisonMetrics: ['Freedom', 'Campus Vibe', 'Student Life']
  }
};

// Get template by ID
export function getTemplate(templateId) {
  return ROAST_TEMPLATES[templateId] || ROAST_TEMPLATES.placement;
}

// Get all templates as array
export function getAllTemplates() {
  return Object.values(ROAST_TEMPLATES);
}

// Enhanced prompt generator for templates
export function generateTemplatePrompt(template, college, rivalCollege, collegeData, rivalData) {
  const basePrompt = template.prompt;
  
  // Extract relevant data based on template
  let specificData = extractTemplateData(template.id, collegeData, rivalData);
  
  return `${basePrompt}

**SPECIFIC DATA FOR ${college}:**
${specificData.yours}

**SPECIFIC DATA FOR ${rivalCollege}:**
${specificData.theirs}

Generate BRUTAL ${template.label} roast using this data.`;
}

// Extract template-specific data
function extractTemplateData(templateId, collegeData, rivalData) {
  let yours = "";
  let theirs = "";
  
  switch(templateId) {
    case 'placement':
      yours = `- Average: ${collegeData.placements?.average || 'Unknown'}
- Highest: ${collegeData.placements?.highest || 'Unknown'}
- Top Companies: ${collegeData.placements?.topRecruiters?.slice(0, 3).join(', ') || 'Local startups'}`;
      
      theirs = `- Average: ${rivalData.placements?.average || 'Unknown'}
- Highest: ${rivalData.placements?.highest || 'Unknown'}
- Top Companies: ${rivalData.placements?.topRecruiters?.slice(0, 3).join(', ') || 'Top MNCs'}`;
      break;
      
    case 'food':
      yours = `- Mess: ${collegeData.food?.mess || 'Average mess'}
- Quality: ${collegeData.food?.quality || '3/10'}
- Student Say: ${collegeData.food?.studentOpinion || 'Survivable'}`;
      
      theirs = `- Mess: ${rivalData.food?.mess || 'Good mess'}
- Quality: ${rivalData.food?.quality || '7/10'}
- Student Say: ${rivalData.food?.studentOpinion || 'Actually good'}`;
      break;
      
    case 'wifi':
      yours = `- Speed: ${collegeData.campus?.wifi || '10 Mbps'}
- Availability: ${collegeData.campus?.wifiHours || 'Limited'}`;
      
      theirs = `- Speed: ${rivalData.campus?.wifi || '1 Gbps'}
- Availability: ${rivalData.campus?.wifiHours || '24/7'}`;
      break;
      
    case 'infrastructure':
      yours = `- Campus: ${collegeData.campus?.area || 'Small campus'}
- Buildings: ${collegeData.campus?.infrastructure || 'Old'}
- Facilities: ${collegeData.campus?.facilities || 'Basic'}`;
      
      theirs = `- Campus: ${rivalData.campus?.area || 'Large campus'}
- Buildings: ${rivalData.campus?.infrastructure || 'Modern'}
- Facilities: ${rivalData.campus?.facilities || 'World-class'}`;
      break;
      
    case 'roi':
      yours = `- Fees: ${collegeData.academics?.fees || '₹8L'}
- Avg Package: ${collegeData.placements?.average || '6 LPA'}
- ROI: ${calculateROI(collegeData)}`;
      
      theirs = `- Fees: ${rivalData.academics?.fees || '₹10L'}
- Avg Package: ${rivalData.placements?.average || '21 LPA'}
- ROI: ${calculateROI(rivalData)}`;
      break;
      
    case 'alumni':
      yours = `- Notable: ${collegeData.alumni?.notable?.slice(0, 2).join(', ') || 'Local achievers'}
- Network: ${collegeData.alumni?.network || 'Limited'}`;
      
      theirs = `- Notable: ${rivalData.alumni?.notable?.slice(0, 2).join(', ') || 'Global leaders'}
- Network: ${rivalData.alumni?.network || 'Massive'}`;
      break;
      
    default:
      yours = `- Overall: ${collegeData.rankings?.reputation || 'Average'}`;
      theirs = `- Overall: ${rivalData.rankings?.reputation || 'Elite'}`;
  }
  
  return { yours, theirs };
}

// Calculate ROI
function calculateROI(collegeData) {
  const fees = parseFloat(collegeData.academics?.fees?.replace(/[^\d.]/g, '') || '8');
  const pkg = parseFloat(collegeData.placements?.average?.replace(/[^\d.]/g, '') || '6');
  
  const months = Math.ceil((fees / pkg) * 12);
  
  if (months <= 6) return "Excellent (< 6 months)";
  if (months <= 12) return "Good (< 1 year)";
  if (months <= 24) return "Average (1-2 years)";
  return "Poor (> 2 years)";
}
