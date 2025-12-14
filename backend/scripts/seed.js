require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const Sacco = require('../src/models/Sacco');
const Vehicle = require('../src/models/Vehicle');
const Route = require('../src/models/Route');

const connectDB = require('../src/config/database');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Sacco.deleteMany({});
    await Vehicle.deleteMany({});
    await Route.deleteMany({});

    // Create Super Admin first
    const superAdminPassword = await bcrypt.hash('Admin123', 12);
    const superAdmin = await User.create({
      name: 'Super Admin',
      phone: '+254700000000',
      email: 'admin@matpulse254.com',
      password: superAdminPassword,
      role: 'super_admin',
      isVerified: true
    });

    console.log(`✅ Created Super Admin: ${superAdmin.name}`);

    // Create Sacco Admin (without saccoId initially)
    const saccoAdminPassword = await bcrypt.hash('Admin123', 12);
    const saccoAdmin = await User.create({
      name: 'John SaccoAdmin',
      phone: '+254712345679',
      email: 'admin@metrotra.co.ke',
      password: saccoAdminPassword,
      role: 'sacco_admin',
      isVerified: true
    });

    console.log(`✅ Created Sacco Admin: ${saccoAdmin.name}`);

    // Create multiple Saccos
    const saccos = [];
    
    // First Sacco - Metro Trans
    const sacco1 = await Sacco.create({
      name: 'Metro Trans Sacco',
      registrationNumber: 'SACCO001',
      description: 'One of the largest matatu Saccos in Nairobi',
      contactPhone: '0712345678',
      contactEmail: 'info@metrotra.co.ke',
      headquarters: 'Nairobi CBD',
      adminId: saccoAdmin._id,
      verified: true,
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
    saccos.push(sacco1);
    console.log(`✅ Created Sacco: ${sacco1.name}`);

    // Update first Sacco Admin with saccoId
    saccoAdmin.saccoId = sacco1._id;
    await saccoAdmin.save();

    // Second Sacco - City Hoppa
    const sacco2AdminPassword = await bcrypt.hash('Admin123', 12);
    const sacco2Admin = await User.create({
      name: 'Sarah Admin',
      phone: '+254712345680',
      email: 'admin@cityhoppa.co.ke',
      password: sacco2AdminPassword,
      role: 'sacco_admin',
      isVerified: true
    });

    const sacco2 = await Sacco.create({
      name: 'City Hoppa Sacco',
      registrationNumber: 'SACCO002',
      description: 'Premium shuttle services across Nairobi',
      contactPhone: '0722345678',
      contactEmail: 'info@cityhoppa.co.ke',
      headquarters: 'Westlands',
      adminId: sacco2Admin._id,
      verified: true,
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
    saccos.push(sacco2);
    sacco2Admin.saccoId = sacco2._id;
    await sacco2Admin.save();
    console.log(`✅ Created Sacco: ${sacco2.name}`);

    // Third Sacco - Double M
    const sacco3AdminPassword = await bcrypt.hash('Admin123', 12);
    const sacco3Admin = await User.create({
      name: 'David Admin',
      phone: '+254712345681',
      email: 'admin@doublem.co.ke',
      password: sacco3AdminPassword,
      role: 'sacco_admin',
      isVerified: true
    });

    const sacco3 = await Sacco.create({
      name: 'Double M Sacco',
      registrationNumber: 'SACCO003',
      description: 'Serving Thika Road and Eastern Nairobi',
      contactPhone: '0732345678',
      contactEmail: 'info@doublem.co.ke',
      headquarters: 'Thika Road',
      adminId: sacco3Admin._id,
      verified: true,
      subscription: {
        plan: 'basic',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
    saccos.push(sacco3);
    sacco3Admin.saccoId = sacco3._id;
    await sacco3Admin.save();
    console.log(`✅ Created Sacco: ${sacco3.name}`);

    // Fourth Sacco - Kenya Mpya
    const sacco4AdminPassword = await bcrypt.hash('Admin123', 12);
    const sacco4Admin = await User.create({
      name: 'Grace Admin',
      phone: '+254712345682',
      email: 'admin@kenyampya.co.ke',
      password: sacco4AdminPassword,
      role: 'sacco_admin',
      isVerified: true
    });

    const sacco4 = await Sacco.create({
      name: 'Kenya Mpya Sacco',
      registrationNumber: 'SACCO004',
      description: 'Covering Ngong Road and Southern routes',
      contactPhone: '0742345678',
      contactEmail: 'info@kenyampya.co.ke',
      headquarters: 'Ngong Road',
      adminId: sacco4Admin._id,
      verified: true,
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
    saccos.push(sacco4);
    sacco4Admin.saccoId = sacco4._id;
    await sacco4Admin.save();
    console.log(`✅ Created Sacco: ${sacco4.name}`);

    // Create Drivers (distribute across Saccos)
    const drivers = [];
    const driverData = [
      // Metro Trans Drivers
      { name: 'James Kamau', phone: '+254711111111', license: 'DL001', saccoId: saccos[0]._id },
      { name: 'Peter Mwangi', phone: '+254711111112', license: 'DL002', saccoId: saccos[0]._id },
      { name: 'Mary Wanjiru', phone: '+254711111113', license: 'DL003', saccoId: saccos[0]._id },
      { name: 'John Ochieng', phone: '+254711111114', license: 'DL004', saccoId: saccos[0]._id },
      
      // City Hoppa Drivers
      { name: 'David Kipchoge', phone: '+254711111115', license: 'DL005', saccoId: saccos[1]._id },
      { name: 'Sarah Njeri', phone: '+254711111116', license: 'DL006', saccoId: saccos[1]._id },
      { name: 'Michael Otieno', phone: '+254711111117', license: 'DL007', saccoId: saccos[1]._id },
      { name: 'Grace Akinyi', phone: '+254711111118', license: 'DL008', saccoId: saccos[1]._id },
      
      // Double M Drivers
      { name: 'Thomas Mutua', phone: '+254711111119', license: 'DL009', saccoId: saccos[2]._id },
      { name: 'Jane Mumbi', phone: '+254711111120', license: 'DL010', saccoId: saccos[2]._id },
      { name: 'Patrick Kimani', phone: '+254711111121', license: 'DL011', saccoId: saccos[2]._id },
      { name: 'Lucy Wambui', phone: '+254711111122', license: 'DL012', saccoId: saccos[2]._id },
      
      // Kenya Mpya Drivers
      { name: 'Joseph Kariuki', phone: '+254711111123', license: 'DL013', saccoId: saccos[3]._id },
      { name: 'Elizabeth Wangari', phone: '+254711111124', license: 'DL014', saccoId: saccos[3]._id },
      { name: 'Daniel Njoroge', phone: '+254711111125', license: 'DL015', saccoId: saccos[3]._id },
    ];

    for (const data of driverData) {
      const password = await bcrypt.hash('Driver123', 12);
      const driver = await User.create({
        name: data.name,
        phone: data.phone,
        password: password,
        role: 'driver',
        saccoId: data.saccoId,
        isVerified: true
      });
      drivers.push(driver);
      console.log(`✅ Created Driver: ${driver.name}`);
    }

    // Create Vehicles (one per driver)
    const vehicles = [];
    const vehicleData = [
      // Metro Trans Vehicles
      { plateNumber: 'KBC 123A', make: 'Toyota', model: 'Hiace', capacity: 33, color: 'White', year: 2020 },
      { plateNumber: 'KBC 124B', make: 'Nissan', model: 'Urvan', capacity: 28, color: 'Yellow', year: 2019 },
      { plateNumber: 'KBC 125C', make: 'Toyota', model: 'Hiace', capacity: 33, color: 'Green', year: 2021 },
      { plateNumber: 'KBC 126D', make: 'Isuzu', model: 'NQR', capacity: 33, color: 'White', year: 2020 },
      
      // City Hoppa Vehicles
      { plateNumber: 'KBD 200A', make: 'Toyota', model: 'Coaster', capacity: 29, color: 'Blue', year: 2021 },
      { plateNumber: 'KBD 201B', make: 'Toyota', model: 'Hiace', capacity: 14, color: 'Blue', year: 2022 },
      { plateNumber: 'KBD 202C', make: 'Nissan', model: 'Civilian', capacity: 26, color: 'Blue', year: 2020 },
      { plateNumber: 'KBD 203D', make: 'Toyota', model: 'Hiace', capacity: 14, color: 'Blue', year: 2021 },
      
      // Double M Vehicles
      { plateNumber: 'KBE 300A', make: 'Nissan', model: 'Urvan', capacity: 14, color: 'Red', year: 2019 },
      { plateNumber: 'KBE 301B', make: 'Toyota', model: 'Hiace', capacity: 33, color: 'Red', year: 2020 },
      { plateNumber: 'KBE 302C', make: 'Isuzu', model: 'NPR', capacity: 33, color: 'Red', year: 2021 },
      { plateNumber: 'KBE 303D', make: 'Toyota', model: 'Coaster', capacity: 29, color: 'Red', year: 2020 },
      
      // Kenya Mpya Vehicles
      { plateNumber: 'KBF 400A', make: 'Toyota', model: 'Hiace', capacity: 14, color: 'Green', year: 2021 },
      { plateNumber: 'KBF 401B', make: 'Nissan', model: 'Urvan', capacity: 28, color: 'Green', year: 2020 },
      { plateNumber: 'KBF 402C', make: 'Toyota', model: 'Hiace', capacity: 33, color: 'Green', year: 2022 },
    ];

    for (let i = 0; i < vehicleData.length; i++) {
      const vehicle = await Vehicle.create({
        ...vehicleData[i],
        saccoId: drivers[i].saccoId,
        driverId: drivers[i]._id,
        features: ['ac', 'music', 'wifi'],
        status: 'offline'
      });
      vehicles.push(vehicle);
      console.log(`✅ Created Vehicle: ${vehicle.plateNumber}`);
    }

    // Update drivers with vehicle IDs
    for (let i = 0; i < drivers.length; i++) {
      drivers[i].vehicleId = vehicles[i]._id;
      await drivers[i].save();
    }

    // Update Saccos with their vehicles
    for (const sacco of saccos) {
      sacco.vehicles = vehicles.filter(v => v.saccoId.equals(sacco._id)).map(v => v._id);
      await sacco.save();
    }

    // Create Routes
    const routes = [];
    const routeData = [
      {
        name: 'Githurai 45 to CBD',
        nickname: 'Route 45',
        origin: {
          name: 'Githurai 45',
          location: { type: 'Point', coordinates: [36.8845, -1.2150] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 18,
        estimatedDuration: 45,
        fareStructure: {
          baseFare: 50,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 50 },
            { fromStage: 6, toStage: 10, fare: 80 },
            { fromStage: 11, toStage: 15, fare: 100 }
          ]
        }
      },
      {
        name: 'Kasarani to CBD',
        nickname: 'Route 9',
        origin: {
          name: 'Kasarani',
          location: { type: 'Point', coordinates: [36.8961, -1.2214] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 15,
        estimatedDuration: 40,
        fareStructure: {
          baseFare: 40,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 4, fare: 40 },
            { fromStage: 5, toStage: 8, fare: 60 },
            { fromStage: 9, toStage: 12, fare: 80 }
          ]
        }
      },
      {
        name: 'Westlands to CBD',
        nickname: 'Route 23',
        origin: {
          name: 'Westlands',
          location: { type: 'Point', coordinates: [36.8089, -1.2676] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 8,
        estimatedDuration: 25,
        fareStructure: {
          baseFare: 30,
          peakMultiplier: 1.3,
          stageIncrements: [
            { fromStage: 0, toStage: 3, fare: 30 },
            { fromStage: 4, toStage: 6, fare: 50 }
          ]
        }
      },
      {
        name: 'Ngong Road to CBD',
        nickname: 'Route 111',
        origin: {
          name: 'Ngong Road',
          location: { type: 'Point', coordinates: [36.7724, -1.3027] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 12,
        estimatedDuration: 35,
        fareStructure: {
          baseFare: 40,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 4, fare: 40 },
            { fromStage: 5, toStage: 8, fare: 60 }
          ]
        }
      },
      {
        name: 'Embakasi to CBD',
        nickname: 'Route 33',
        origin: {
          name: 'Embakasi',
          location: { type: 'Point', coordinates: [36.8947, -1.3194] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 14,
        estimatedDuration: 40,
        fareStructure: {
          baseFare: 50,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 50 },
            { fromStage: 6, toStage: 9, fare: 70 }
          ]
        }
      },
      {
        name: 'Kikuyu to CBD',
        nickname: 'Route 46',
        origin: {
          name: 'Kikuyu',
          location: { type: 'Point', coordinates: [36.6667, -1.2500] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 20,
        estimatedDuration: 50,
        fareStructure: {
          baseFare: 60,
          peakMultiplier: 1.3,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 60 },
            { fromStage: 6, toStage: 10, fare: 80 },
            { fromStage: 11, toStage: 15, fare: 100 }
          ]
        }
      },
      {
        name: 'Thika Road to CBD',
        nickname: 'Route 237',
        origin: {
          name: 'Thika Road',
          location: { type: 'Point', coordinates: [36.9572, -1.2167] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 22,
        estimatedDuration: 45,
        fareStructure: {
          baseFare: 50,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 50 },
            { fromStage: 6, toStage: 10, fare: 70 },
            { fromStage: 11, toStage: 15, fare: 100 }
          ]
        }
      },
      {
        name: 'Kawangware to CBD',
        nickname: 'Route 46',
        origin: {
          name: 'Kawangware',
          location: { type: 'Point', coordinates: [36.7458, -1.2833] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 10,
        estimatedDuration: 30,
        fareStructure: {
          baseFare: 40,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 4, fare: 40 },
            { fromStage: 5, toStage: 8, fare: 60 }
          ]
        }
      },
      {
        name: 'Kangemi to CBD',
        nickname: 'Route 46',
        origin: {
          name: 'Kangemi',
          location: { type: 'Point', coordinates: [36.7458, -1.2667] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 11,
        estimatedDuration: 35,
        fareStructure: {
          baseFare: 40,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 4, fare: 40 },
            { fromStage: 5, toStage: 8, fare: 60 }
          ]
        }
      },
      {
        name: 'Rongai to CBD',
        nickname: 'Route 119',
        origin: {
          name: 'Rongai',
          location: { type: 'Point', coordinates: [36.7194, -1.3833] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 25,
        estimatedDuration: 60,
        fareStructure: {
          baseFare: 70,
          peakMultiplier: 1.3,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 70 },
            { fromStage: 6, toStage: 10, fare: 90 },
            { fromStage: 11, toStage: 15, fare: 120 }
          ]
        }
      },
      {
        name: 'Ruiru to CBD',
        nickname: 'Route 237',
        origin: {
          name: 'Ruiru',
          location: { type: 'Point', coordinates: [36.9611, -1.1500] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 28,
        estimatedDuration: 55,
        fareStructure: {
          baseFare: 80,
          peakMultiplier: 1.3,
          stageIncrements: [
            { fromStage: 0, toStage: 6, fare: 80 },
            { fromStage: 7, toStage: 12, fare: 100 },
            { fromStage: 13, toStage: 18, fare: 120 }
          ]
        }
      },
      {
        name: 'Umoja to CBD',
        nickname: 'Route 58',
        origin: {
          name: 'Umoja',
          location: { type: 'Point', coordinates: [36.8989, -1.2889] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 10,
        estimatedDuration: 30,
        fareStructure: {
          baseFare: 40,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 4, fare: 40 },
            { fromStage: 5, toStage: 8, fare: 60 }
          ]
        }
      },
      {
        name: 'Kiambu Road to CBD',
        nickname: 'Route 233',
        origin: {
          name: 'Kiambu Road',
          location: { type: 'Point', coordinates: [36.8333, -1.1667] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 16,
        estimatedDuration: 40,
        fareStructure: {
          baseFare: 50,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 50 },
            { fromStage: 6, toStage: 10, fare: 70 }
          ]
        }
      },
      {
        name: 'Karen to CBD',
        nickname: 'Route 111',
        origin: {
          name: 'Karen',
          location: { type: 'Point', coordinates: [36.7000, -1.3167] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 18,
        estimatedDuration: 45,
        fareStructure: {
          baseFare: 60,
          peakMultiplier: 1.3,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 60 },
            { fromStage: 6, toStage: 10, fare: 80 },
            { fromStage: 11, toStage: 15, fare: 100 }
          ]
        }
      },
      {
        name: 'Langata to CBD',
        nickname: 'Route 124',
        origin: {
          name: 'Langata',
          location: { type: 'Point', coordinates: [36.7389, -1.3525] }
        },
        destination: {
          name: 'Nairobi CBD',
          location: { type: 'Point', coordinates: [36.8219, -1.2921] }
        },
        totalDistance: 14,
        estimatedDuration: 40,
        fareStructure: {
          baseFare: 50,
          peakMultiplier: 1.2,
          stageIncrements: [
            { fromStage: 0, toStage: 5, fare: 50 },
            { fromStage: 6, toStage: 10, fare: 70 }
          ]
        }
      }
    ];

    for (const data of routeData) {
      // Assign routes to different Saccos (distribute evenly)
      const saccoIdsForRoute = [
        saccos[Math.floor(Math.random() * saccos.length)]._id,
        saccos[Math.floor(Math.random() * saccos.length)]._id
      ];

      const route = await Route.create({
        ...data,
        saccoIds: saccoIdsForRoute,
        stages: [
          {
            name: 'Starting Point',
            location: {
              type: 'Point',
              coordinates: data.origin.location.coordinates
            },
            sequence: 0
          },
          {
            name: 'Mid Point',
            location: {
              type: 'Point',
              coordinates: [
                (data.origin.location.coordinates[0] + data.destination.location.coordinates[0]) / 2,
                (data.origin.location.coordinates[1] + data.destination.location.coordinates[1]) / 2
              ]
            },
            sequence: 1
          },
          {
            name: 'End Point',
            location: {
              type: 'Point',
              coordinates: data.destination.location.coordinates
            },
            sequence: 2
          }
        ],
        operatingHours: {
          start: '05:00',
          end: '23:00',
          days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        }
      });
      routes.push(route);
      console.log(`✅ Created Route: ${route.name}`);
    }

    // Update Saccos with routes
    for (const sacco of saccos) {
      sacco.routes = routes.filter(r => r.saccoIds.some(id => id.equals(sacco._id))).map(r => r._id);
      await sacco.save();
    }

    // Create Passenger
    const passengerPassword = await bcrypt.hash('Passenger123', 12);
    const passenger = await User.create({
      name: 'Jane Passenger',
      phone: '+254722222222',
      email: 'jane@example.com',
      password: passengerPassword,
      role: 'passenger',
      isVerified: true,
      favorites: [
        {
          routeId: routes[0]._id,
          stageId: routes[0].stages[1]._id
        }
      ]
    });

    console.log(`✅ Created Passenger: ${passenger.name}`);

    console.log('✅ Seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Saccos: ${saccos.length}`);
    console.log(`   - Super Admin: 1`);
    console.log(`   - Sacco Admins: ${saccos.length}`);
    console.log(`   - Drivers: ${drivers.length}`);
    console.log(`   - Vehicles: ${vehicles.length}`);
    console.log(`   - Routes: ${routes.length}`);
    console.log(`   - Passengers: 1`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();