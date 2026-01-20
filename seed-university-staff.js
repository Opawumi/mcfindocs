require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection string - load from .env
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in .env file');
    console.log('Please ensure your .env file contains:');
    console.log('MONGODB_URI=mongodb+srv://...');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    department: String,
    designation: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Comprehensive University Staff for Testing
const universityStaff = [
    // Top Management
    {
        name: 'Prof. Michael Adewale',
        email: 'admin@university.edu',
        password: 'password123',
        role: 'admin',
        department: 'Administration',
        designation: 'System Administrator'
    },
    {
        name: 'Prof. Sarah Johnson',
        email: 'vc@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Vice Chancellor Office',
        designation: 'Vice Chancellor'
    },
    {
        name: 'Dr. Emmanuel Okafor',
        email: 'dvc.admin@university.edu',
        password: 'password123',
        role: 'user',
        department: 'DVC Admin Office',
        designation: 'Deputy Vice Chancellor (Admin)'
    },
    {
        name: 'Dr. Grace Nwosu',
        email: 'dvc.academic@university.edu',
        password: 'password123',
        role: 'user',
        department: 'DVC Academic Office',
        designation: 'Deputy Vice Chancellor (Academic)'
    },

    // Registry & Admin
    {
        name: 'Mrs. Janet Akinola',
        email: 'registrar@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Registry',
        designation: 'Registrar'
    },
    {
        name: 'Mr. Daniel Eze',
        email: 'deputy.registrar@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Registry',
        designation: 'Deputy Registrar'
    },
    {
        name: 'Ms. Fatima Bello',
        email: 'registry.officer@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Registry',
        designation: 'Registry Officer'
    },

    // Academic Deans
    {
        name: 'Prof. David Ogunleye',
        email: 'dean@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Faculty of Science',
        designation: 'Dean of Science'
    },
    {
        name: 'Prof. Amina Hassan',
        email: 'dean.arts@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Faculty of Arts',
        designation: 'Dean of Arts'
    },
    {
        name: 'Dr. Peter Okonkwo',
        email: 'dean.engineering@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Faculty of Engineering',
        designation: 'Dean of Engineering'
    },
    {
        name: 'Dr. Elizabeth Yusuf',
        email: 'dean.medicine@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Faculty of Medicine',
        designation: 'Dean of Medicine'
    },

    // Department Heads
    {
        name: 'Dr. Oluwaseun Balogun',
        email: 'hod.computerscience@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Computer Science',
        designation: 'Head of Department'
    },
    {
        name: 'Dr. Chioma Nduka',
        email: 'hod.mathematics@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Mathematics',
        designation: 'Head of Department'
    },
    {
        name: 'Dr. Ibrahim Ahmed',
        email: 'hod.english@university.edu',
        password: 'password123',
        role: 'user',
        department: 'English Language',
        designation: 'Head of Department'
    },

    // Finance & Bursary
    {
        name: 'Mr. Christopher Adu',
        email: 'bursar@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Bursary',
        designation: 'Bursar'
    },
    {
        name: 'Mrs. Blessing Okoro',
        email: 'finance.officer@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Finance',
        designation: 'Finance Officer'
    },

    // Librarian
    {
        name: 'Dr. Ahmed Suleiman',
        email: 'librarian@university.edu',
        password: 'password123',
        role: 'user',
        department: 'Library',
        designation: 'University Librarian'
    },
];

async function seedUniversityStaff() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB Atlas');

        for (const staff of universityStaff) {
            const existingUser = await User.findOne({ email: staff.email });

            if (existingUser) {
                // Update password and details
                const hashedPassword = await bcrypt.hash(staff.password, 10);
                await User.updateOne(
                    { email: staff.email },
                    {
                        $set: {
                            password: hashedPassword,
                            name: staff.name,
                            department: staff.department,
                            designation: staff.designation,
                            role: staff.role
                        }
                    }
                );
                console.log(`✓ Updated: ${staff.name} (${staff.email})`);
            } else {
                // Create new user
                const hashedPassword = await bcrypt.hash(staff.password, 10);
                await User.create({
                    name: staff.name,
                    email: staff.email,
                    password: hashedPassword,
                    role: staff.role,
                    department: staff.department,
                    designation: staff.designation
                });
                console.log(`✓ Created: ${staff.name} (${staff.email})`);
            }
        }

        console.log('\n===========================================');
        console.log('✓ All University Staff Accounts Ready!');
        console.log('===========================================');
        console.log('\nTotal Accounts:', universityStaff.length);
        console.log('Password for all accounts: password123');
        console.log('\nAccount Breakdown:');
        console.log('- 1 Admin Account');
        console.log('- 4 Top Management (VC, 2 DVCs)');
        console.log('- 3 Registry Staff');
        console.log('- 4 Faculty Deans');
        console.log('- 3 Department Heads');
        console.log('- 2 Finance Staff');
        console.log('- 1 Librarian');

        await mongoose.disconnect();
        console.log('\n✓ Disconnected from database');
    } catch (error) {
        console.error('Error seeding university staff:', error);
        process.exit(1);
    }
}

seedUniversityStaff();
