const geolib = require('geolib');
const math = require('mathjs');

// Calculate distance between two coordinates in meters
exports.calculateDistance = (coord1, coord2) => {
  return geolib.getDistance(
    { latitude: coord1[1], longitude: coord1[0] },
    { latitude: coord2[1], longitude: coord2[0] }
  );
};

// Calculate bearing/direction between two coordinates
exports.calculateBearing = (coord1, coord2) => {
  const lat1 = math.unit(coord1[1], 'deg').toNumber('rad');
  const lat2 = math.unit(coord2[1], 'deg').toNumber('rad');
  const lon1 = math.unit(coord1[0], 'deg').toNumber('rad');
  const lon2 = math.unit(coord2[0], 'deg').toNumber('rad');

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  
  const bearing = math.unit(math.atan2(y, x), 'rad').toNumber('deg');
  
  return (bearing + 360) % 360; // Normalize to 0-360
};

// Calculate ETA based on distance and speed
exports.calculateETA = (distance, currentSpeed, trafficFactor = 1.0) => {
  // distance in meters, speed in km/h
  const speedMps = (currentSpeed * 1000) / 3600;
  let timeSeconds = distance / speedMps;
  
  // Apply traffic factor
  timeSeconds *= trafficFactor;
  
  // Add buffer for stops
  timeSeconds *= 1.2;
  
  return Math.max(Math.ceil(timeSeconds / 60), 1); // Return in minutes
};

// Calculate fare based on distance and route
exports.calculateFare = (distance, baseFare, perKmRate) => {
  const distanceKm = distance / 1000;
  const variableFare = distanceKm * perKmRate;
  const totalFare = baseFare + variableFare;
  
  return Math.ceil(totalFare / 5) * 5; // Round to nearest 5 KSh
};

// Calculate route similarity (for route matching)
exports.calculateRouteSimilarity = (route1, route2) => {
  const intersection = route1.filter(point => 
    route2.some(p2 => this.calculateDistance(point, p2) < 100) // Within 100m
  );
  
  return intersection.length / Math.max(route1.length, route2.length);
};

// Calculate optimal pickup point
exports.findOptimalPickupPoint = (passengerLocation, routeStages, maxDistance = 500) => {
  let optimalStage = null;
  let minDistance = Infinity;
  let minIndex = -1;

  routeStages.forEach((stage, index) => {
    const distance = this.calculateDistance(passengerLocation, stage.location.coordinates);
    
    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      optimalStage = stage;
      minIndex = index;
    }
  });

  return {
    stage: optimalStage,
    distance: minDistance,
    index: minIndex,
    isWithinRange: minDistance <= maxDistance
  };
};

// Calculate vehicle proximity to stage
exports.calculateProximityScore = (vehicleLocation, stageLocation, maxRadius = 200) => {
  const distance = this.calculateDistance(vehicleLocation, stageLocation);
  
  if (distance > maxRadius) {
    return 0;
  }
  
  return 1 - (distance / maxRadius);
};

// Calculate capacity utilization percentage
exports.calculateCapacityUtilization = (currentPassengers, maxCapacity) => {
  if (maxCapacity <= 0) return 0;
  
  const utilization = (currentPassengers / maxCapacity) * 100;
  
  // Map to crowd level
  if (utilization < 20) return { utilization, level: 'empty' };
  if (utilization < 40) return { utilization, level: 'low' };
  if (utilization < 60) return { utilization, level: 'half' };
  if (utilization < 80) return { utilization, level: 'high' };
  if (utilization < 100) return { utilization, level: 'full' };
  return { utilization, level: 'standing' };
};

// Calculate estimated revenue for a trip
exports.estimateRevenue = (route, passengerCount, isPeakHour = false) => {
  const baseRevenue = passengerCount * route.fareStructure.baseFare;
  
  if (isPeakHour) {
    return baseRevenue * route.fareStructure.peakMultiplier;
  }
  
  return baseRevenue;
};

// Calculate fuel consumption estimate
exports.calculateFuelConsumption = (distance, vehicleType = 'matatu') => {
  const km = distance / 1000;
  let kmPerLitre;
  
  switch (vehicleType) {
    case 'matatu':
      kmPerLitre = 5; // 5 km per litre for typical matatu
      break;
    case 'shuttle':
      kmPerLitre = 8;
      break;
    default:
      kmPerLitre = 7;
  }
  
  const litres = km / kmPerLitre;
  const cost = litres * 150; // Assuming fuel at 150 KSh per litre
  
  return {
    distanceKm: km,
    litres,
    cost,
    kmPerLitre
  };
};

// Calculate time to reach based on traffic conditions
exports.calculateTrafficAdjustedTime = (distance, baseSpeed, trafficData) => {
  const baseTime = distance / baseSpeed; // in hours
  
  let trafficMultiplier = 1.0;
  
  // Adjust based on traffic data
  if (trafficData.congestion === 'high') {
    trafficMultiplier = 2.0;
  } else if (trafficData.congestion === 'medium') {
    trafficMultiplier = 1.5;
  } else if (trafficData.congestion === 'low') {
    trafficMultiplier = 1.2;
  }
  
  // Adjust for weather
  if (trafficData.weather === 'rain') {
    trafficMultiplier *= 1.3;
  } else if (trafficData.weather === 'fog') {
    trafficMultiplier *= 1.5;
  }
  
  // Adjust for road conditions
  if (trafficData.roadCondition === 'poor') {
    trafficMultiplier *= 1.4;
  }
  
  const adjustedTime = baseTime * trafficMultiplier;
  
  return {
    baseTime: baseTime * 60, // Convert to minutes
    adjustedTime: adjustedTime * 60, // Convert to minutes
    trafficMultiplier,
    congestion: trafficData.congestion
  };
};

// Calculate geofence boundary
exports.calculateGeofence = (center, radius = 1000) => {
  // radius in meters
  const earthRadius = 6371000; // meters
  
  const lat = center[1];
  const lng = center[0];
  
  // Angular distance in radians
  const angularDistance = radius / earthRadius;
  
  // Calculate bounding box
  const minLat = lat - (angularDistance * 180 / Math.PI);
  const maxLat = lat + (angularDistance * 180 / Math.PI);
  
  // Longitude calculation varies with latitude
  const deltaLng = Math.asin(Math.sin(angularDistance) / Math.cos(lat * Math.PI / 180));
  const minLng = lng - (deltaLng * 180 / Math.PI);
  const maxLng = lng + (deltaLng * 180 / Math.PI);
  
  return {
    center,
    radius,
    bounds: {
      minLat,
      maxLat,
      minLng,
      maxLng
    },
    polygon: this.generateGeofencePolygon(center, radius, 12) // 12-sided polygon
  };
};

// Generate polygon points for geofence
exports.generateGeofencePolygon = (center, radius, sides = 12) => {
  const points = [];
  const earthRadius = 6371000; // meters
  
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);
    
    // Convert offset to lat/lng
    const dLat = dy / earthRadius;
    const dLng = dx / (earthRadius * Math.cos(center[1] * Math.PI / 180));
    
    points.push([
      center[0] + (dLng * 180 / Math.PI),
      center[1] + (dLat * 180 / Math.PI)
    ]);
  }
  
  // Close the polygon
  points.push(points[0]);
  
  return points;
};

// Calculate route statistics
exports.calculateRouteStatistics = (routePath, tripsData) => {
  if (!routePath || routePath.length < 2) {
    return null;
  }
  
  // Calculate route length
  let totalDistance = 0;
  for (let i = 1; i < routePath.length; i++) {
    totalDistance += this.calculateDistance(routePath[i-1], routePath[i]);
  }
  
  // Calculate average speed from trips
  let totalSpeed = 0;
  let tripCount = 0;
  
  tripsData.forEach(trip => {
    if (trip.averageSpeed) {
      totalSpeed += trip.averageSpeed;
      tripCount++;
    }
  });
  
  const averageSpeed = tripCount > 0 ? totalSpeed / tripCount : 30; // Default 30 km/h
  
  // Calculate estimated duration
  const estimatedDuration = (totalDistance / 1000) / averageSpeed * 60; // in minutes
  
  // Calculate popularity score
  const popularity = Math.min(tripCount * 10, 100);
  
  return {
    totalDistance: totalDistance / 1000, // Convert to km
    averageSpeed,
    estimatedDuration: Math.ceil(estimatedDuration),
    popularity,
    tripCount
  };
};

// Calculate driver performance score
exports.calculateDriverPerformance = (trips, ratings) => {
  if (trips.length === 0) return 0;
  
  let totalScore = 0;
  let weightSum = 0;
  
  trips.forEach(trip => {
    const tripScore = this.calculateTripScore(trip, ratings);
    const weight = 1; // Could be based on trip distance or revenue
    
    totalScore += tripScore * weight;
    weightSum += weight;
  });
  
  return weightSum > 0 ? totalScore / weightSum : 0;
};

// Calculate individual trip score
exports.calculateTripScore = (trip, ratings) => {
  let score = 50; // Base score
  
  // Punctuality (up to 30 points)
  if (trip.onTime) {
    score += 30;
  } else if (trip.delayMinutes <= 10) {
    score += 20;
  } else if (trip.delayMinutes <= 30) {
    score += 10;
  } else if (trip.delayMinutes <= 60) {
    score += 5;
  }
  
  // Safety (up to 20 points)
  if (!trip.incidents || trip.incidents.length === 0) {
    score += 20;
  } else if (trip.incidents.length === 1) {
    score += 10;
  }
  
  // Ratings (up to 30 points)
  const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  score += (avgRating - 2.5) * 10; // Scale to 0-30
  
  return Math.min(score, 100);
};

// Calculate cost optimization
exports.optimizeRoute = (stops, startPoint, endPoint) => {
  // Implement traveling salesman problem approximation
  const allPoints = [startPoint, ...stops, endPoint];
  const visited = new Set();
  const route = [startPoint];
  visited.add(0);
  
  let currentIndex = 0;
  
  while (visited.size < allPoints.length) {
    let nearestIndex = -1;
    let minDistance = Infinity;
    
    for (let i = 0; i < allPoints.length; i++) {
      if (!visited.has(i)) {
        const distance = this.calculateDistance(
          allPoints[currentIndex],
          allPoints[i]
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      }
    }
    
    if (nearestIndex !== -1) {
      route.push(allPoints[nearestIndex]);
      visited.add(nearestIndex);
      currentIndex = nearestIndex;
    }
  }
  
  // Add return to start if needed
  route.push(startPoint);
  
  return route;
};