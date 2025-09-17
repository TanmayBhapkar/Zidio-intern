import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-excel';

async function seed() {
  await mongoose.connect(MONGO);
  const admins = [
    { name: 'Super Admin', email: 'admin1@example.com', password: 'Admin@123', role: 'admin' },
    { name: 'Content Admin', email: 'admin2@example.com', password: 'Admin@123', role: 'admin' }
  ];

  for (const a of admins) {
    let user = await User.findOne({ email: a.email });
    if (!user) {
      const hashed = await bcrypt.hash(a.password, 10);
      user = new User({ name: a.name, email: a.email, password: hashed, role: a.role });
      await user.save();
      console.log('Created admin', a.email);
    } else {
      console.log('Admin exists', a.email);
    }
  }
  await mongoose.disconnect();
  console.log('Done');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
