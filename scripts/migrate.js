const mongoose = require('mongoose');

// Configuration
// Local database URI (Source)
const SOURCE_URI = 'mongodb://localhost:27017/mcfindocs';

// Get destination URI from command line argument
const DEST_URI = process.argv[2];

if (!DEST_URI) {
    console.error('\nError: Destination URI is missing.');
    console.error('Usage: node scripts/migrate.js "<YOUR_ONLINE_CONNECTION_STRING>"\n');
    console.error('Please provide the generic MongoDB connection string (starts with mongodb+srv://) as an argument.');
    process.exit(1);
}

async function migrate() {
    console.log('Starting migration...');

    // Connect to source
    console.log(`Connecting to Source DB (${SOURCE_URI})...`);
    // Using createConnection to manage multiple independent connections
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    console.log('✅ Connected to Source DB');

    // Connect to destination
    console.log(`Connecting to Destination DB...`);
    const destConn = await mongoose.createConnection(DEST_URI).asPromise();
    console.log('✅ Connected to Destination DB');

    try {
        // Get all collections from source
        const collections = await sourceConn.db.listCollections().toArray();
        console.log(`\nFound ${collections.length} collections to migrate.`);

        for (const collection of collections) {
            const name = collection.name;

            // Skip system collections
            if (name.startsWith('system.')) continue;

            console.log(`\nProcessing collection: ${name}`);

            // Define generic models for both sides to bypass schema validation
            // We use strict: false to treat documents as generic objects
            const SourceModel = sourceConn.model(name, new mongoose.Schema({}, { strict: false }), name);
            const DestModel = destConn.model(name, new mongoose.Schema({}, { strict: false }), name);

            // Fetch all documents from source
            const docs = await SourceModel.find({}).lean();
            console.log(`  - Found ${docs.length} documents.`);

            if (docs.length > 0) {
                try {
                    // Insert into destination
                    // ordered: false ensures that if one fails (e.g., duplicate), others still proceed
                    const result = await DestModel.insertMany(docs, { ordered: false });
                    console.log(`  - ✅ Successfully inserted documents.`);
                } catch (err) {
                    if (err.code === 11000 || (err.writeErrors && err.writeErrors.some(e => e.code === 11000))) {
                        // Duplicate key error is common if running multiple times
                        const insertedCount = err.result ? err.result.nInserted : (docs.length - (err.writeErrors ? err.writeErrors.length : 0));
                        console.log(`  - ⚠️ Partial success: Inserted ${insertedCount} new documents.`);
                        console.log(`  - Some documents already existed (duplicates skipped).`);
                    } else {
                        console.error(`  - ❌ Failed to insert documents:`, err.message);
                    }
                }
            } else {
                console.log('  - Local collection is empty, skipping.');
            }
        }

        console.log('\n✨ Migration completed successfully!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
    } finally {
        // Close connections
        await sourceConn.close();
        await destConn.close();
        console.log('Connections closed.');
        process.exit(0);
    }
}

migrate();
