require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
}

console.log('🔄 Attempting to connect to MongoDB...');
// Mask the password in the output for safety
const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log(`📡 URI: ${maskedUri}`);

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connection Successful!');
        console.log('📂 Listing collections:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        if (collections.length === 0) {
            console.log('   (No collections found in this database)');
        } else {
            collections.forEach(col => console.log(`   - ${col.name}`));
        }
        await mongoose.disconnect();
        console.log('👋 Disconnected cleanly.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed:');
        console.error(err.message);

        if (err.message.includes('ECONNREFUSED')) {
            console.error('\n📋 Troubleshooting Tips:');
            console.error('1. Check if your IP address is whitelisted in MongoDB Atlas.');
            console.error('2. Verify if a firewall or VPN is blocking the connection.');
            console.error('3. Ensure the cluster address is correct.');
        } else if (err.message.includes('bad auth')) {
            console.error('\n📋 Troubleshooting Tips:');
            console.error('1. Check your database username and password in .env.');
            console.error('2. Ensure the user has read/write permissions on the database.');
        }

        process.exit(1);
    });
