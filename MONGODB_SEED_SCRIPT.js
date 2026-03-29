/**
 * MongoDB Seed Script for Restaurant Worker Management System
 * 
 * This script seeds 100 workers into MongoDB database
 * Run with: node server/seedDatabase.js
 * 
 * Prerequisites:
 * - MongoDB running locally (default port 27017)
 * - Database created: restaurant_management
 */

const mongoose = require('mongoose');
const { Worker } = require('./server/models/Worker');

// 100 Workers Dataset with proper MongoDB format
const workersDataset = [
  {
    name: "Ravi Kumar",
    role: "Chef",
    salary: 18000,
    shift: "Morning",
    phone: "9876500001",
    department: "Kitchen",
    experience: 5,
    email: "ravi.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Arun Prakash",
    role: "Waiter",
    salary: 9000,
    shift: "Evening",
    phone: "9876500002",
    department: "Service",
    experience: 2,
    email: "arun.prakash@restaurant.com",
    status: "Active"
  },
  {
    name: "Suresh Babu",
    role: "Cleaner",
    salary: 7000,
    shift: "Morning",
    phone: "9876500003",
    department: "Maintenance",
    experience: 3,
    email: "suresh.babu@restaurant.com",
    status: "Active"
  },
  {
    name: "Vijay Raj",
    role: "Manager",
    salary: 25000,
    shift: "Full",
    phone: "9876500004",
    department: "Management",
    experience: 8,
    email: "vijay.raj@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthik",
    role: "Chef",
    salary: 20000,
    shift: "Evening",
    phone: "9876500005",
    department: "Kitchen",
    experience: 6,
    email: "karthik@restaurant.com",
    status: "Active"
  },
  {
    name: "Manoj",
    role: "Waiter",
    salary: 8500,
    shift: "Morning",
    phone: "9876500006",
    department: "Service",
    experience: 2,
    email: "manoj@restaurant.com",
    status: "Active"
  },
  {
    name: "Deepak",
    role: "Cleaner",
    salary: 7200,
    shift: "Evening",
    phone: "9876500007",
    department: "Maintenance",
    experience: 1,
    email: "deepak@restaurant.com",
    status: "Active"
  },
  {
    name: "Ajith",
    role: "Chef",
    salary: 22000,
    shift: "Morning",
    phone: "9876500008",
    department: "Kitchen",
    experience: 7,
    email: "ajith@restaurant.com",
    status: "Active"
  },
  {
    name: "Praveen",
    role: "Cashier",
    salary: 12000,
    shift: "Full",
    phone: "9876500009",
    department: "Billing",
    experience: 3,
    email: "praveen@restaurant.com",
    status: "Active"
  },
  {
    name: "Santhosh",
    role: "Security",
    salary: 8000,
    shift: "Night",
    phone: "9876500010",
    department: "Security",
    experience: 4,
    email: "santhosh@restaurant.com",
    status: "Active"
  },
  {
    name: "Gokul",
    role: "Waiter",
    salary: 8800,
    shift: "Evening",
    phone: "9876500011",
    department: "Service",
    experience: 2,
    email: "gokul@restaurant.com",
    status: "Active"
  },
  {
    name: "Naveen",
    role: "Chef",
    salary: 21000,
    shift: "Morning",
    phone: "9876500012",
    department: "Kitchen",
    experience: 6,
    email: "naveen@restaurant.com",
    status: "Active"
  },
  {
    name: "Hari",
    role: "Cleaner",
    salary: 7500,
    shift: "Morning",
    phone: "9876500013",
    department: "Maintenance",
    experience: 3,
    email: "hari@restaurant.com",
    status: "Active"
  },
  {
    name: "Ramesh",
    role: "Manager",
    salary: 26000,
    shift: "Full",
    phone: "9876500014",
    department: "Management",
    experience: 9,
    email: "ramesh@restaurant.com",
    status: "Active"
  },
  {
    name: "Kiran",
    role: "Cashier",
    salary: 11500,
    shift: "Evening",
    phone: "9876500015",
    department: "Billing",
    experience: 2,
    email: "kiran@restaurant.com",
    status: "Active"
  },
  {
    name: "Dinesh",
    role: "Chef",
    salary: 19500,
    shift: "Morning",
    phone: "9876500016",
    department: "Kitchen",
    experience: 5,
    email: "dinesh@restaurant.com",
    status: "Active"
  },
  {
    name: "Vignesh",
    role: "Waiter",
    salary: 8700,
    shift: "Evening",
    phone: "9876500017",
    department: "Service",
    experience: 3,
    email: "vignesh@restaurant.com",
    status: "Active"
  },
  {
    name: "Saravanan",
    role: "Cleaner",
    salary: 7100,
    shift: "Morning",
    phone: "9876500018",
    department: "Maintenance",
    experience: 2,
    email: "saravanan@restaurant.com",
    status: "Active"
  },
  {
    name: "Anand",
    role: "Security",
    salary: 8200,
    shift: "Night",
    phone: "9876500019",
    department: "Security",
    experience: 4,
    email: "anand@restaurant.com",
    status: "Active"
  },
  {
    name: "Murugan",
    role: "Chef",
    salary: 23000,
    shift: "Evening",
    phone: "9876500020",
    department: "Kitchen",
    experience: 8,
    email: "murugan@restaurant.com",
    status: "Active"
  },
  {
    name: "Lokesh",
    role: "Waiter",
    salary: 8600,
    shift: "Morning",
    phone: "9876500021",
    department: "Service",
    experience: 2,
    email: "lokesh@restaurant.com",
    status: "Active"
  },
  {
    name: "Bala",
    role: "Cleaner",
    salary: 7300,
    shift: "Evening",
    phone: "9876500022",
    department: "Maintenance",
    experience: 3,
    email: "bala@restaurant.com",
    status: "Active"
  },
  {
    name: "Rajesh",
    role: "Chef",
    salary: 20500,
    shift: "Morning",
    phone: "9876500023",
    department: "Kitchen",
    experience: 6,
    email: "rajesh@restaurant.com",
    status: "Active"
  },
  {
    name: "Sathish",
    role: "Cashier",
    salary: 12500,
    shift: "Full",
    phone: "9876500024",
    department: "Billing",
    experience: 4,
    email: "sathish@restaurant.com",
    status: "Active"
  },
  {
    name: "Prakash",
    role: "Security",
    salary: 8100,
    shift: "Night",
    phone: "9876500025",
    department: "Security",
    experience: 3,
    email: "prakash@restaurant.com",
    status: "Active"
  },
  {
    name: "Ashok",
    role: "Chef",
    salary: 21500,
    shift: "Morning",
    phone: "9876500026",
    department: "Kitchen",
    experience: 7,
    email: "ashok@restaurant.com",
    status: "Active"
  },
  {
    name: "Kumaravel",
    role: "Waiter",
    salary: 8900,
    shift: "Evening",
    phone: "9876500027",
    department: "Service",
    experience: 3,
    email: "kumaravel@restaurant.com",
    status: "Active"
  },
  {
    name: "Selvam",
    role: "Cleaner",
    salary: 7400,
    shift: "Morning",
    phone: "9876500028",
    department: "Maintenance",
    experience: 2,
    email: "selvam@restaurant.com",
    status: "Active"
  },
  {
    name: "Rohit",
    role: "Manager",
    salary: 27000,
    shift: "Full",
    phone: "9876500029",
    department: "Management",
    experience: 10,
    email: "rohit@restaurant.com",
    status: "Active"
  },
  {
    name: "Rahul",
    role: "Cashier",
    salary: 13000,
    shift: "Evening",
    phone: "9876500030",
    department: "Billing",
    experience: 5,
    email: "rahul@restaurant.com",
    status: "Active"
  },
  {
    name: "Sanjay",
    role: "Chef",
    salary: 22500,
    shift: "Morning",
    phone: "9876500031",
    department: "Kitchen",
    experience: 7,
    email: "sanjay@restaurant.com",
    status: "Active"
  },
  {
    name: "Kishore",
    role: "Waiter",
    salary: 9100,
    shift: "Evening",
    phone: "9876500032",
    department: "Service",
    experience: 3,
    email: "kishore@restaurant.com",
    status: "Active"
  },
  {
    name: "Mohan",
    role: "Cleaner",
    salary: 7600,
    shift: "Morning",
    phone: "9876500033",
    department: "Maintenance",
    experience: 4,
    email: "mohan@restaurant.com",
    status: "Active"
  },
  {
    name: "Varun",
    role: "Security",
    salary: 8300,
    shift: "Night",
    phone: "9876500034",
    department: "Security",
    experience: 3,
    email: "varun@restaurant.com",
    status: "Active"
  },
  {
    name: "Aravind",
    role: "Chef",
    salary: 24000,
    shift: "Evening",
    phone: "9876500035",
    department: "Kitchen",
    experience: 9,
    email: "aravind@restaurant.com",
    status: "Active"
  },
  {
    name: "Yogesh",
    role: "Waiter",
    salary: 8800,
    shift: "Morning",
    phone: "9876500036",
    department: "Service",
    experience: 2,
    email: "yogesh@restaurant.com",
    status: "Active"
  },
  {
    name: "Thiru",
    role: "Cleaner",
    salary: 7200,
    shift: "Evening",
    phone: "9876500037",
    department: "Maintenance",
    experience: 2,
    email: "thiru@restaurant.com",
    status: "Active"
  },
  {
    name: "Bharath",
    role: "Chef",
    salary: 21000,
    shift: "Morning",
    phone: "9876500038",
    department: "Kitchen",
    experience: 6,
    email: "bharath@restaurant.com",
    status: "Active"
  },
  {
    name: "Ganesh",
    role: "Cashier",
    salary: 12000,
    shift: "Full",
    phone: "9876500039",
    department: "Billing",
    experience: 3,
    email: "ganesh@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthi",
    role: "Security",
    salary: 8500,
    shift: "Night",
    phone: "9876500040",
    department: "Security",
    experience: 5,
    email: "karthi@restaurant.com",
    status: "Active"
  },
  {
    name: "Vinod",
    role: "Chef",
    salary: 22000,
    shift: "Morning",
    phone: "9876500041",
    department: "Kitchen",
    experience: 7,
    email: "vinod@restaurant.com",
    status: "Active"
  },
  {
    name: "Arjun",
    role: "Waiter",
    salary: 8700,
    shift: "Evening",
    phone: "9876500042",
    department: "Service",
    experience: 3,
    email: "arjun@restaurant.com",
    status: "Active"
  },
  {
    name: "Siva",
    role: "Cleaner",
    salary: 7000,
    shift: "Morning",
    phone: "9876500043",
    department: "Maintenance",
    experience: 1,
    email: "siva@restaurant.com",
    status: "Active"
  },
  {
    name: "Dharani",
    role: "Manager",
    salary: 26000,
    shift: "Full",
    phone: "9876500044",
    department: "Management",
    experience: 8,
    email: "dharani@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthikeya",
    role: "Cashier",
    salary: 12500,
    shift: "Evening",
    phone: "9876500045",
    department: "Billing",
    experience: 4,
    email: "karthikeya@restaurant.com",
    status: "Active"
  },
  {
    name: "Nithin",
    role: "Chef",
    salary: 23000,
    shift: "Morning",
    phone: "9876500046",
    department: "Kitchen",
    experience: 8,
    email: "nithin@restaurant.com",
    status: "Active"
  },
  {
    name: "Harish",
    role: "Waiter",
    salary: 9000,
    shift: "Evening",
    phone: "9876500047",
    department: "Service",
    experience: 2,
    email: "harish@restaurant.com",
    status: "Active"
  },
  {
    name: "Ragul",
    role: "Cleaner",
    salary: 7400,
    shift: "Morning",
    phone: "9876500048",
    department: "Maintenance",
    experience: 3,
    email: "ragul@restaurant.com",
    status: "Active"
  },
  {
    name: "Vasu",
    role: "Security",
    salary: 8200,
    shift: "Night",
    phone: "9876500049",
    department: "Security",
    experience: 4,
    email: "vasu@restaurant.com",
    status: "Active"
  },
  {
    name: "Manikandan",
    role: "Chef",
    salary: 25000,
    shift: "Evening",
    phone: "9876500050",
    department: "Kitchen",
    experience: 10,
    email: "manikandan@restaurant.com",
    status: "Active"
  },
  {
    name: "Siddharth",
    role: "Waiter",
    salary: 9200,
    shift: "Morning",
    phone: "9876500051",
    department: "Service",
    experience: 3,
    email: "siddharth@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthikeyan",
    role: "Cleaner",
    salary: 7700,
    shift: "Evening",
    phone: "9876500052",
    department: "Maintenance",
    experience: 2,
    email: "karthikeyan@restaurant.com",
    status: "Active"
  },
  {
    name: "Vikram",
    role: "Manager",
    salary: 28000,
    shift: "Full",
    phone: "9876500053",
    department: "Management",
    experience: 12,
    email: "vikram@restaurant.com",
    status: "Active"
  },
  {
    name: "Abhishek",
    role: "Cashier",
    salary: 13500,
    shift: "Full",
    phone: "9876500054",
    department: "Billing",
    experience: 5,
    email: "abhishek@restaurant.com",
    status: "Active"
  },
  {
    name: "Rohit Sharma",
    role: "Security",
    salary: 8600,
    shift: "Night",
    phone: "9876500055",
    department: "Security",
    experience: 6,
    email: "rohit.sharma@restaurant.com",
    status: "Active"
  },
  {
    name: "Amit Kumar",
    role: "Chef",
    salary: 23500,
    shift: "Morning",
    phone: "9876500056",
    department: "Kitchen",
    experience: 9,
    email: "amit.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Praveen Kumar",
    role: "Waiter",
    salary: 9300,
    shift: "Evening",
    phone: "9876500057",
    department: "Service",
    experience: 4,
    email: "praveen.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Murali",
    role: "Cleaner",
    salary: 7800,
    shift: "Morning",
    phone: "9876500058",
    department: "Maintenance",
    experience: 3,
    email: "murali@restaurant.com",
    status: "Active"
  },
  {
    name: "Sundar",
    role: "Chef",
    salary: 24500,
    shift: "Evening",
    phone: "9876500059",
    department: "Kitchen",
    experience: 11,
    email: "sundar@restaurant.com",
    status: "Active"
  },
  {
    name: "Madhavan",
    role: "Waiter",
    salary: 9400,
    shift: "Morning",
    phone: "9876500060",
    department: "Service",
    experience: 3,
    email: "madhavan@restaurant.com",
    status: "Active"
  },
  {
    name: "Kalyan",
    role: "Cleaner",
    salary: 7900,
    shift: "Evening",
    phone: "9876500061",
    department: "Maintenance",
    experience: 4,
    email: "kalyan@restaurant.com",
    status: "Active"
  },
  {
    name: "Vijay Kumar",
    role: "Manager",
    salary: 29000,
    shift: "Full",
    phone: "9876500062",
    department: "Management",
    experience: 15,
    email: "vijay.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Ajay Kumar",
    role: "Cashier",
    salary: 14000,
    shift: "Full",
    phone: "9876500063",
    department: "Billing",
    experience: 6,
    email: "ajay.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Naveen Kumar",
    role: "Security",
    salary: 8700,
    shift: "Night",
    phone: "9876500064",
    department: "Security",
    experience: 5,
    email: "naveen.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Anand Kumar",
    role: "Chef",
    salary: 25000,
    shift: "Morning",
    phone: "9876500065",
    department: "Kitchen",
    experience: 10,
    email: "anand.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Raj Kumar",
    role: "Waiter",
    salary: 9500,
    shift: "Evening",
    phone: "9876500066",
    department: "Service",
    experience: 4,
    email: "raj.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Suresh Kumar",
    role: "Cleaner",
    salary: 8000,
    shift: "Morning",
    phone: "9876500067",
    department: "Maintenance",
    experience: 3,
    email: "suresh.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Mohan Kumar",
    role: "Chef",
    salary: 26000,
    shift: "Evening",
    phone: "9876500068",
    department: "Kitchen",
    experience: 12,
    email: "mohan.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Vikram Kumar",
    role: "Waiter",
    salary: 9600,
    shift: "Morning",
    phone: "9876500069",
    department: "Service",
    experience: 5,
    email: "vikram.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthik Kumar",
    role: "Cleaner",
    salary: 8100,
    shift: "Evening",
    phone: "9876500070",
    department: "Maintenance",
    experience: 4,
    email: "karthik.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Arun Kumar",
    role: "Manager",
    salary: 30000,
    shift: "Full",
    phone: "9876500071",
    department: "Management",
    experience: 18,
    email: "arun.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Deepak Kumar",
    role: "Cashier",
    salary: 14500,
    shift: "Full",
    phone: "9876500072",
    department: "Billing",
    experience: 7,
    email: "deepak.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Prakash Kumar",
    role: "Security",
    salary: 8800,
    shift: "Night",
    phone: "9876500073",
    department: "Security",
    experience: 6,
    email: "prakash.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Ashok Kumar",
    role: "Chef",
    salary: 27000,
    shift: "Morning",
    phone: "9876500074",
    department: "Kitchen",
    experience: 14,
    email: "ashok.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Ramesh Kumar",
    role: "Waiter",
    salary: 9700,
    shift: "Evening",
    phone: "9876500075",
    department: "Service",
    experience: 5,
    email: "ramesh.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Sathish Kumar",
    role: "Cleaner",
    salary: 8200,
    shift: "Morning",
    phone: "9876500076",
    department: "Maintenance",
    experience: 4,
    email: "sathish.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Sanjay Kumar",
    role: "Chef",
    salary: 28000,
    shift: "Evening",
    phone: "9876500077",
    department: "Kitchen",
    experience: 16,
    email: "sanjay.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Kishore Kumar",
    role: "Waiter",
    salary: 9800,
    shift: "Morning",
    phone: "9876500078",
    department: "Service",
    experience: 6,
    email: "kishore.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Mohan Kumar",
    role: "Cleaner",
    salary: 8300,
    shift: "Evening",
    phone: "9876500079",
    department: "Maintenance",
    experience: 5,
    email: "mohan.kumar2@restaurant.com",
    status: "Active"
  },
  {
    name: "Varun Kumar",
    role: "Manager",
    salary: 32000,
    shift: "Full",
    phone: "9876500080",
    department: "Management",
    experience: 20,
    email: "varun.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Aravind Kumar",
    role: "Cashier",
    salary: 15000,
    shift: "Full",
    phone: "9876500081",
    department: "Billing",
    experience: 8,
    email: "aravind.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Yogesh Kumar",
    role: "Security",
    salary: 8900,
    shift: "Night",
    phone: "9876500082",
    department: "Security",
    experience: 7,
    email: "yogesh.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Thiru Kumar",
    role: "Chef",
    salary: 29000,
    shift: "Morning",
    phone: "9876500083",
    department: "Kitchen",
    experience: 18,
    email: "thiru.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Bharath Kumar",
    role: "Waiter",
    salary: 9900,
    shift: "Evening",
    phone: "9876500084",
    department: "Service",
    experience: 7,
    email: "bharath.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Ganesh Kumar",
    role: "Cleaner",
    salary: 8400,
    shift: "Morning",
    phone: "9876500085",
    department: "Maintenance",
    experience: 6,
    email: "ganesh.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthi Kumar",
    role: "Chef",
    salary: 30000,
    shift: "Evening",
    phone: "9876500086",
    department: "Kitchen",
    experience: 20,
    email: "karthi.kumar2@restaurant.com",
    status: "Active"
  },
  {
    name: "Vinod Kumar",
    role: "Waiter",
    salary: 10000,
    shift: "Morning",
    phone: "9876500087",
    department: "Service",
    experience: 8,
    email: "vinod.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Arjun Kumar",
    role: "Cleaner",
    salary: 8500,
    shift: "Evening",
    phone: "9876500088",
    department: "Maintenance",
    experience: 5,
    email: "arjun.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Siva Kumar",
    role: "Manager",
    salary: 35000,
    shift: "Full",
    phone: "9876500089",
    department: "Management",
    experience: 25,
    email: "siva.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Dharani Kumar",
    role: "Cashier",
    salary: 15500,
    shift: "Full",
    phone: "9876500090",
    department: "Billing",
    experience: 9,
    email: "dharani.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthikeya Kumar",
    role: "Security",
    salary: 9000,
    shift: "Night",
    phone: "9876500091",
    department: "Security",
    experience: 8,
    email: "karthikeya.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Nithin Kumar",
    role: "Chef",
    salary: 31000,
    shift: "Morning",
    phone: "9876500092",
    department: "Kitchen",
    experience: 22,
    email: "nithin.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Harish Kumar",
    role: "Waiter",
    salary: 10100,
    shift: "Evening",
    phone: "9876500093",
    department: "Service",
    experience: 9,
    email: "harish.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Ragul Kumar",
    role: "Cleaner",
    salary: 8600,
    shift: "Morning",
    phone: "9876500094",
    department: "Maintenance",
    experience: 7,
    email: "ragul.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Vasu Kumar",
    role: "Chef",
    salary: 32000,
    shift: "Evening",
    phone: "9876500095",
    department: "Kitchen",
    experience: 24,
    email: "vasu.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Manikandan Kumar",
    role: "Waiter",
    salary: 10200,
    shift: "Morning",
    phone: "9876500096",
    department: "Service",
    experience: 10,
    email: "manikandan.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Siddharth Kumar",
    role: "Cleaner",
    salary: 8700,
    shift: "Evening",
    phone: "9876500097",
    department: "Maintenance",
    experience: 6,
    email: "siddharth.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Karthikeyan Kumar",
    role: "Manager",
    salary: 38000,
    shift: "Full",
    phone: "9876500098",
    department: "Management",
    experience: 30,
    email: "karthikeyan.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Vijay Kumar",
    role: "Cashier",
    salary: 16000,
    shift: "Full",
    phone: "9876500099",
    department: "Billing",
    experience: 10,
    email: "vijay.kumar@restaurant.com",
    status: "Active"
  },
  {
    name: "Abhishek Kumar",
    role: "Security",
    salary: 9100,
    shift: "Night",
    phone: "9876500100",
    department: "Security",
    experience: 9,
    email: "abhishek.kumar@restaurant.com",
    status: "Active"
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/restaurant_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('🔗 Connected to MongoDB');

    // Clear existing workers (optional - remove if you want to keep existing data)
    console.log('🗑️  Clearing existing workers...');
    await Worker.deleteMany({});
    console.log('✅ Existing workers cleared');

    // Insert workers in batches for better performance
    console.log('📊 Inserting 100 workers...');
    const batchSize = 10;
    let inserted = 0;

    for (let i = 0; i < workersDataset.length; i += batchSize) {
      const batch = workersDataset.slice(i, i + batchSize);
      await Worker.insertMany(batch);
      inserted += batch.length;
      console.log(`📈 Inserted ${inserted}/${workersDataset.length} workers`);
    }

    console.log('✅ Successfully seeded 100 workers!');

    // Display statistics
    const totalWorkers = await Worker.countDocuments();
    const byDepartment = await Worker.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const byRole = await Worker.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Database Statistics:');
    console.log(`👥 Total Workers: ${totalWorkers}`);
    console.log('\n🏢 By Department:');
    byDepartment.forEach(dept => {
      console.log(`   ${dept._id}: ${dept.count} workers`);
    });
    console.log('\n👨‍💼 By Role:');
    byRole.forEach(role => {
      console.log(`   ${role._id}: ${role.count} workers`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    console.log('🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, workersDataset };
