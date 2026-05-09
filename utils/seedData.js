require('dotenv').config({ path: './.env' });

const mongoose = require('mongoose');
const Cook = require('../models/Cook');
const Menu = require('../models/Menu');
const connectDB = require('../config/db');

const seed = async () => {
  try {

    await connectDB();

    console.log('  Clearing data...');

    await Menu.deleteMany({});
    await Cook.deleteMany({});

    const cooks = await Cook.create([

      { name:'Meera Sharma', tagline:'Authentic North Indian home cooking', cuisine:'North Indian', area:'Koramangala, HSR Layout', image:'https://picsum.photos/seed/meera-kitchen/600/400.jpg', avatar:'https://picsum.photos/seed/meera-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'6 years', deliveryTime:'11:30 AM - 1:00 PM / 7:00 PM - 8:30 PM', plans:{daily:180,weekly:1100,monthly:4000}, rating:4.8, reviewCount:124, verified:true, status:'approved', totalEarnings:86400 },

      { name:'Lakshmi Iyer', tagline:'Traditional South Indian meals', cuisine:'South Indian', area:'JP Nagar, Jayanagar', image:'https://picsum.photos/seed/lakshmi-south/600/400.jpg', avatar:'https://picsum.photos/seed/lakshmi-face/100/100.jpg', types:['Veg'], experience:'8 years', deliveryTime:'12:00 PM - 1:30 PM / 7:30 PM - 9:00 PM', plans:{daily:150,weekly:900,monthly:3400}, rating:4.9, reviewCount:98, verified:true, status:'approved', totalEarnings:61200 },

      { name:'Rashida Begum', tagline:'Mughlai delicacies made with love', cuisine:'Mughlai', area:'Indiranagar, Domlur', image:'https://picsum.photos/seed/rashida-mughlai/600/400.jpg', avatar:'https://picsum.photos/seed/rashida-face/100/100.jpg', types:['Non-Veg'], experience:'5 years', deliveryTime:'12:30 PM - 2:00 PM / 7:30 PM - 9:00 PM', plans:{daily:220,weekly:1350,monthly:5000}, rating:4.7, reviewCount:76, verified:true, status:'approved', totalEarnings:52800 },

      { name:'Shanti Patel', tagline:'Pure Gujarati thali experience', cuisine:'Gujarati', area:'Whitefield, ITPL', image:'https://picsum.photos/seed/shanti-gujarati/600/400.jpg', avatar:'https://picsum.photos/seed/shanti-face/100/100.jpg', types:['Veg'], experience:'4 years', deliveryTime:'11:00 AM - 12:30 PM', plans:{daily:160,weekly:950,monthly:3600}, rating:4.6, reviewCount:63, verified:true, status:'approved', totalEarnings:36000 },

      { name:'Ananya Das', tagline:'Homely Bengali meals', cuisine:'Bengali', area:'Marathahalli, Sarjapur', image:'https://picsum.photos/seed/ananya-bengali/600/400.jpg', avatar:'https://picsum.photos/seed/ananya-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'5 years', deliveryTime:'12:30 PM - 2:00 PM / 7:30 PM - 9:00 PM', plans:{daily:190,weekly:1150,monthly:4200}, rating:4.7, reviewCount:87, verified:true, status:'approved', totalEarnings:50400 },

      { name:"Maria D'Souza", tagline:'Anglo-Indian comfort food', cuisine:'Anglo-Indian', area:'MG Road, Brigade Road', image:'https://picsum.photos/seed/maria-anglo/600/400.jpg', avatar:'https://picsum.photos/seed/maria-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'3 years', deliveryTime:'12:00 PM - 1:30 PM / 7:00 PM - 8:30 PM', plans:{daily:200,weekly:1200,monthly:4500}, rating:4.5, reviewCount:41, verified:false, status:'pending', totalEarnings:0 },

      { name:'Suresh Anna', tagline:'Authentic Karnataka Meals', cuisine:'South Indian', area:'BTM Layout', image:'https://picsum.photos/seed/suresh/600/400.jpg', avatar:'https://picsum.photos/seed/suresh-face/100/100.jpg', types:['Veg'], experience:'10 years', deliveryTime:'20 mins', plans:{daily:140,weekly:850,monthly:3200}, rating:4.8, reviewCount:110, verified:true, status:'approved', totalEarnings:72000 },

      { name:'Farzana Sheikh', tagline:'Special Hyderabadi Dum Biryani', cuisine:'Hyderabadi', area:'Electronic City', image:'https://picsum.photos/seed/farzana/600/400.jpg', avatar:'https://picsum.photos/seed/farzana-face/100/100.jpg', types:['Non-Veg'], experience:'9 years', deliveryTime:'35 mins', plans:{daily:250,weekly:1450,monthly:5400}, rating:4.9, reviewCount:132, verified:true, status:'approved', totalEarnings:95000 },

      { name:'Ritu Agarwal', tagline:'Pure Rajasthani Homemade Food', cuisine:'Rajasthani', area:'HSR Layout', image:'https://picsum.photos/seed/ritu/600/400.jpg', avatar:'https://picsum.photos/seed/ritu-face/100/100.jpg', types:['Veg'], experience:'7 years', deliveryTime:'30 mins', plans:{daily:170,weekly:1000,monthly:3900}, rating:4.6, reviewCount:64, verified:true, status:'approved', totalEarnings:46000 },

      { name:'Kiran Kumar', tagline:'Spicy Andhra Meals', cuisine:'Andhra', area:'Yelahanka', image:'https://picsum.photos/seed/kiran/600/400.jpg', avatar:'https://picsum.photos/seed/kiran-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'8 years', deliveryTime:'28 mins', plans:{daily:190,weekly:1120,monthly:4300}, rating:4.7, reviewCount:82, verified:true, status:'approved', totalEarnings:61000 },

      { name:'Pooja Jain', tagline:'Healthy Jain Homemade Food', cuisine:'Jain Food', area:'Banashankari', image:'https://picsum.photos/seed/pooja/600/400.jpg', avatar:'https://picsum.photos/seed/pooja-face/100/100.jpg', types:['Veg'], experience:'6 years', deliveryTime:'22 mins', plans:{daily:150,weekly:880,monthly:3300}, rating:4.5, reviewCount:58, verified:true, status:'approved', totalEarnings:41000 },

      { name:'Nafees Bhai', tagline:'Bangalore Famous Biryani', cuisine:'Biryani', area:'Domlur', image:'https://picsum.photos/seed/nafees/600/400.jpg', avatar:'https://picsum.photos/seed/nafees-face/100/100.jpg', types:['Non-Veg'], experience:'12 years', deliveryTime:'40 mins', plans:{daily:260,weekly:1600,monthly:5900}, rating:4.9, reviewCount:160, verified:true, status:'approved', totalEarnings:120000 },

      { name:'Geetha Rao', tagline:'Traditional Karnataka Meals', cuisine:'Karnataka Meals', area:'Malleshwaram', image:'https://picsum.photos/seed/geetha/600/400.jpg', avatar:'https://picsum.photos/seed/geetha-face/100/100.jpg', types:['Veg'], experience:'11 years', deliveryTime:'25 mins', plans:{daily:180,weekly:1020,monthly:4000}, rating:4.8, reviewCount:102, verified:true, status:'approved', totalEarnings:83000 },

      { name:'Arjun Chef', tagline:'Continental and Italian Dishes', cuisine:'Continental', area:'Bellandur', image:'https://picsum.photos/seed/arjun/600/400.jpg', avatar:'https://picsum.photos/seed/arjun-face/100/100.jpg', types:['Veg','Non-Veg'], experience:'5 years', deliveryTime:'32 mins', plans:{daily:240,weekly:1450,monthly:5600}, rating:4.6, reviewCount:71, verified:true, status:'approved', totalEarnings:50000 },

      { name:'Salma Khan', tagline:'Authentic Lucknowi Cuisine', cuisine:'Lucknowi', area:'Frazer Town', image:'https://picsum.photos/seed/salma/600/400.jpg', avatar:'https://picsum.photos/seed/salma-face/100/100.jpg', types:['Non-Veg'], experience:'9 years', deliveryTime:'30 mins', plans:{daily:230,weekly:1380,monthly:5200}, rating:4.8, reviewCount:118, verified:true, status:'approved', totalEarnings:91000 },

      { name:'Venkatesh Rao', tagline:'Healthy Veg Meals', cuisine:'Veg Meals', area:'Rajajinagar', image:'https://picsum.photos/seed/venkat/600/400.jpg', avatar:'https://picsum.photos/seed/venkat-face/100/100.jpg', types:['Veg'], experience:'7 years', deliveryTime:'20 mins', plans:{daily:145,weekly:860,monthly:3100}, rating:4.4, reviewCount:52, verified:true, status:'approved', totalEarnings:37000 },

      { name:'Amina Pathan', tagline:'Special Mughlai Dishes', cuisine:'Mughlai', area:'Shivajinagar', image:'https://picsum.photos/seed/amina/600/400.jpg', avatar:'https://picsum.photos/seed/amina-face/100/100.jpg', types:['Non-Veg'], experience:'8 years', deliveryTime:'34 mins', plans:{daily:210,weekly:1280,monthly:4700}, rating:4.7, reviewCount:89, verified:true, status:'approved', totalEarnings:64000 }

    ]);

    await Menu.create([

  // COOK 1
  { cook:cooks[0]._id, name:'Dal Tadka + Rice + Roti + Salad', type:'Veg', price:180, available:true, popular:true },
  { cook:cooks[0]._id, name:'Rajma Chawal + Raita + Pickle', type:'Veg', price:160, available:true, popular:false },
  { cook:cooks[0]._id, name:'Butter Chicken + Naan + Dal', type:'Non-Veg', price:220, available:true, popular:true },
  { cook:cooks[0]._id, name:'Paneer Butter Masala + Jeera Rice', type:'Veg', price:200, available:true, popular:false },
  { cook:cooks[0]._id, name:'Chicken Biryani + Raita + Salad', type:'Non-Veg', price:240, available:true, popular:true },
  { cook:cooks[0]._id, name:'Veg Pulao + Curry', type:'Veg', price:170, available:true, popular:false },
  { cook:cooks[0]._id, name:'Tandoori Chicken + Mint Chutney', type:'Non-Veg', price:260, available:true, popular:true },
  { cook:cooks[0]._id, name:'Aloo Paratha + Curd', type:'Veg', price:140, available:true, popular:false },

  // COOK 2
  { cook:cooks[1]._id, name:'Masala Dosa + Chutney + Sambar', type:'Veg', price:120, available:true, popular:true },
  { cook:cooks[1]._id, name:'Idli Vada Combo', type:'Veg', price:100, available:true, popular:false },
  { cook:cooks[1]._id, name:'Curd Rice + Pickle', type:'Veg', price:90, available:true, popular:false },
  { cook:cooks[1]._id, name:'South Indian Meals', type:'Veg', price:160, available:true, popular:true },
  { cook:cooks[1]._id, name:'Pongal + Chutney', type:'Veg', price:110, available:true, popular:false },
  { cook:cooks[1]._id, name:'Rava Dosa', type:'Veg', price:130, available:true, popular:true },
  { cook:cooks[1]._id, name:'Lemon Rice + Fryums', type:'Veg', price:100, available:true, popular:false },
  { cook:cooks[1]._id, name:'Tomato Rice + Raitha', type:'Veg', price:120, available:true, popular:false },

  // COOK 3
  { cook:cooks[2]._id, name:'Mutton Biryani', type:'Non-Veg', price:280, available:true, popular:true },
  { cook:cooks[2]._id, name:'Chicken Korma + Naan', type:'Non-Veg', price:240, available:true, popular:true },
  { cook:cooks[2]._id, name:'Keema Paratha', type:'Non-Veg', price:190, available:true, popular:false },
  { cook:cooks[2]._id, name:'Mughlai Chicken Curry', type:'Non-Veg', price:250, available:true, popular:true },
  { cook:cooks[2]._id, name:'Tandoori Roti + Mutton Curry', type:'Non-Veg', price:260, available:true, popular:false },
  { cook:cooks[2]._id, name:'Egg Curry + Rice', type:'Non-Veg', price:170, available:true, popular:false },
  { cook:cooks[2]._id, name:'Chicken Biryani Family Pack', type:'Non-Veg', price:350, available:true, popular:true },
  { cook:cooks[2]._id, name:'Paneer Korma + Naan', type:'Veg', price:200, available:true, popular:false },

  // COOK 4
  { cook:cooks[3]._id, name:'Gujarati Thali', type:'Veg', price:170, available:true, popular:true },
  { cook:cooks[3]._id, name:'Dhokla + Chutney', type:'Veg', price:90, available:true, popular:false },
  { cook:cooks[3]._id, name:'Undhiyu + Roti', type:'Veg', price:180, available:true, popular:true },
  { cook:cooks[3]._id, name:'Thepla + Pickle', type:'Veg', price:110, available:true, popular:false },
  { cook:cooks[3]._id, name:'Kadhi Chawal', type:'Veg', price:140, available:true, popular:false },
  { cook:cooks[3]._id, name:'Sev Tamatar Sabji', type:'Veg', price:150, available:true, popular:true },
  { cook:cooks[3]._id, name:'Fafda Jalebi Combo', type:'Veg', price:120, available:true, popular:false },
  { cook:cooks[3]._id, name:'Khichdi + Kadhi', type:'Veg', price:130, available:true, popular:false },

  // COOK 5
  { cook:cooks[4]._id, name:'Macher Jhol + Rice', type:'Non-Veg', price:230, available:true, popular:true },
  { cook:cooks[4]._id, name:'Chicken Kosha + Luchi', type:'Non-Veg', price:250, available:true, popular:true },
  { cook:cooks[4]._id, name:'Aloo Dum + Luchi', type:'Veg', price:150, available:true, popular:false },
  { cook:cooks[4]._id, name:'Fish Fry + Salad', type:'Non-Veg', price:220, available:true, popular:true },
  { cook:cooks[4]._id, name:'Bengali Veg Thali', type:'Veg', price:170, available:true, popular:false },
  { cook:cooks[4]._id, name:'Egg Curry + Rice', type:'Non-Veg', price:180, available:true, popular:false },
  { cook:cooks[4]._id, name:'Paneer Curry + Rice', type:'Veg', price:190, available:true, popular:false },
  { cook:cooks[4]._id, name:'Prawn Curry + Rice', type:'Non-Veg', price:280, available:true, popular:true },

  // COOK 6
  { cook:cooks[5]._id, name:'Chicken Cutlet + Bread', type:'Non-Veg', price:200, available:true, popular:true },
  { cook:cooks[5]._id, name:'Vegetable Pulao', type:'Veg', price:150, available:true, popular:false },
  { cook:cooks[5]._id, name:'Roast Chicken + Veggies', type:'Non-Veg', price:260, available:true, popular:true },
  { cook:cooks[5]._id, name:'Pasta Alfredo', type:'Veg', price:210, available:true, popular:false },
  { cook:cooks[5]._id, name:'Chicken Sandwich', type:'Non-Veg', price:160, available:true, popular:false },
  { cook:cooks[5]._id, name:'Veg Sandwich', type:'Veg', price:130, available:true, popular:false },
  { cook:cooks[5]._id, name:'Fish Fry + Fries', type:'Non-Veg', price:250, available:true, popular:true },
  { cook:cooks[5]._id, name:'Garlic Bread + Soup', type:'Veg', price:120, available:true, popular:false },
    // COOK 7
  { cook:cooks[6]._id, name:'Bisibele Bath + Raita', type:'Veg', price:150, available:true, popular:true },
  { cook:cooks[6]._id, name:'Ragi Mudde + Sambar', type:'Veg', price:160, available:true, popular:false },
  { cook:cooks[6]._id, name:'Akki Roti + Chutney', type:'Veg', price:130, available:true, popular:false },
  { cook:cooks[6]._id, name:'Mysore Masala Dosa', type:'Veg', price:140, available:true, popular:true },
  { cook:cooks[6]._id, name:'Rice Bath Combo', type:'Veg', price:120, available:true, popular:false },
  { cook:cooks[6]._id, name:'Filter Coffee + Snacks', type:'Veg', price:90, available:true, popular:false },
  { cook:cooks[6]._id, name:'Karnataka Meals', type:'Veg', price:180, available:true, popular:true },
  { cook:cooks[6]._id, name:'Veg Puliyogare', type:'Veg', price:110, available:true, popular:false },

  // COOK 8
  { cook:cooks[7]._id, name:'Hyderabadi Chicken Biryani', type:'Non-Veg', price:280, available:true, popular:true },
  { cook:cooks[7]._id, name:'Mutton Haleem', type:'Non-Veg', price:240, available:true, popular:true },
  { cook:cooks[7]._id, name:'Chicken 65', type:'Non-Veg', price:210, available:true, popular:false },
  { cook:cooks[7]._id, name:'Egg Biryani', type:'Non-Veg', price:180, available:true, popular:false },
  { cook:cooks[7]._id, name:'Paneer Biryani', type:'Veg', price:190, available:true, popular:false },
  { cook:cooks[7]._id, name:'Mutton Curry + Rice', type:'Non-Veg', price:260, available:true, popular:true },
  { cook:cooks[7]._id, name:'Chicken Shawarma', type:'Non-Veg', price:170, available:true, popular:false },
  { cook:cooks[7]._id, name:'Double Ka Meetha', type:'Veg', price:120, available:true, popular:false },

  // COOK 9
  { cook:cooks[8]._id, name:'Dal Baati Churma', type:'Veg', price:190, available:true, popular:true },
  { cook:cooks[8]._id, name:'Gatte Ki Sabzi', type:'Veg', price:170, available:true, popular:false },
  { cook:cooks[8]._id, name:'Ker Sangri + Roti', type:'Veg', price:180, available:true, popular:false },
  { cook:cooks[8]._id, name:'Rajasthani Thali', type:'Veg', price:220, available:true, popular:true },
  { cook:cooks[8]._id, name:'Mirchi Vada', type:'Veg', price:100, available:true, popular:false },
  { cook:cooks[8]._id, name:'Methi Bajra Roti', type:'Veg', price:140, available:true, popular:false },
  { cook:cooks[8]._id, name:'Pyaaz Kachori', type:'Veg', price:90, available:true, popular:false },
  { cook:cooks[8]._id, name:'Mawa Kachori', type:'Veg', price:110, available:true, popular:true },

  // COOK 10
  { cook:cooks[9]._id, name:'Andhra Meals Combo', type:'Non-Veg', price:230, available:true, popular:true },
  { cook:cooks[9]._id, name:'Gongura Chicken', type:'Non-Veg', price:240, available:true, popular:true },
  { cook:cooks[9]._id, name:'Andhra Fish Curry', type:'Non-Veg', price:250, available:true, popular:false },
  { cook:cooks[9]._id, name:'Pesarattu + Chutney', type:'Veg', price:130, available:true, popular:false },
  { cook:cooks[9]._id, name:'Spicy Chicken Fry', type:'Non-Veg', price:220, available:true, popular:true },
  { cook:cooks[9]._id, name:'Curd Rice', type:'Veg', price:100, available:true, popular:false },
  { cook:cooks[9]._id, name:'Tomato Pappu + Rice', type:'Veg', price:150, available:true, popular:false },
  { cook:cooks[9]._id, name:'Mutton Pulusu', type:'Non-Veg', price:270, available:true, popular:true },

  // COOK 11
  { cook:cooks[10]._id, name:'Jain Special Thali', type:'Veg', price:170, available:true, popular:true },
  { cook:cooks[10]._id, name:'Paneer Sabzi + Roti', type:'Veg', price:180, available:true, popular:false },
  { cook:cooks[10]._id, name:'Veg Khichdi', type:'Veg', price:130, available:true, popular:false },
  { cook:cooks[10]._id, name:'Dry Fruit Halwa', type:'Veg', price:140, available:true, popular:false },
  { cook:cooks[10]._id, name:'Jain Pulao', type:'Veg', price:150, available:true, popular:false },
  { cook:cooks[10]._id, name:'Veg Kofta Curry', type:'Veg', price:190, available:true, popular:true },
  { cook:cooks[10]._id, name:'Dal Fry + Jeera Rice', type:'Veg', price:160, available:true, popular:false },
  { cook:cooks[10]._id, name:'Stuffed Paratha Combo', type:'Veg', price:170, available:true, popular:true },

  // COOK 12
  { cook:cooks[11]._id, name:'Mutton Keema Biryani', type:'Non-Veg', price:300, available:true, popular:true },
  { cook:cooks[11]._id, name:'Chicken Fry Piece Biryani', type:'Non-Veg', price:280, available:true, popular:true },
  { cook:cooks[11]._id, name:'Egg Fried Rice', type:'Non-Veg', price:180, available:true, popular:false },
  { cook:cooks[11]._id, name:'Mutton Soup', type:'Non-Veg', price:150, available:true, popular:false },
  { cook:cooks[11]._id, name:'Chicken Kabab', type:'Non-Veg', price:240, available:true, popular:true },
  { cook:cooks[11]._id, name:'Fish Kabab', type:'Non-Veg', price:260, available:true, popular:false },
  { cook:cooks[11]._id, name:'Special Family Pack', type:'Non-Veg', price:450, available:true, popular:true },
  { cook:cooks[11]._id, name:'Chicken Curry Meals', type:'Non-Veg', price:230, available:true, popular:false },

  // COOK 13
  { cook:cooks[12]._id, name:'Ragi Mudde + Sambar', type:'Veg', price:160, available:true, popular:false },
  { cook:cooks[12]._id, name:'Karnataka Meals', type:'Veg', price:180, available:true, popular:true },
  { cook:cooks[12]._id, name:'Benne Dosa', type:'Veg', price:140, available:true, popular:true },
  { cook:cooks[12]._id, name:'Akki Roti Combo', type:'Veg', price:130, available:true, popular:false },
  { cook:cooks[12]._id, name:'Vegetable Sagu + Poori', type:'Veg', price:150, available:true, popular:false },
  { cook:cooks[12]._id, name:'Chow Chow Bath', type:'Veg', price:120, available:true, popular:false },
  { cook:cooks[12]._id, name:'Kesari Bath', type:'Veg', price:90, available:true, popular:false },
  { cook:cooks[12]._id, name:'South Meals Deluxe', type:'Veg', price:220, available:true, popular:true },

  // COOK 14
  { cook:cooks[13]._id, name:'White Sauce Pasta', type:'Veg', price:220, available:true, popular:true },
  { cook:cooks[13]._id, name:'Grilled Chicken Steak', type:'Non-Veg', price:320, available:true, popular:true },
  { cook:cooks[13]._id, name:'Veg Burger + Fries', type:'Veg', price:180, available:true, popular:false },
  { cook:cooks[13]._id, name:'Chicken Burger + Fries', type:'Non-Veg', price:220, available:true, popular:true },
  { cook:cooks[13]._id, name:'Pizza Margherita', type:'Veg', price:250, available:true, popular:false },
  { cook:cooks[13]._id, name:'Pepper Chicken Pizza', type:'Non-Veg', price:320, available:true, popular:true },
  { cook:cooks[13]._id, name:'Garlic Bread Combo', type:'Veg', price:130, available:true, popular:false },
  { cook:cooks[13]._id, name:'Creamy Mushroom Soup', type:'Veg', price:140, available:true, popular:false },

  // COOK 15
  { cook:cooks[14]._id, name:'Lucknowi Chicken Biryani', type:'Non-Veg', price:280, available:true, popular:true },
  { cook:cooks[14]._id, name:'Galouti Kebab', type:'Non-Veg', price:260, available:true, popular:true },
  { cook:cooks[14]._id, name:'Mutton Korma', type:'Non-Veg', price:300, available:true, popular:true },
  { cook:cooks[14]._id, name:'Chicken Rezala', type:'Non-Veg', price:250, available:true, popular:false },
  { cook:cooks[14]._id, name:'Rumali Roti Combo', type:'Non-Veg', price:190, available:true, popular:false },
  { cook:cooks[14]._id, name:'Shahi Tukda', type:'Veg', price:130, available:true, popular:false },
  { cook:cooks[14]._id, name:'Seekh Kebab', type:'Non-Veg', price:240, available:true, popular:true },
  { cook:cooks[14]._id, name:'Chicken Nihari', type:'Non-Veg', price:270, available:true, popular:true },

  // COOK 16
  { cook:cooks[15]._id, name:'Healthy Veg Meals', type:'Veg', price:150, available:true, popular:true },
  { cook:cooks[15]._id, name:'Vegetable Upma', type:'Veg', price:90, available:true, popular:false },
  { cook:cooks[15]._id, name:'Veg Khichdi', type:'Veg', price:120, available:true, popular:false },
  { cook:cooks[15]._id, name:'Paneer Rice Bowl', type:'Veg', price:180, available:true, popular:true },
  { cook:cooks[15]._id, name:'Curd Rice Combo', type:'Veg', price:100, available:true, popular:false },
  { cook:cooks[15]._id, name:'Mixed Veg Curry + Roti', type:'Veg', price:170, available:true, popular:false },
  { cook:cooks[15]._id, name:'Healthy Salad Bowl', type:'Veg', price:140, available:true, popular:false },
  { cook:cooks[15]._id, name:'Special Diet Thali', type:'Veg', price:200, available:true, popular:true },

  // COOK 17
  { cook:cooks[16]._id, name:'Mughlai Chicken Curry', type:'Non-Veg', price:260, available:true, popular:true },
  { cook:cooks[16]._id, name:'Mutton Biryani', type:'Non-Veg', price:300, available:true, popular:true },
  { cook:cooks[16]._id, name:'Chicken Kebab', type:'Non-Veg', price:220, available:true, popular:false },
  { cook:cooks[16]._id, name:'Egg Curry + Rice', type:'Non-Veg', price:180, available:true, popular:false },
  { cook:cooks[16]._id, name:'Butter Naan + Chicken Masala', type:'Non-Veg', price:240, available:true, popular:true },
  { cook:cooks[16]._id, name:'Paneer Mughlai', type:'Veg', price:210, available:true, popular:false },
  { cook:cooks[16]._id, name:'Special Mughlai Thali', type:'Non-Veg', price:320, available:true, popular:true },
  { cook:cooks[16]._id, name:'Chicken Roll', type:'Non-Veg', price:160, available:true, popular:false },

]);

    console.log('  Seed complete! 17 cooks, 28 menu items');

    process.exit(0);

  } catch (err) {

    console.error('  Seed error:', err);
    process.exit(1);

  }
};

seed();