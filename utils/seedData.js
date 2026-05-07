require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Cook = require('../models/Cook');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Review = require('../models/Review');
const connectDB = require('../config/db');

const seed = async () => {
  try {
    await connectDB();
    console.log('  Clearing data...');
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Menu.deleteMany({});
    await Cook.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } });

    const users = await User.create([
      { firstName:'Rahul', lastName:'Mehra', email:'rahul@email.com', phone:'+91 9876543210', password:'password123', role:'user', area:'Koramangala', address:'123, 4th Cross, Koramangala' },
      { firstName:'Priya', lastName:'Singh', email:'priya@email.com', phone:'+91 9876543211', password:'password123', role:'user', area:'HSR Layout', address:'45, 1st Main, HSR Layout' },
      { firstName:'Meera', lastName:'Sharma', email:'meera@email.com', phone:'+91 9876543212', password:'password123', role:'cook', area:'Koramangala' },
      { firstName:'Lakshmi', lastName:'Iyer', email:'lakshmi@email.com', phone:'+91 9876543213', password:'password123', role:'cook', area:'JP Nagar' },
      { firstName:'Rashida', lastName:'Begum', email:'rashida@email.com', phone:'+91 9876543214', password:'password123', role:'cook', area:'Indiranagar' },
      { firstName:'Shanti', lastName:'Patel', email:'shanti@email.com', phone:'+91 9876543215', password:'password123', role:'cook', area:'Whitefield' },
      { firstName:'Ananya', lastName:'Das', email:'ananya@email.com', phone:'+91 9876543216', password:'password123', role:'cook', area:'Marathahalli' },
      { firstName:'Maria', lastName:'DSouza', email:'maria@email.com', phone:'+91 9876543217', password:'password123', role:'cook', area:'MG Road' }
    ]);

    const admin = await User.findOne({ role:'admin' });
    if (!admin) await User.create({ firstName:'Admin', lastName:'Panel', email:'admin@homefeast.com', password:'admin123', role:'admin' });

    const cooks = await Cook.create([
      { user:users[2]._id, name:'Meera Sharma', tagline:'Authentic North Indian home cooking', cuisine:'North Indian', area:'Koramangala, HSR Layout', image:'https://picsum.photos/seed/meera-kitchen/600/400.jpg', avatar:'https://picsum.photos/seed/meera-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'6 years', deliveryTime:'11:30 AM - 1:00 PM / 7:00 PM - 8:30 PM', plans:{daily:180,weekly:1100,monthly:4000}, rating:4.8, reviewCount:124, verified:true, status:'approved', totalEarnings:86400 },
      { user:users[3]._id, name:'Lakshmi Iyer', tagline:'Traditional South Indian meals', cuisine:'South Indian', area:'JP Nagar, Jayanagar', image:'https://picsum.photos/seed/lakshmi-south/600/400.jpg', avatar:'https://picsum.photos/seed/lakshmi-face/100/100.jpg', types:['Veg'], experience:'8 years', deliveryTime:'12:00 PM - 1:30 PM / 7:30 PM - 9:00 PM', plans:{daily:150,weekly:900,monthly:3400}, rating:4.9, reviewCount:98, verified:true, status:'approved', totalEarnings:61200 },
      { user:users[4]._id, name:'Rashida Begum', tagline:'Mughlai delicacies made with love', cuisine:'Mughlai', area:'Indiranagar, Domlur', image:'https://picsum.photos/seed/rashida-mughlai/600/400.jpg', avatar:'https://picsum.photos/seed/rashida-face/100/100.jpg', types:['Non-Veg'], experience:'5 years', deliveryTime:'12:30 PM - 2:00 PM / 7:30 PM - 9:00 PM', plans:{daily:220,weekly:1350,monthly:5000}, rating:4.7, reviewCount:76, verified:true, status:'approved', totalEarnings:52800 },
      { user:users[5]._id, name:'Shanti Patel', tagline:'Pure Gujarati thali experience', cuisine:'Gujarati', area:'Whitefield, ITPL', image:'https://picsum.photos/seed/shanti-gujarati/600/400.jpg', avatar:'https://picsum.photos/seed/shanti-face/100/100.jpg', types:['Veg'], experience:'4 years', deliveryTime:'11:00 AM - 12:30 PM', plans:{daily:160,weekly:950,monthly:3600}, rating:4.6, reviewCount:63, verified:true, status:'approved', totalEarnings:36000 },
      { user:users[6]._id, name:'Ananya Das', tagline:'Homely Bengali meals', cuisine:'Bengali', area:'Marathahalli, Sarjapur', image:'https://picsum.photos/seed/ananya-bengali/600/400.jpg', avatar:'https://picsum.photos/seed/ananya-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'5 years', deliveryTime:'12:30 PM - 2:00 PM / 7:30 PM - 9:00 PM', plans:{daily:190,weekly:1150,monthly:4200}, rating:4.7, reviewCount:87, verified:true, status:'approved', totalEarnings:50400 },
      { user:users[7]._id, name:"Maria D'Souza", tagline:'Anglo-Indian comfort food', cuisine:'Anglo-Indian', area:'MG Road, Brigade Road', image:'https://picsum.photos/seed/maria-anglo/600/400.jpg', avatar:'https://picsum.photos/seed/maria-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'3 years', deliveryTime:'12:00 PM - 1:30 PM / 7:00 PM - 8:30 PM', plans:{daily:200,weekly:1200,monthly:4500}, rating:4.5, reviewCount:41, verified:false, status:'pending', totalEarnings:0 }
    ]);

    await Menu.create([
      { cook:cooks[0]._id, name:'Dal Tadka + Rice + Roti + Salad', type:'Veg', price:180, available:true, popular:true },
      { cook:cooks[0]._id, name:'Rajma Chawal + Raita + Pickle', type:'Veg', price:160, available:true, popular:false },
      { cook:cooks[0]._id, name:'Butter Chicken + Naan + Dal', type:'Non-Veg', price:220, available:true, popular:true },
      { cook:cooks[0]._id, name:'Paneer Butter Masala + Jeera Rice', type:'Veg', price:200, available:true, popular:false },
      { cook:cooks[0]._id, name:'Chicken Biryani + Raita + Salad', type:'Non-Veg', price:240, available:false, popular:true },
      { cook:cooks[1]._id, name:'Sambar + Rice + Rasam + Papad + Kootu', type:'Veg', price:150, available:true, popular:true },
      { cook:cooks[1]._id, name:'Curd Rice + Pickle + Vada', type:'Veg', price:120, available:true, popular:false },
      { cook:cooks[1]._id, name:'Masala Dosa + Chutney + Sambar', type:'Veg', price:100, available:true, popular:true },
      { cook:cooks[2]._id, name:'Mutton Biryani + Raita + Mirchi Ka Salan', type:'Non-Veg', price:260, available:true, popular:true },
      { cook:cooks[2]._id, name:'Chicken Korma + Naan + Salad', type:'Non-Veg', price:220, available:true, popular:true },
      { cook:cooks[2]._id, name:'Keema Paratha + Curd + Pickle', type:'Non-Veg', price:180, available:true, popular:false },
      { cook:cooks[3]._id, name:'Gujarati Thali (Dal, Kadhi, Sabzi, Roti, Rice, Sweet)', type:'Veg', price:160, available:true, popular:true },
      { cook:cooks[3]._id, name:'Dhokla + Chutney + Tea', type:'Veg', price:80, available:true, popular:false },
      { cook:cooks[3]._id, name:'Undhiyu + Roti + Rice + Dal', type:'Veg', price:180, available:true, popular:true },
      { cook:cooks[4]._id, name:'Macher Jhol + Rice + Aloo Posto + Salad', type:'Non-Veg', price:220, available:true, popular:true },
      { cook:cooks[4]._id, name:'Shukto + Dal + Bhaja + Rice', type:'Veg', price:170, available:true, popular:false },
      { cook:cooks[4]._id, name:'Chicken Kosha + Luchi + Chutney', type:'Non-Veg', price:240, available:true, popular:true },
      { cook:cooks[4]._id, name:'Aloo Dum + Luchi + Mishti', type:'Veg', price:150, available:true, popular:true },
      { cook:cooks[5]._id, name:'Chicken Cutlet + Mashed Potato + Gravy', type:'Non-Veg', price:200, available:true, popular:true },
      { cook:cooks[5]._id, name:'Vegetable Pulao + Raita + Papad', type:'Veg', price:150, available:true, popular:false },
      { cook:cooks[5]._id, name:'Roast Chicken + Vegetables + Bread', type:'Non-Veg', price:250, available:true, popular:true }
    ]);

    await Order.create([
      { orderId:'HF-1001', user:users[0]._id, cook:cooks[0]._id, meal:'Butter Chicken + Naan + Dal', plan:'Monthly', amount:4000, status:'Active', startDate:new Date('2025-01-16'), endDate:new Date('2025-02-15') },
      { orderId:'HF-1002', user:users[1]._id, cook:cooks[1]._id, meal:'Sambar Rice Meal', plan:'Weekly', amount:900, status:'Active', startDate:new Date('2025-01-19'), endDate:new Date('2025-01-26') },
      { orderId:'HF-1003', user:users[0]._id, cook:cooks[2]._id, meal:'Mutton Biryani + Raita', plan:'Daily', amount:260, status:'Completed', startDate:new Date('2025-01-10') },
      { orderId:'HF-1004', user:users[1]._id, cook:cooks[4]._id, meal:'Macher Jhol + Rice', plan:'Monthly', amount:4200, status:'Active', startDate:new Date('2025-01-21'), endDate:new Date('2025-02-20') },
      { orderId:'HF-1005', user:users[0]._id, cook:cooks[3]._id, meal:'Gujarati Thali', plan:'Weekly', amount:950, status:'Cancelled', startDate:new Date('2025-01-13') },
      { orderId:'HF-1006', user:users[1]._id, cook:cooks[0]._id, meal:'Dal Tadka Meal', plan:'Weekly', amount:1100, status:'Pending' },
      { orderId:'HF-1007', user:users[0]._id, cook:cooks[0]._id, meal:'Chicken Biryani Meal', plan:'Daily', amount:240, status:'Active', startDate:new Date('2025-01-21') }
    ]);

    await Review.create([
      { user:users[0]._id, cook:cooks[0]._id, rating:5, text:"Meera's food reminds me of my mother's cooking. The butter chicken is divine!" },
      { user:users[1]._id, cook:cooks[0]._id, rating:4, text:"Great variety and taste. Delivery is always on time." },
      { user:users[0]._id, cook:cooks[1]._id, rating:5, text:"Best South Indian meals in Bangalore. The sambar is perfect." },
      { user:users[1]._id, cook:cooks[1]._id, rating:5, text:"Lakshmi aunty's food is pure comfort. The thali is wholesome." },
      { user:users[0]._id, cook:cooks[2]._id, rating:5, text:"Mutton biryani is restaurant-quality at half the price." },
      { user:users[1]._id, cook:cooks[2]._id, rating:4, text:"Love the keema paratha. Wish they had a veg option." },
      { user:users[0]._id, cook:cooks[3]._id, rating:4, text:"Authentic Gujarati taste. The thali has so much variety." },
      { user:users[1]._id, cook:cooks[4]._id, rating:5, text:"Finally found proper Bengali food. Macher jhol takes me home." },
      { user:users[0]._id, cook:cooks[4]._id, rating:5, text:"Ananya's aloo dum and luchi combo is my weekend fix." }
    ]);

    console.log('  Seed complete! 8 users, 6 cooks, 21 menu items, 7 orders, 9 reviews');
    process.exit(0);
  } catch (err) {
    console.error('  Seed error:', err);
    process.exit(1);
  }
};

seed();