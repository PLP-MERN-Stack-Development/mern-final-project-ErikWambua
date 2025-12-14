// Generate random code for reservations
exports.generateReservationCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RES';
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Format phone number to Kenyan format
exports.formatPhoneNumber = (phone) => {
  // Remove any non-digit
  let cleaned = phone.replace(/\D/g, '');

  // Check if it starts with 254, if not convert
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }

  return cleaned;
};

// Calculate fare based on route and stages
exports.calculateFare = (route, startStageIndex, endStageIndex) => {
  const { baseFare, stageIncrements, peakMultiplier } = route.fareStructure;

  // Find the fare increment for this stage range
  const increment = stageIncrements.find(inc => 
    startStageIndex >= inc.fromStage && endStageIndex <= inc.toStage
  );

  let fare = increment ? increment.fare : baseFare;

  // Apply peak multiplier if during peak hours
  if (this.isPeakHour()) {
    fare *= peakMultiplier;
  }

  return Math.round(fare);
};

// Check if current time is peak hour
exports.isPeakHour = () => {
  const now = new Date();
  const hour = now.getHours();
  return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
};

// Format currency for Kenya
exports.formatCurrency = (amount) => {
  return `KSh ${amount.toLocaleString('en-KE')}`;
};

// Calculate distance between two coordinates
exports.calculateDistance = (coord1, coord2) => {
  const R = 6371e3; // metres
  const φ1 = coord1[1] * Math.PI/180;
  const φ2 = coord2[1] * Math.PI/180;
  const Δφ = (coord2[1]-coord1[1]) * Math.PI/180;
  const Δλ = (coord2[0]-coord1[0]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
};

// Generate a random alphanumeric string
exports.generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Parse coordinates from string
exports.parseCoordinates = (coordString) => {
  const [lng, lat] = coordString.split(',').map(Number);
  if (isNaN(lng) || isNaN(lat)) {
    throw new Error('Invalid coordinate string');
  }
  return [lng, lat];
};

// Calculate age from date of birth
exports.calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};