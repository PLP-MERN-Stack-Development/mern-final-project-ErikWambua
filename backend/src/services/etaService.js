const Trip = require('../models/Trip');
const Route = require('../models/Route');
const Alert = require('../models/Alert');
const geolib = require('geolib');

// Calculate distance between two coordinates in meters
const calculateDistance = (coord1, coord2) => {
  return geolib.getDistance(
    { latitude: coord1[1], longitude: coord1[0] },
    { latitude: coord2[1], longitude: coord2[0] }
  );
};

// Calculate ETA for a trip to all upcoming stages
exports.calculateTripETAs = async (tripId) => {
  try {
    const trip = await Trip.findById(tripId)
      .populate('routeId', 'stages path');

    if (!trip) {
      throw new Error('Trip not found');
    }

    const { currentLocation, routeId } = trip;
    const { stages } = routeId;

    // Find current stage
    const currentStageIndex = await this.findCurrentStage(
      currentLocation.coordinates,
      stages
    );

    // Get upcoming stages
    const upcomingStages = stages.slice(currentStageIndex + 1);

    // Get traffic factor for the route
    const trafficFactor = await this.getTrafficFactor(
      currentLocation.coordinates,
      routeId.path
    );

    // Calculate ETA for each upcoming stage
    const stageETAs = [];
    let cumulativeDistance = 0;

    for (let i = 0; i < upcomingStages.length; i++) {
      const stage = upcomingStages[i];
      
      // Calculate distance from current location to this stage
      const distance = calculateDistance(
        currentLocation.coordinates,
        stage.location.coordinates
      );

      cumulativeDistance += distance;

      // Calculate ETA
      const etaMinutes = this.calculateETAMinutes(
        cumulativeDistance,
        currentLocation.speed || 30, // default 30 km/h
        trafficFactor
      );

      stageETAs.push({
        stageId: stage._id,
        stageIndex: currentStageIndex + i + 1,
        estimatedArrival: new Date(Date.now() + etaMinutes * 60000),
        distanceRemaining: cumulativeDistance,
        updatedAt: new Date()
      });
    }

    // Update trip with new ETAs
    trip.stageETAs = stageETAs;
    trip.currentStageIndex = currentStageIndex;
    trip.nextStageId = upcomingStages[0]?._id;
    await trip.save();

    return stageETAs;
  } catch (error) {
    console.error('ETA calculation failed:', error);
    throw error;
  }
};

// Find current stage based on vehicle location
exports.findCurrentStage = async (vehicleCoords, stages) => {
  let nearestStageIndex = 0;
  let minDistance = Infinity;

  stages.forEach((stage, index) => {
    const distance = calculateDistance(
      vehicleCoords,
      stage.location.coordinates
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestStageIndex = index;
    }
  });

  // If not within reasonable distance of any stage, return -1
  if (minDistance > 500) { // 500 meters
    return -1;
  }

  return nearestStageIndex;
};

// Calculate ETA in minutes
exports.calculateETAMinutes = (distance, speed, trafficFactor = 1) => {
  // distance in meters, speed in km/h
  const speedMps = (speed * 1000) / 3600; // convert to meters per second
  let timeSeconds = distance / speedMps;

  // Apply traffic factor
  timeSeconds *= trafficFactor;

  // Add buffer for stops, traffic lights, etc.
  timeSeconds *= 1.2;

  return Math.max(Math.round(timeSeconds / 60), 1); // return in minutes, at least 1 minute
};

// Get traffic factor based on active alerts and historical data
exports.getTrafficFactor = async (location, routePath) => {
  let trafficFactor = 1.0;

  try {
    // Check for active alerts near the route
    const alerts = await Alert.find({
      status: 'active',
      expiresAt: { $gt: new Date() },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location
          },
          $maxDistance: 2000 // 2km radius
        }
      }
    });

    // Apply severity multipliers
    alerts.forEach(alert => {
      switch (alert.severity) {
        case 'low':
          trafficFactor *= 1.1;
          break;
        case 'medium':
          trafficFactor *= 1.3;
          break;
        case 'high':
          trafficFactor *= 1.6;
          break;
        case 'critical':
          trafficFactor *= 2.0;
          break;
      }
    });

    // Apply time-based factor (peak hours)
    const now = new Date();
    const hour = now.getHours();
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      trafficFactor *= 1.4;
    }

    // Cap the factor
    return Math.min(trafficFactor, 3.0);
  } catch (error) {
    console.error('Traffic factor calculation failed:', error);
    return 1.0;
  }
};

// Predict arrival time for a specific stage
exports.predictArrival = async (tripId, stageId) => {
  const trip = await Trip.findById(tripId).select('stageETAs');
  
  if (!trip || !trip.stageETAs) {
    return null;
  }

  const stageETA = trip.stageETAs.find(eta => 
    eta.stageId.toString() === stageId
  );

  return stageETA ? stageETA.estimatedArrival : null;
};

// Calculate ETA for a passenger based on their stage
exports.calculatePassengerETA = async (tripId, stageId) => {
  try {
    const trip = await Trip.findById(tripId)
      .populate('routeId', 'stages');

    if (!trip) {
      throw new Error('Trip not found');
    }

    const route = trip.routeId;
    const currentStageIndex = trip.currentStageIndex;
    const targetStageIndex = route.stages.findIndex(s => s._id.toString() === stageId);

    if (targetStageIndex < currentStageIndex) {
      return 0; // Already passed this stage
    }

    // Calculate cumulative distance to target stage
    let cumulativeDistance = 0;
    for (let i = currentStageIndex; i < targetStageIndex; i++) {
      if (i < route.stages.length - 1) {
        const distance = calculateDistance(
          route.stages[i].location.coordinates,
          route.stages[i + 1].location.coordinates
        );
        cumulativeDistance += distance;
      }
    }

    // Get traffic factor
    const trafficFactor = await this.getTrafficFactor(
      trip.currentLocation.coordinates,
      route.path
    );

    // Calculate ETA
    const etaMinutes = this.calculateETAMinutes(
      cumulativeDistance,
      trip.currentLocation.speed || 30,
      trafficFactor
    );

    return {
      minutes: etaMinutes,
      arrivalTime: new Date(Date.now() + etaMinutes * 60000),
      distance: cumulativeDistance
    };
  } catch (error) {
    console.error('Passenger ETA calculation failed:', error);
    return null;
  }
};