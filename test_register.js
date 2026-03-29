const mongoose = require('mongoose');
const { User, UserFactory } = require('./server/models/User');
require('dotenv').config();

async function testRegister() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_management');
        console.log('Connected to MongoDB');

        const testData = {
            name: 'Test Admin',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            phone: '1234567890',
            role: 'admin'
        };

        console.log('Creating admin with UserFactory...');
        const user = UserFactory.createAdmin(testData);
        console.log('User created:', user.email, user.role);

        console.log('Saving user...');
        await user.save();
        console.log('User saved successfully');

        // Clean up
        await User.deleteOne({ _id: user._id });
        console.log('Test user deleted');

        process.exit(0);
    } catch (err) {
        console.error('Registration test failed:');
        console.error(err);
        process.exit(1);
    }
}

testRegister();
