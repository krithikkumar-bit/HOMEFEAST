require('dotenv').config({ path: './.env' });

const mongoose = require('mongoose');
const Cook = require('../models/Cook');
const Menu = require('../models/Menu');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const seed = async () => {
  try {

    await connectDB();

    console.log('  Clearing data...');

    await Menu.deleteMany({});
    await Cook.deleteMany({});
    await User.deleteMany({});

    await User.create({
  firstName: 'Admin',
  lastName: 'HomeFeast',
  email: 'admin@homefeast.com',
  password: hashedPassword,
  role: 'admin',
  status: 'Active'
});

const hashedPassword = await bcrypt.hash('123456',10);

const cookUsers = await User.create([

{
  firstName:'Meera',
  lastName:'Sharma',
  email:'meera@homefeast.com',
  password:hashedPassword,
  role:'cook',
  status:'Active'
},

{
  firstName:'Lakshmi',
  lastName:'Iyer',
  email:'lakshmi@homefeast.com',
  password:'lakshmi123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Rashida',
  lastName:'Begum',
  email:'rashida@homefeast.com',
  password:'rashida123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Shanti',
  lastName:'Patel',
  email:'shanti@homefeast.com',
  password:'shanti123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Ananya',
  lastName:'Das',
  email:'ananya@homefeast.com',
  password:'ananya123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Maria',
  lastName:'DSouza',
  email:'maria@homefeast.com',
  password:'maria123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Suresh',
  lastName:'Anna',
  email:'suresh@homefeast.com',
  password:'suresh123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Meghana',
  lastName:'Iyer',
  email:'meghana@homefeast.com',
  password:'meghana123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Ritu',
  lastName:'Agarwal',
  email:'ritu@homefeast.com',
  password:'ritu123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Kiran',
  lastName:'Kumar',
  email:'kiran@homefeast.com',
  password:'kiran123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Pooja',
  lastName:'Sharma',
  email:'pooja@homefeast.com',
  password:'pooja123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Nafees',
  lastName:'Bhai',
  email:'nafees@homefeast.com',
  password:'nafees123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Geetha',
  lastName:'Rao',
  email:'geetha@homefeast.com',
  password:'geetha123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Arjun',
  lastName:'Chef',
  email:'arjun@homefeast.com',
  password:'arjun123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Sujatha',
  lastName:'Khanna',
  email:'sujatha@homefeast.com',
  password:'sujatha123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Venkatesh',
  lastName:'Rao',
  email:'venkatesh@homefeast.com',
  password:'venkatesh123',
  role:'cook',
  status:'Active'
},

{
  firstName:'Amina',
  lastName:'Pathan',
  email:'amina@homefeast.com',
  password:'amina123',
  role:'cook',
  status:'Active'
}

]);

    const cooks = await Cook.create([

      { user:cookUsers[0]._id,name:'Meera Sharma', tagline:'Authentic North Indian home cooking', cuisine:'North Indian', area:'Koramangala, HSR Layout', image:'https://www.shutterstock.com/image-photo/attractive-indian-asian-young-female-260nw-2452543125.jpg', avatar:'https://www.shutterstock.com/image-photo/attractive-indian-asian-young-female-260nw-2452543125.jpg', types:['Veg','Non-Veg'], experience:'6 years', deliveryTime:'11:30 AM - 1:00 PM / 7:00 PM - 8:30 PM', plans:{daily:180,weekly:1100,monthly:4000}, rating:4.8, reviewCount:124, verified:true, status:'approved', totalEarnings:86400 },

      { user:cookUsers[1]._id,name:'Lakshmi Iyer', tagline:'Traditional South Indian meals', cuisine:'South Indian', area:'JP Nagar, Jayanagar', image:'https://t3.ftcdn.net/jpg/04/97/22/82/360_F_497228249_JxEWAs13JA8kQNNobOx6JtYT23FrdvlE.jpg', avatar:'https://t3.ftcdn.net/jpg/04/97/22/82/360_F_497228249_JxEWAs13JA8kQNNobOx6JtYT23FrdvlE.jpg', types:['Veg'], experience:'8 years', deliveryTime:'12:00 PM - 1:30 PM / 7:30 PM - 9:00 PM', plans:{daily:150,weekly:900,monthly:3400}, rating:4.9, reviewCount:98, verified:true, status:'approved', totalEarnings:61200 },

      { user:cookUsers[2]._id,name:'Rashida Begum', tagline:'Mughlai delicacies made with love', cuisine:'Mughlai', area:'Indiranagar, Domlur', image:'https://thumbs.dreamstime.com/b/woman-cooking-kitchen-23391361.jpg', avatar:'https://thumbs.dreamstime.com/b/woman-cooking-kitchen-23391361.jpg', types:['Non-Veg'], experience:'5 years', deliveryTime:'12:30 PM - 2:00 PM / 7:30 PM - 9:00 PM', plans:{daily:220,weekly:1350,monthly:5000}, rating:4.7, reviewCount:76, verified:true, status:'approved', totalEarnings:52800 },

      { user:cookUsers[3]._id,name:'Shanti Patel', tagline:'Pure Gujarati thali experience', cuisine:'Gujarati', area:'Whitefield, ITPL', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcziK3Dvq-vYRJnyjlMc6KsasPjZ6RSJqwzw&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcziK3Dvq-vYRJnyjlMc6KsasPjZ6RSJqwzw&s', types:['Veg'], experience:'4 years', deliveryTime:'11:00 AM - 12:30 PM', plans:{daily:160,weekly:950,monthly:3600}, rating:4.6, reviewCount:63, verified:true, status:'approved', totalEarnings:36000 },

      { user:cookUsers[4]._id,name:'Ananya Das', tagline:'Homely Bengali meals', cuisine:'Bengali', area:'Marathahalli, Sarjapur', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs2AMda-SpfceXQqQuNHD-BpkBOD7z1wWg_A&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs2AMda-SpfceXQqQuNHD-BpkBOD7z1wWg_A&s', types:['Veg','Non-Veg'], experience:'5 years', deliveryTime:'12:30 PM - 2:00 PM / 7:30 PM - 9:00 PM', plans:{daily:190,weekly:1150,monthly:4200}, rating:4.7, reviewCount:87, verified:true, status:'approved', totalEarnings:50400 },

      { user:cookUsers[5]._id,name:"Maria D'Souza", tagline:'Anglo-Indian comfort food', cuisine:'Anglo-Indian', area:'MG Road, Brigade Road', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ87Livx4JN4tVHZkfZxgZNlgDM6LnXqr2aIQ&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ87Livx4JN4tVHZkfZxgZNlgDM6LnXqr2aIQ&s', types:['Veg','Non-Veg'], experience:'3 years', deliveryTime:'12:00 PM - 1:30 PM / 7:00 PM - 8:30 PM', plans:{daily:200,weekly:1200,monthly:4500}, rating:4.5, reviewCount:41, verified:true, status:'pending', totalEarnings:0 },

      { user:cookUsers[6]._id,name:'Suresh Anna', tagline:'Authentic Karnataka Meals', cuisine:'South Indian', area:'BTM Layout', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7VV73TiDNyspOKJbh5OW1u0ydosqD1bVOxQ&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7VV73TiDNyspOKJbh5OW1u0ydosqD1bVOxQ&s', types:['Veg'], experience:'10 years', deliveryTime:'20 mins', plans:{daily:140,weekly:850,monthly:3200}, rating:4.8, reviewCount:110, verified:true, status:'approved', totalEarnings:72000 },

      { user:cookUsers[7]._id,name:'meghana iyer', tagline:'Special Hyderabadi Dum Biryani', cuisine:'Hyderabadi', area:'Electronic City', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwuW7IMI-d3YmAhiguPqG_VoYFA4FjTMQClg&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwuW7IMI-d3YmAhiguPqG_VoYFA4FjTMQClg&s', types:['Non-Veg'], experience:'9 years', deliveryTime:'35 mins', plans:{daily:250,weekly:1450,monthly:5400}, rating:4.9, reviewCount:132, verified:true, status:'approved', totalEarnings:95000 },

      { user:cookUsers[8]._id,name:'Ritu Agarwal', tagline:'Pure Rajasthani Homemade Food', cuisine:'Rajasthani', area:'HSR Layout', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRbUt7tqRqJwKd5TgE6smT79liBursSY_Aw&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRbUt7tqRqJwKd5TgE6smT79liBursSY_Aw&s', types:['Veg'], experience:'7 years', deliveryTime:'30 mins', plans:{daily:170,weekly:1000,monthly:3900}, rating:4.6, reviewCount:64, verified:true, status:'approved', totalEarnings:46000 },

      { user:cookUsers[9]._id,name:'Kiran Kumar', tagline:'Spicy Andhra Meals', cuisine:'Andhra', area:'Yelahanka', image:'https://www.shutterstock.com/image-photo/imagine-candid-indian-guy-cooking-260nw-2536946505.jpg', avatar:'https://www.shutterstock.com/image-photo/imagine-candid-indian-guy-cooking-260nw-2536946505.jpg', types:['Veg','Non-Veg'], experience:'8 years', deliveryTime:'28 mins', plans:{daily:190,weekly:1120,monthly:4300}, rating:4.7, reviewCount:82, verified:true, status:'approved', totalEarnings:61000 },

      { user:cookUsers[10]._id,name:'Pooja ', tagline:'Healthy  Homemade Food', cuisine:'Jain Food', area:'Banashankari', image:'https://static.vecteezy.com/system/resources/thumbnails/071/890/142/small/a-woman-is-cooking-in-the-kitchen-with-a-pot-on-the-stove-photo.jpg', avatar:'https://static.vecteezy.com/system/resources/thumbnails/071/890/142/small/a-woman-is-cooking-in-the-kitchen-with-a-pot-on-the-stove-photo.jpg', types:['Veg'], experience:'6 years', deliveryTime:'22 mins', plans:{daily:150,weekly:880,monthly:3300}, rating:4.5, reviewCount:58, verified:true, status:'approved', totalEarnings:41000 },

      { user:cookUsers[11]._id,name:'Nafees Bhai', tagline:'Bangalore Famous Biryani', cuisine:'Biryani', area:'Domlur', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTza-wkWbMtXT5xp2wJoUw5WE5hQUWORO9vOw&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTza-wkWbMtXT5xp2wJoUw5WE5hQUWORO9vOw&s', types:['Non-Veg'], experience:'12 years', deliveryTime:'40 mins', plans:{daily:260,weekly:1600,monthly:5900}, rating:4.9, reviewCount:160, verified:true, status:'approved', totalEarnings:120000 },

      { user:cookUsers[12]._id,name:'Geetha Rao', tagline:'Traditional Karnataka Meals', cuisine:'Karnataka Meals', area:'Malleshwaram', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTov8nnnfCPZ7HA4z9SkRG6PjLju6FxNsaxmQ&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTov8nnnfCPZ7HA4z9SkRG6PjLju6FxNsaxmQ&s', types:['Veg'], experience:'11 years', deliveryTime:'25 mins', plans:{daily:180,weekly:1020,monthly:4000}, rating:4.8, reviewCount:102, verified:true, status:'approved', totalEarnings:83000 },

      { user:cookUsers[13]._id,name:'Arjun Chef', tagline:'Continental and Italian Dishes', cuisine:'Continental', area:'Bellandur', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaFVRcogEQ7fre-aSfWnSLqkzwbv877FcA4A&s', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaFVRcogEQ7fre-aSfWnSLqkzwbv877FcA4A&s', types:['Veg','Non-Veg'], experience:'5 years', deliveryTime:'32 mins', plans:{daily:240,weekly:1450,monthly:5600}, rating:4.6, reviewCount:71, verified:true, status:'approved', totalEarnings:50000 },

      { user:cookUsers[14]._id,name:'Sujatha Khanna', tagline:'Authentic Lucknowi Cuisine', cuisine:'Lucknowi', area:'Frazer Town', image:'https://media.istockphoto.com/id/1451694385/photo/woman-in-the-kitchen-stock-photo.jpg?s=612x612&w=0&k=20&c=HiAh3mSyUIf_JG3kpUhkbt8_YJHWDG82rJ2Rd564Muw=', avatar:'https://media.istockphoto.com/id/1451694385/photo/woman-in-the-kitchen-stock-photo.jpg?s=612x612&w=0&k=20&c=HiAh3mSyUIf_JG3kpUhkbt8_YJHWDG82rJ2Rd564Muw=', types:['Non-Veg'], experience:'9 years', deliveryTime:'30 mins', plans:{daily:230,weekly:1380,monthly:5200}, rating:4.8, reviewCount:118, verified:true, status:'approved', totalEarnings:91000 },

      { user:cookUsers[15]._id,name:'Venkatesh Rao', tagline:'Healthy Veg Meals', cuisine:'Veg Meals', area:'Rajajinagar', image:'', avatar:'', types:['Veg'], experience:'7 years', deliveryTime:'20 mins', plans:{daily:145,weekly:860,monthly:3100}, rating:4.4, reviewCount:52, verified:true, status:'approved', totalEarnings:37000 },

      { user:cookUsers[16]._id,name:'Amina Pathan', tagline:'Special Mughlai Dishes', cuisine:'Mughlai', area:'Shivajinagar', image:'https://media.gettyimages.com/id/2148138865/photo/senior-woman-cutting-fresh-vegetables-for-dinner-stock-photo.jpg?s=612x612&w=gi&k=20&c=1sE_fyG3MROyx1Nb9r4wlpX2WsDX7nfsKPu62ipxUgs=', avatar:'https://media.gettyimages.com/id/2148138865/photo/senior-woman-cutting-fresh-vegetables-for-dinner-stock-photo.jpg?s=612x612&w=gi&k=20&c=1sE_fyG3MROyx1Nb9r4wlpX2WsDX7nfsKPu62ipxUgs=', types:['Non-Veg'], experience:'8 years', deliveryTime:'34 mins', plans:{daily:210,weekly:1280,monthly:4700}, rating:4.7, reviewCount:89, verified:true, status:'approved', totalEarnings:64000 }

    ]);

    await Menu.create([

  // COOK 1
  { cook:cooks[0]._id, name:'Dal Tadka + Rice + Roti + Salad', type:'Veg', price:180, image:'https://thumbs.dreamstime.com/b/vegetarian-thali-indian-food-meal-rice-roti-bread-delicious-258525182.jpg', available:true, popular:true },
  { cook:cooks[0]._id, name:'Rajma Chawal + Raita + Pickle', type:'Veg', price:160, image:'https://thumbs.dreamstime.com/b/delicious-rajma-chawal-indian-dish-rice-kidney-beans-curry-served-raita-pickles-plate-popular-features-bean-367701501.jpg', available:true, popular:false },
  { cook:cooks[0]._id, name:'Butter Chicken + Naan + Dal', type:'Non-Veg', price:220, image:'https://thumbs.dreamstime.com/b/indian-cuisine-butter-chicken-naan-salad-perfect-enticing-food-blogs-restaurant-promotions-cooking-delicious-curry-419579026.jpg', available:true, popular:true },
  { cook:cooks[0]._id, name:'Paneer Butter Masala + Jeera Rice', type:'Veg', price:200, image:'https://i.ytimg.com/vi/F7uwFUcO0Tw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCECE5068ZgQYy4hesOgQGERb_OSg',available:true, popular:false },
  { cook:cooks[0]._id, name:'Chicken Biryani + Raita + Salad', type:'Non-Veg', price:240, image:'https://images.stockcake.com/public/4/d/b/4dbeb9f6-2f1d-4874-b254-53f228f33619_large/biryani-with-raita-stockcake.jpg', available:true, popular:true },
  { cook:cooks[0]._id, name:'Tandoori Chicken + Mint Chutney', type:'Non-Veg', price:260, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi60iNACBBXGj2WmOW5aGOUFjD-zfDz5XOwQ&s', available:true, popular:true },

  // COOK 2
  { cook:cooks[1]._id, name:'Masala Dosa + Chutney + Sambar', type:'Veg', price:120, image:'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9zYXxlbnwwfHwwfHx8MA%3D%3D', available:true, popular:true },
  { cook:cooks[1]._id, name:'Idli Vada Combo', type:'Veg', price:100, available:true, image:'https://www.shutterstock.com/image-photo/idli-vada-sambar-sambhar-called-260nw-2478952869.jpg', popular:false },
  { cook:cooks[1]._id, name:'Curd Rice + Pickle', type:'Veg', price:70, available:true, image:'https://thumbs.dreamstime.com/b/traditional-curd-rise-lemon-pickle-ingredients-delicious-homemade-rice-south-indian-food-clay-pot-white-105799637.jpg', popular:false },
  { cook:cooks[1]._id, name:'South Indian Meals', type:'Veg', price:160, available:true, image:'https://www.shutterstock.com/image-photo/south-indian-meals-combination-sweet-260nw-2395883293.jpg', popular:true },
  { cook:cooks[1]._id, name:'Pongal + Chutney', type:'Veg', price:110, available:true, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFynBtd7Y3ss0JVZWtXFc2L1-jcxOW1mfy6Q&s', popular:false },
  { cook:cooks[1]._id, name:'Rava Dosa', type:'Veg', price:130, available:true, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxa5bl8cS2HGDBGwkf9CH7FdmvM_OVVKn0WQ&s', popular:true },
  { cook:cooks[1]._id, name:'Lemon Rice ', type:'Veg', price:60, available:true, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKD1_DCtISlQG8cdi-GUXu37xUBP2Vl4KZNw&s', popular:false },
  { cook:cooks[1]._id, name:'Tomato Rice + Raitha', type:'Veg', price:80, available:true, image:'https://i.redd.it/d1jtyjawsc781.jpg', popular:false },

  // COOK 3
  { cook:cooks[2]._id, name:'Mutton Biryani', type:'Non-Veg', price:280, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX2je5LfOL95ae7RZMciDc96fQlaP5zJi5oQ&s', available:true, popular:true },
  { cook:cooks[2]._id, name:'Chicken Korma + Naan', type:'Non-Veg', price:240, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMmKiQ_qym8UhClZykz0GBsWd4Tl7u31L5bQ&s', available:true, popular:true },
  { cook:cooks[2]._id, name:'Keema Paratha', type:'Non-Veg', price:190, image:'https://www.licious.in/blog/wp-content/uploads/2020/04/shutterstock_83591092.jpg', available:true, popular:false },
  { cook:cooks[2]._id, name:'Mughlai Chicken Curry', type:'Non-Veg', price:250, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZeN8stiBdecMVVFALJhtDmuxAQZ8kmkgH3g&s', available:true, popular:true },
  { cook:cooks[2]._id, name:'grill chicken', type:'Non-Veg', price:260, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToMozkkZv6pQonP3nn1BlXT2uLTWJxeshxYA&s', available:true, popular:false },
  { cook:cooks[2]._id, name:'Egg Curry + Rice', type:'Non-Veg', price:170, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrnkWJapiktEu6fDTNs5fzP4S9wfTW1f35w&s', available:true, popular:false },
  { cook:cooks[2]._id, name:'Chicken Biryani Family Pack', type:'Non-Veg', price:350, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqJRVCBqf2nl2y8e6fA3gXUxIkw4KXja5DPg&s', available:true, popular:true },
  { cook:cooks[2]._id, name:'Paneer Korma + Naan', type:'Veg', price:200, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGKgzaHUvfj7tUnyihg7LtZdLU0DOoZNuNw&s', available:true, popular:false },

  // COOK 4
  { cook:cooks[3]._id, name:'Gujarati Thali', type:'Veg', price:170, image:'https://t3.ftcdn.net/jpg/12/13/10/92/360_F_1213109270_m5jD4GpwZoHd2vtfM9gSpbm6ITnHzvFh.jpg', available:true, popular:true },
  { cook:cooks[3]._id, name:'Dhokla + Chutney', type:'Veg', price:90, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9J0G3XMOND0scQPb0U0DuVkGJ55SaIueP5g&s', available:true, popular:false },
  { cook:cooks[3]._id, name:'Undhiyu + Roti', type:'Veg', price:180,  image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh9IeHfLkC33nyTkLfYS14WFyH2c-2MfUZ5w&s',available:true, popular:true },
  { cook:cooks[3]._id, name:'Thepla + Pickle', type:'Veg', price:110, image:'https://thumbs.dreamstime.com/b/indian-food-thepla-pickle-17262245.jpg', available:true, popular:false },
  { cook:cooks[3]._id, name:'Kadhi Chawal', type:'Veg', price:80, image:'https://thumbs.dreamstime.com/b/kadhi-chawal-yogurt-curry-rice-indian-dish-155652315.jpg', available:true, popular:false },
  { cook:cooks[3]._id, name:'Sev Tamatar Sabji', type:'Veg', price:150, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUSGjEw1IeS3kKLFsEaU5yx3mvq6UZKrTFkA&s', available:true, popular:true },
  { cook:cooks[3]._id, name:'Fafda Jalebi Combo', type:'Veg', price:120, image:'https://thumbs.dreamstime.com/b/jalebi-fafda-beloved-combination-gujarat-india-sweet-savory-duo-cultural-symbol-enjoyed-festivals-360443798.jpg', available:true, popular:false },
  { cook:cooks[3]._id, name:'Khichdi + Kadhi', type:'Veg', price:130, image:'https://www.shutterstock.com/image-photo/khichdi-kadhi-gujarati-recipe-traditional-260nw-2486668289.jpg', available:true, popular:false },

  // COOK 5
  { cook:cooks[4]._id, name:'Macher Jhol + Rice', type:'Non-Veg', price:230, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSy4hpNeqT4y6_bXH63miCU8msB9AhLNkcmQ&s', available:true, popular:true },
  { cook:cooks[4]._id, name:'Chicken Kosha + Luchi', type:'Non-Veg', price:250, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-uEwbbRrEWwg0z_3HJASr82WwEtINXfpm7Q&s', available:true, popular:true },
  { cook:cooks[4]._id, name:'Aloo Dum + Luchi', type:'Veg', price:150, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjqN-nJz1oqSa9DkCIwMF78V9dNAWUlckWLg&s', available:true, popular:false },
  { cook:cooks[4]._id, name:'Fish Fry', type:'Non-Veg', price:220, image:'https://t3.ftcdn.net/jpg/11/70/50/60/360_F_1170506067_Q3yuOnvKCH4obRLgyVFJ8QXAALS9uCV4.jpg', available:true, popular:true },
  { cook:cooks[4]._id, name:'Bengali Veg Thali', type:'Veg', price:170, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTCqTDsV5JMMvrvq_7UpAPGDPStHmAcuQzMg&s', available:true, popular:false },
  { cook:cooks[4]._id, name:'Egg Curry + Rice', type:'Non-Veg', price:180, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYpFFNkF2P-dMmnkaKVradN8pBoVBq6yy9-g&s', available:true, popular:false },
  { cook:cooks[4]._id, name:'Paneer Curry + Rice', type:'Veg', price:190, image:'https://www.madhuseverydayindian.com/wp-content/uploads/2022/06/dhaba-style-paneer-curry-683x1024.jpg', available:true, popular:false },
  { cook:cooks[4]._id, name:'Prawn Curry + Rice', type:'Non-Veg', price:280, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh73lfh9mqIEmCzqd9pRym00SrONotOfxCuw&s', available:true, popular:true },

  // COOK 6
  { cook:cooks[5]._id, name:'Chicken Cutlet + Bread', type:'Non-Veg', price:200, image:'https://imhungryforthat.com/wp-content/uploads/2025/09/Chicken-cutlet-sandwich.jpg', available:true, popular:true },
  { cook:cooks[5]._id, name:'Vegetable Pulao', type:'Veg', price:150, image:'https://media.istockphoto.com/id/1146289003/photo/traditional-indian-street-food-rice-with-vegetables-close-up-on-a-plate-horizontal.jpg?s=170667a&w=is&k=20&c=Fsf_b9GAFNNuaRXbasuMGt3ziMBfIRzb-WW6nwlIsuQ=', available:true, popular:false },
  { cook:cooks[5]._id, name:'Roast Chicken + Veggies', type:'Non-Veg', price:260, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyvrjl1lmwqTCklcUtovG9EMG-LuMz4zhaCg&s', available:true, popular:true },
  { cook:cooks[5]._id, name:'Pasta Alfredo', type:'Veg', price:210,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1yx8P7S33trKj9JGWYq7PB-59GFoKnADGMA&s', available:true, popular:false },
  { cook:cooks[5]._id, name:'Chicken Sandwich', type:'Non-Veg', price:160, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjaFqafSQ_iLOjCUtCbRarVi3nmoZSj16xFg&s', available:true, popular:false },
  { cook:cooks[5]._id, name:'Veg Sandwich', type:'Veg', price:130, image:'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/veg-grilled-sandwich-recipe.jpg', available:true, popular:false },
  { cook:cooks[5]._id, name:'Fish Fry + Fries', type:'Non-Veg', price:250, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyAQYEV3I02y708q-LXPSxsn-HfkdPU6ByA&s', available:true, popular:true },
  { cook:cooks[5]._id, name:'Garlic Bread + Soup', type:'Veg', price:120, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLaWYVmPhuUgmRyOVtktgQZ1trGNTQ3lZYQg&s', available:true, popular:false },
    // COOK 7
  { cook:cooks[6]._id, name:'Bisibele Bath + Raita', type:'Veg', price:150, image:'https://www.theculinarypeace.com/wp-content/uploads/2019/09/IMG-6010-2-757x1024.jpg', available:true, popular:true },
  { cook:cooks[6]._id, name:'Ragi Mudde + Sambar', type:'Veg', price:160, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZa4cigMQBMFrch1Ucb_ZAkcu-wzezkTgqhg&s', available:true, popular:false },
  { cook:cooks[6]._id, name:'Akki Roti + Chutney', type:'Veg', price:130, image:'https://i.ytimg.com/vi/3K1NLnr1MjE/sddefault.jpg', available:true, popular:false },
  { cook:cooks[6]._id, name:'Mysore Masala Dosa', type:'Veg', price:140, image:'https://i.pinimg.com/736x/e8/dc/7f/e8dc7f0b59b8602ba30621dee3c6291c.jpg', available:true, popular:true },
  { cook:cooks[6]._id, name:'Rice Bath ', type:'Veg', price:90, image:'https://www.chitrasfoodbook.com/wp-content/uploads/2023/10/Karnataka20rice20bath-5.jpg', available:true, popular:false },
  { cook:cooks[6]._id, name:'Filter Coffee + Snacks', type:'Veg', price:90, image:'https://www.shutterstock.com/image-photo/crispy-medhu-vadai-filter-coffee-260nw-2383240101.jpg', available:true, popular:false },
  { cook:cooks[6]._id, name:'Veg Puliyogare', type:'Veg', price:110, image:'https://www.shutterstock.com/image-photo/south-indian-traditional-puliogare-puliodharai-260nw-2526352579.jpg', available:true, popular:false },

  // COOK 8
  { cook:cooks[7]._id, name:'Mutton Haleem', type:'Non-Veg', price:240, image:'https://www.licious.in/blog/wp-content/uploads/2022/04/Mutton-Haleem-Cooked-min-compressed-1-scaled.jpg', available:true, popular:true },
  { cook:cooks[7]._id, name:'Chicken 65', type:'Non-Veg', price:210, image:'https://www.shutterstock.com/image-photo/chicken-65-spicy-deep-fried-600nw-1950502363.jpg', available:true, popular:false },
  { cook:cooks[7]._id, name:'Egg Biryani', type:'Non-Veg', price:180, image:'https://spicecravings.com/wp-content/uploads/2020/10/Egg-Biryani-Featured-1.jpg', available:true, popular:false },
  { cook:cooks[7]._id, name:'Paneer Biryani', type:'Veg', price:190, image:'https://ministryofcurry.com/wp-content/uploads/2023/10/paneer-biryani_-9.jpg', available:true, popular:false },
  { cook:cooks[7]._id, name:'Mutton Curry + Rice', type:'Non-Veg', price:260, image:'https://somethingiscooking.com/wp-content/uploads/2018/12/kerala-mutton-curry.jpg', available:true, popular:true },
  { cook:cooks[7]._id, name:'Chicken Shawarma', type:'Non-Veg', price:170, image:'https://t3.ftcdn.net/jpg/03/94/39/14/360_F_394391470_i2fwSy9J0nIiGULYEBaJbWiAHLcs46pd.jpg', available:true, popular:false },

  // COOK 9
  { cook:cooks[8]._id, name:'Dal Baati Churma', type:'Veg', price:190, image:'https://thumbs.dreamstime.com/b/indian-meal-dal-baati-churma-traditional-rajasthani-bati-109155213.jpg', available:true, popular:true },
  { cook:cooks[8]._id, name:'Gatte Ki Sabzi', type:'Veg', price:170, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW3vLxm2z3M5IgsExJ6xEKrWQSSc25hoP_MA&s', available:true, popular:false },
  { cook:cooks[8]._id, name:'Ker Sangri + Roti', type:'Veg', price:180, image:'https://i.pinimg.com/736x/29/9b/ca/299bcaa8e0c2b63b4471b19d8e053c67.jpg', available:true, popular:false },
  { cook:cooks[8]._id, name:'Rajasthani Thali', type:'Veg', price:220, image:'https://thumbs.dreamstime.com/b/indian-thali-rajasthani-food-consisting-daal-baati-churma-gatte-ki-sabji-79196235.jpg', available:true, popular:true },
  { cook:cooks[8]._id, name:'Mirchi Vada', type:'Veg', price:70, image:'https://thumbs.dreamstime.com/b/indian-street-fried-food-spicy-chilli-pakora-s-popular-tea-time-snacks-indian-street-fried-food-spicy-chilli-pakora-served-195471838.jpg', available:true, popular:false },
  { cook:cooks[8]._id, name:'Methi Bajra Roti', type:'Veg', price:140, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMSRFHiBXN6tZ3_vlbPZHEkLBILTqTfZREjg&s', available:true, popular:false },
  { cook:cooks[8]._id, name:'Pyaaz Kachori', type:'Veg', price:90, image:'https://www.freshezy.in/cdn/shop/products/IMG_9735HR.jpg?v=1679397913&width=1946', available:true, popular:false },
  { cook:cooks[8]._id, name:'Mawa Kachori', type:'Veg', price:110, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPqmduCqCAMLm0BsIuM0kZ4_uCE3cC83RsEw&s', available:true, popular:true },

  // COOK 10
  { cook:cooks[9]._id, name:'Andhra Meals Combo', type:'Non-Veg', price:230, image:'https://nandhini.com/wp-content/uploads/2022/12/Andhra-Chicken-Meal.jpg', available:true, popular:true },
  { cook:cooks[9]._id, name:'Gongura Chicken', type:'Non-Veg', price:240, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD1LXYMHQfsdUsKnOCn5IVH6HdnJ-Spiv01A&s', available:true, popular:true },
  { cook:cooks[9]._id, name:'Andhra Fish Curry', type:'Non-Veg', price:270, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz5AHpQGWtFwqc0LSz8lEVBzw4ua6fESf-Gg&s', available:true, popular:false },
  { cook:cooks[9]._id, name:'Pesarattu + Chutney', type:'Veg', price:130, image:'https://www.shutterstock.com/image-photo/pesarattu-dosa-moong-dosai-indian-260nw-2246279175.jpg', available:true, popular:false },
  { cook:cooks[9]._id, name:'Spicy Chicken Fry', type:'Non-Veg', price:220, image:'https://i.ytimg.com/vi/ocihcawplw4/maxresdefault.jpg', available:true, popular:true },
  { cook:cooks[9]._id, name:'Curd Rice', type:'Veg', price:80, image:'https://rakskitchen.net/wp-content/uploads/2012/06/curd-rice-feat.jpg', available:true, popular:false },
  { cook:cooks[9]._id, name:'Tomato Pappu + Rice', type:'Veg', price:90, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkcwomnpnoZoa98VDiDeNC2FpQPq74_vW-OA&s', available:true, popular:false },
  { cook:cooks[9]._id, name:'Mutton Pulusu', type:'Non-Veg', price:270, image:'https://i.ytimg.com/vi/PMpJ9JJhI4s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB6jRekZlXvkouAFQ_-hMD1kyTwBQ', available:true, popular:true },

  // COOK 11
  { cook:cooks[10]._id, name:'mushroom chilli', type:'Veg', price:150, image:'https://vegplatter.in/files/public/images/partner/menu/1/mushroom%20chilli.jpg', available:true, popular:true },
  { cook:cooks[10]._id, name:'Paneer Sabzi + Roti', type:'Veg', price:180, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0pOWwjy_oKQwH-ul5DN6Q1JSe_XPAyFQCCA&s', available:true, popular:false },
  { cook:cooks[10]._id, name:'Veg Khichdi', type:'Veg', price:130, image:'https://www.funfoodfrolic.com/wp-content/uploads/2021/05/Dalia-Khichdi-Blog-Thumbnail-500x500.jpg', available:true, popular:false },
  { cook:cooks[10]._id, name:'Dry Fruit Halwa', type:'Veg', price:140, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHfN8Pkb1Iq_zPrvuW2RRtr6a6lBQjquKBDw&s', available:true, popular:false },
  { cook:cooks[10]._id, name:'veg Pulao', type:'Veg', price:90, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwh0-HII33DyqVTRBK4MK5CYxRQs8BufQhDw&s', available:true, popular:false },
  { cook:cooks[10]._id, name:'Veg Kofta Curry', type:'Veg', price:190, image:'https://shwetainthekitchen.com/wp-content/uploads/2014/10/DSC_0750.jpg', available:true, popular:true },
  { cook:cooks[10]._id, name:'Dal Fry + Jeera Rice', type:'Veg', price:160, image:'https://i.ytimg.com/vi/5fRrfmpNNno/maxresdefault.jpg', available:true, popular:false },
  { cook:cooks[10]._id, name:'Stuffed Paratha Combo', type:'Veg', price:170, image:'https://i.ytimg.com/vi/BOJ1IOiFato/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLASEGj508EIiAIBicHXDLKybDE5jw', available:true, popular:true },

  // COOK 12
  { cook:cooks[11]._id, name:'Mutton Keema Biryani', type:'Non-Veg', price:300, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlEATXyO5Poa0Ct17GVK5wPhmuqx1-_0BnAg&s', available:true, popular:true },
  { cook:cooks[11]._id, name:'Chicken Fry Piece Biryani', type:'Non-Veg', price:280, image:'https://i.ytimg.com/vi/iNwTdd2uk9s/maxresdefault.jpg', available:true, popular:true },
  { cook:cooks[11]._id, name:'Egg Fried Rice', type:'Non-Veg', price:160, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYsKe3gWvHhgv7QH3ST3FmoaZQLyaOxN4zPg&s', available:true, popular:false },
  { cook:cooks[11]._id, name:'Mutton Soup', type:'Non-Veg', price:150, image:'https://t4.ftcdn.net/jpg/03/18/63/75/360_F_318637571_eoK09rNV7WNAMhlzKBHO7aHPLrGNlLeF.jpg', available:true, popular:false },
  { cook:cooks[11]._id, name:'Chicken Kabab', type:'Non-Veg', price:240, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1612ihpv_IEmibOXjPRhjDYT6O2hdbYafVg&s', available:true, popular:true },
  { cook:cooks[11]._id, name:'Fish Kabab', type:'Non-Veg', price:260, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWneHyktMHTNsQIzNkZ0wXhD_lzXDG5lzDXQ&s', available:true, popular:false },
  { cook:cooks[11]._id, name:'Special Family Pack Chicken Biryani', type:'Non-Veg', price:450, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrdl6SOMWTxKmAuUXvTTj_9gvz0MSNc-3WCg&s', available:true, popular:true },
  { cook:cooks[11]._id, name:'Chicken Curry Meals', type:'Non-Veg', price:230, image:'https://www.tamingtwins.com/wp-content/uploads/2023/11/how-to-make-easy-chicken-curry-480x270.jpg', available:true, popular:false },

  // COOK 13
  { cook:cooks[12]._id, name:'Ragi Mudde + Sambar', type:'Veg', price:160, image:'https://karnatakatourism.org/_next/image/?url=https%3A%2F%2Fweb-cms.karnatakatourism.org%2Fwp-content%2Fuploads%2F2025%2F07%2FCusini-Ragi-Mudde.jpg&w=3840&q=75', available:true, popular:false },
  { cook:cooks[12]._id, name:'Karnataka Meals', type:'Veg', price:180, image:'https://www.shutterstock.com/image-photo/indian-vegetarian-platter-thali-meals-260nw-2487185113.jpg', available:true, popular:true },
  { cook:cooks[12]._id, name:'Benne Dosa', type:'Veg', price:140, image:'https://vegrecipesofkarnataka.com/assets/img/benne-dose/davanagere-benne-dosa-davangere-benne-dose.jpg', available:true, popular:true },
  { cook:cooks[12]._id, name:'Akki Roti Combo', type:'Veg', price:130, image:'https://www.chefkunalkapur.com/wp-content/uploads/2025/04/DSC00673-scaled.jpg?v=1744427087', available:true, popular:false },
  { cook:cooks[12]._id, name:'Vegetable Sagu + Poori', type:'Veg', price:150, image:'https://thumbs.dreamstime.com/b/deep-fried-poori-puri-served-spicy-potato-onion-curry-coconut-chatney-unleavened-bread-originating-174537706.jpg', available:true, popular:false },
  { cook:cooks[12]._id, name:'Chow Chow Bath', type:'Veg', price:120, image:'https://healthy-cooking-with-mitha.com/wp-content/uploads/2020/07/img_20200720_133330350027436124633079.jpg', available:true, popular:false },
  { cook:cooks[12]._id, name:'Kesari Bath', type:'Veg', price:90, image:'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/07/rava-kesari-recipe.jpg', available:true, popular:false },
  { cook:cooks[12]._id, name:'South Meals Deluxe', type:'Veg', price:220, image:'https://img.magnific.com/free-psd/authentic-indian-thali-platter-with-assorted-vegetarian-dishes_84443-64972.jpg?semt=ais_hybrid&w=740&q=80', available:true, popular:true },

  // COOK 14
  { cook:cooks[13]._id, name:'White Sauce Pasta', type:'Veg', price:220, image:'https://www.whiskaffair.com/wp-content/uploads/2021/05/White-Sauce-Paste-2-3.jpg', available:true, popular:true },
  { cook:cooks[13]._id, name:'Grilled Chicken Steak', type:'Non-Veg', price:320, image:'https://media.gettyimages.com/id/2193749851/photo/an-isolated-shot-of-a-white-plate-containing-sliced-grilled-chicken-breast-and-a-beef-meat.jpg?s=612x612&w=gi&k=20&c=yVrrMxeRMR0SHGdB4CETrEqgUQ7qPL4q6OXbJRaj5rI=', available:true, popular:true },
  { cook:cooks[13]._id, name:'Veg Burger + Fries', type:'Veg', price:180, image:'https://img.magnific.com/free-psd/juicy-cheeseburger-with-crispy-french-fries_191095-86328.jpg?semt=ais_hybrid&w=740&q=80', available:true, popular:false },
  { cook:cooks[13]._id, name:'Chicken Burger + Fries', type:'Non-Veg', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMNGujKKxAFhwhjG-4RjjbB0pS9xWvafUGAg&s', price:220, available:true, popular:true },
  { cook:cooks[13]._id, name:'Pizza Margherita', type:'Veg', price:250, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX2w-6ljxAJtEImAJ4zBsRnou1CoSAVmgvQw&s', available:true, popular:false },
  { cook:cooks[13]._id, name:'Pepper Chicken Pizza', type:'Non-Veg', price:320, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU5J7DIyphQ07QWzLV_cLSrvz2Owr-m_0sdg&s', available:true, popular:true },
  { cook:cooks[13]._id, name:'Garlic Bread Combo', type:'Veg', price:180, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIJ_uD5FFzgY6O_ZC_jc3jWCtcjDSzMhueQ&s', available:true, popular:false },
  { cook:cooks[13]._id, name:'Creamy Mushroom Soup', type:'Veg', price:140, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvW89uxfDQtE-V6F7luYkMv6Mu468zsxlFMQ&s', available:true, popular:false },

  // COOK 15
  { cook:cooks[14]._id, name:'Lucknowi Chicken Biryani', type:'Non-Veg', price:280, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj94L5cEB2ClJDep8OH9FMgTu92x6YwllZGw&s', available:true, popular:true },
  { cook:cooks[14]._id, name:'Galouti Kebab', type:'Non-Veg', price:260, image:'https://i0.wp.com/savorytales.com/wp-content/uploads/2022/04/IMG_6354-scaled.jpg?fit=1920%2C2560&ssl=1', available:true, popular:true },
  { cook:cooks[14]._id, name:'Mutton Korma', type:'Non-Veg', price:300, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfX_5iJSe3_0um-OThJLpdlQSMi8YvFiguXw&s', available:true, popular:true },
  { cook:cooks[14]._id, name:'Chicken Rezala', type:'Non-Veg', price:250, image:'https://www.whiskaffair.com/wp-content/uploads/2018/12/Bengali-Chicken-Rezala-2-3.jpg', available:true, popular:false },
  { cook:cooks[14]._id, name:'Rumali Roti Combo', type:'Non-Veg', price:190,  image:'https://pbs.twimg.com/media/DrD2T-_VsAEdrFw.jpg',available:true, popular:false },
  { cook:cooks[14]._id, name:'Shahi Tukda', type:'Veg', price:130, image:'https://www.whiskaffair.com/wp-content/uploads/2019/03/Shahi-Tukda-2-1.jpg', available:true, popular:false },
  { cook:cooks[14]._id, name:'Seekh Kebab', type:'Non-Veg', price:240, image:'https://www.ndtv.com/cooks/images/chicken.seekh.jpg', available:true, popular:true },
  { cook:cooks[14]._id, name:'Chicken Nihari', type:'Non-Veg', price:270, image:'https://recipe52.com/wp-content/uploads/2021/10/Chicken-Nihari-13.jpg', available:true, popular:true },

  // COOK 16
  { cook:cooks[15]._id, name:'Healthy Veg Meals', type:'Veg', price:150, image:'https://media.istockphoto.com/id/481149282/photo/south-indian-food.jpg?s=612x612&w=0&k=20&c=w43naq0743XDvzCi5FW_ROvzw4_KaCkuam16sfy3hTc=', available:true, popular:true },
  { cook:cooks[15]._id, name:'Vegetable Upma', type:'Veg', price:90, image:'https://www.kuchpakrahahai.in/wp-content/uploads/2016/09/Vegetable-upma.jpg', available:true, popular:false },
  { cook:cooks[15]._id, name:'Veg Khichdi', type:'Veg', price:120, image:'https://www.jhajistore.com/cdn/shop/articles/20250101065912-feature_01706701-00e9-4df6-a165-7367aa52a3f8.jpg?v=1772033657', available:true, popular:false },
  { cook:cooks[15]._id, name:'Paneer Rice Bowl', type:'Veg', price:180, image:'https://i0.wp.com/naturallynidhi.com/wp-content/uploads/2020/04/TandooriPaneerBowl_Cover.jpg?fit=2016%2C1512&ssl=1', available:true, popular:true },
  { cook:cooks[15]._id, name:'Curd Rice Combo', type:'Veg', price:100, image:'https://www.spiceupthecurry.com/wp-content/uploads/2024/06/curd-rice-2.jpg', available:true, popular:false },
  { cook:cooks[15]._id, name:'Mixed Veg Curry + Roti', type:'Veg', price:170, image:'https://www.shutterstock.com/image-photo/mix-vegetable-curry-indian-recipe-260nw-2225697127.jpg', available:true, popular:false },
  { cook:cooks[15]._id, name:'Healthy Fruit Salad Bowl', type:'Veg', price:140, image:'https://static.vecteezy.com/system/resources/previews/054/368/346/large_2x/healthy-fruit-salad-in-coconut-bowl-photo.jpg', available:true, popular:false },
  { cook:cooks[15]._id, name:'Special Mushroom Biryani', type:'Veg', price:200, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkXrLU31yEJnznWH5VsJoPtsa6X7GOsFH-vw&s', available:true, popular:true },

  // COOK 17
  { cook:cooks[16]._id, name:'Mughlai Chicken Curry', type:'Non-Veg', price:260, image:'https://hinzcooking.com/wp-content/uploads/2019/04/mughlai-chicken.jpg', available:true, popular:true },
  { cook:cooks[16]._id, name:'Mutton Biryani', type:'Non-Veg', price:300, image:'https://t4.ftcdn.net/jpg/04/41/20/03/360_F_441200344_iTkgSlBqkep1bcSmdWXTA1ZkCRFl9J6a.jpg', available:true, popular:true },
  { cook:cooks[16]._id, name:'Chicken Kebab', type:'Non-Veg', price:220, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd6pGBOq5ENYJFCeeErpgjr80IiFm4WNIWEA&s', available:true, popular:false },
  { cook:cooks[16]._id, name:'Egg Curry + Rice', type:'Non-Veg', price:180, image:'https://carameltintedlife.com/wp-content/uploads/2020/03/Instant-Pot-Egg-Curry-8.jpg', available:true, popular:false },
  { cook:cooks[16]._id, name:'Butter Naan + Chicken Masala', type:'Non-Veg', price:240, image:'https://www.missionfoods.com/wp-content/uploads/2022/06/easy-butter-chicken-naan.jpg', available:true, popular:true },
  { cook:cooks[16]._id, name:'Paneer Mughlai', type:'Veg', price:210,  image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStc2hrYBATJGfsLamzzQwvW99HbSuEVFNhPw&s',available:true, popular:false },
  { cook:cooks[16]._id, name:'kadai panner', type:'Veg', price:220,  image:'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/kadai-paneer-recipe.jpg',available:true, popular:true },
  { cook:cooks[16]._id, name:'Chicken Roll', type:'Non-Veg', price:160, image:'https://t3.ftcdn.net/jpg/06/37/40/84/360_F_637408480_IAFCxtisgL0g7akySXd9Li0aTSQfwhBV.jpg', available:true, popular:false },

]);

    console.log('  Seed complete! 17 cooks, 136 menu items');

    process.exit(0);

  } catch (err) {

    console.error('  Seed error:', err);
    process.exit(1);

  }
};

seed();