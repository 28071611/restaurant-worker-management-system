const mongoose = require('mongoose');
const { Worker } = require('./server/models/Worker');
const { User } = require('./server/models/User');
require('dotenv').config();

async function syncWorkers() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_management');
        console.log('Connected to MongoDB');

        const workers = await Worker.find({});
        console.log(`Found ${workers.length} workers`);

        let syncCount = 0;
        for (const worker of workers) {
            const existingUser = await User.findOne({ email: worker.email });
            if (!existingUser) {
                const user = new User({
                    name: worker.name,
                    email: worker.email,
                    password: 'Worker@123', // Default password
                    role: 'worker',
                    phone: worker.phone
                });
                await user.save();
                syncCount++;
            }
        }

        console.log(`Successfully synced ${syncCount} workers to User table`);
        process.exit(0);
    } catch (error) {
        console.error('Error syncing workers:', error);
        process.exit(1);
    }
}

syncWorkers();
