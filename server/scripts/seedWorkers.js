// Script to update all worker emails in the database to firstnamelastname@gmail.com
const mongoose = require('mongoose');
const { Worker } = require('../models/Worker');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

async function updateWorkerEmails() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const workers = await Worker.find();
  for (const worker of workers) {
    if (worker.name) {
      const names = worker.name.split(' ');
      const emailName = names.join('').toLowerCase();
      worker.email = emailName + '@gmail.com';
      await worker.save();
      console.log(`Updated: ${worker.name} -> ${worker.email}`);
    }
  }
  await mongoose.disconnect();
  console.log('All worker emails updated.');
}

updateWorkerEmails().catch(err => {
  console.error('Error updating worker emails:', err);
  process.exit(1);
});
