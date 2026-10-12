import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import { connectDB } from './config/db';
import { Customer } from './models/Customer';
import { Company } from './models/Company';
import { Product } from './models/Product';
import { Category } from './models/Category';
import { PriceList } from './models/PriceList';
import { Particular } from './models/Particular';
import { AccountLedger } from './models/AccountLedger';
import { Settings } from './models/Settings';
import { seedDefaultAdmin } from './controllers/authController';

const seedSampleData = async () => {
  try {
    console.log('🌱 Connecting to database...');
    await connectDB();

    console.log('👤 Ensuring default admin exists...');
    await seedDefaultAdmin();

    console.log('🧹 Clearing existing collections (preserving admin)...');
    await Customer.deleteMany({});
    await Company.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await PriceList.deleteMany({});
    await Particular.deleteMany({});
    await AccountLedger.deleteMany({});

    console.log('⚙️ Ensuring PBL Crackers Settings...');
    await Settings.findOneAndUpdate(
      {},
      {
        companyName: 'PBL Crackers',
        tagline: 'Wholesales and Retail Crackers',
        ownerName: 'PBL Team',
        phone: '9843067073',
        whatsapp: '8778429299',
        email: 'pblcrackers@gmail.com',
        address: '67 - H/E, Rajivgandhi Nagar, Near Ramji Polypack, Sivakasi Bus Stand , Sivakasi',
        city: 'Sivakasi',
        pincode: '626123',
        state: 'Tamil Nadu',
        gstin: '33AAACP1234F1Z5',
        pan: 'AAACP1234F',
        enableTax: false,
        defaultTaxRate: '18',
        gstTurnoverBaseline: '726900.00',
        gstTurnoverCurrent: '726900.00',
      },
      { upsert: true, new: true }
    );

    console.log('🏷️ Seeding Crackers Categories...');
    const categoriesData = [
      { name: 'One Sound Crackers', code: 'OSC', color: '#DC2626', displayOrder: 1 },
      { name: 'Ground Chakkars', code: 'GCK', color: '#EA580C', displayOrder: 2 },
      { name: 'Flower Pots', code: 'FLP', color: '#D97706', displayOrder: 3 },
      { name: 'Rockets', code: 'RCK', color: '#2563EB', displayOrder: 4 },
      { name: 'Sparklers', code: 'SPK', color: '#7C3AED', displayOrder: 5 },
      { name: 'Garlands / Saravedi', code: 'GAR', color: '#B91C1C', displayOrder: 6 },
      { name: 'Fancy & Aerial Shots', code: 'FNC', color: '#059669', displayOrder: 7 },
    ];
    await Category.insertMany(categoriesData);

    console.log('📦 Seeding Products & Price List Items...');
    const sampleCrackers = [
      { slNo: 1, name: '2 3/4" Kuruvi Crackers', category: 'One Sound Crackers', unit: 'Box', rate: 45, mrp: 60 },
      { slNo: 2, name: '3 1/2" Lakshmi Crackers', category: 'One Sound Crackers', unit: 'Pkt', rate: 65, mrp: 85 },
      { slNo: 3, name: '4" Deluxe Crackers', category: 'One Sound Crackers', unit: 'Pkt', rate: 110, mrp: 150 },
      { slNo: 4, name: 'Ground Chakkars Big', category: 'Ground Chakkars', unit: 'Box', rate: 85, mrp: 120 },
      { slNo: 5, name: 'Ground Chakkars Special', category: 'Ground Chakkars', unit: 'Box', rate: 130, mrp: 180 },
      { slNo: 6, name: 'Ground Chakkars Deluxe', category: 'Ground Chakkars', unit: 'Box', rate: 190, mrp: 250 },
      { slNo: 7, name: 'Flower Pots Small', category: 'Flower Pots', unit: 'Box', rate: 75, mrp: 100 },
      { slNo: 8, name: 'Flower Pots Big', category: 'Flower Pots', unit: 'Box', rate: 125, mrp: 165 },
      { slNo: 9, name: 'Flower Pots Special', category: 'Flower Pots', unit: 'Box', rate: 180, mrp: 240 },
      { slNo: 10, name: 'Flower Pots Asoka', category: 'Flower Pots', unit: 'Box', rate: 220, mrp: 290 },
      { slNo: 11, name: 'Baby Rocket', category: 'Rockets', unit: 'Box', rate: 90, mrp: 125 },
      { slNo: 12, name: 'Bomb Rocket', category: 'Rockets', unit: 'Box', rate: 140, mrp: 190 },
      { slNo: 13, name: '10cm Color Sparklers', category: 'Sparklers', unit: 'Box', rate: 55, mrp: 75 },
      { slNo: 14, name: '15cm Green Sparklers', category: 'Sparklers', unit: 'Box', rate: 85, mrp: 115 },
      { slNo: 15, name: '30cm Red Sparklers', category: 'Sparklers', unit: 'Box', rate: 120, mrp: 160 },
      { slNo: 16, name: '100 Wala Garland', category: 'Garlands / Saravedi', unit: 'Pkt', rate: 80, mrp: 110 },
      { slNo: 17, name: '1000 Wala Garland', category: 'Garlands / Saravedi', unit: 'Box', rate: 450, mrp: 600 },
      { slNo: 18, name: '5000 Wala Garland', category: 'Garlands / Saravedi', unit: 'Box', rate: 2200, mrp: 2900 },
      { slNo: 19, name: '12 Shots Multicolor', category: 'Fancy & Aerial Shots', unit: 'Box', rate: 320, mrp: 450 },
      { slNo: 20, name: '30 Shots Mega Display', category: 'Fancy & Aerial Shots', unit: 'Box', rate: 780, mrp: 1050 },
    ];

    const products = await Product.insertMany(sampleCrackers);
    await PriceList.insertMany(
      sampleCrackers.map((item) => ({
        slNo: item.slNo,
        itemName: item.name,
        category: item.category,
        unit: item.unit,
        rate: item.rate,
        mrp: item.mrp,
        discountPercent: 0,
      }))
    );

    console.log('🏢 Seeding Companies...');
    const companies = await Company.insertMany([
      {
        slNo: '01',
        name: 'PBL Crackers',
        avatarLetter: 'P',
        avatarBg: '#DBEAFE',
        avatarColor: '#0B4DB7',
        address: '67 - H/E, Rajivgandhi Nagar, Near Ramji Polypack, Sivakasi Bus Stand , Sivakasi - 626123',
        gstin: '33AAACP1234F1Z5',
      },
      {
        slNo: '02',
        name: 'Sri Krishna Fireworks',
        avatarLetter: 'K',
        avatarBg: '#DCFCE7',
        avatarColor: '#166534',
        address: '104, By-Pass Road, Sivakasi, Tamil Nadu - 626123',
        gstin: '33AABCK5678K1Z2',
      },
    ]);

    console.log('👥 Seeding Customers...');
    const customers = await Customer.insertMany([
      {
        idCode: 'CUST-001',
        name: 'Sri Murugan Crackers Agency',
        avatarLetter: 'M',
        avatarBg: '#E0E7FF',
        avatarColor: '#3730A3',
        address: '45, East Veli Street, Madurai, Tamil Nadu - 625001',
        mobile: '+91 98421 23456',
        gst: '33AABCS1111A1Z1',
      },
      {
        idCode: 'CUST-002',
        name: 'Venkateswara Fireworks Traders',
        avatarLetter: 'V',
        avatarBg: '#FCE7F3',
        avatarColor: '#9D174D',
        address: '12, Junction Main Road, Salem, Tamil Nadu - 636005',
        mobile: '+91 98765 43210',
        gst: '33AADCV2222B1Z2',
      },
      {
        idCode: 'CUST-003',
        name: 'Balaji Fancy Crackers Mart',
        avatarLetter: 'B',
        avatarBg: '#F3E8FF',
        avatarColor: '#6B21A8',
        address: '77, Anna Salai, Chennai, Tamil Nadu - 600002',
        mobile: '+91 94432 98765',
        gst: '33AAICB3333C1Z3',
      },
    ]);

    console.log('📄 Seeding Particulars (Bills)...');
    const bill1 = await Particular.create({
      customerName: 'Sri Murugan Crackers Agency',
      companyName: 'PBL Crackers',
      caseCount: '4',
      billNo: '1001',
      date: '2026-10-10',
      discount: '500',
      transport: '300',
      packing: '200',
      tax: '0',
      amount: '22800.00',
      total: '22800.00',
      products: [
        {
          particular: '2 3/4" Kuruvi Crackers',
          quantity: '50',
          rate: '45',
          pktUnit: 'Box',
          amount: '2250.00',
        },
        {
          particular: '1000 Wala Garland',
          quantity: '20',
          rate: '450',
          pktUnit: 'Box',
          amount: '9000.00',
        },
        {
          particular: '30 Shots Mega Display',
          quantity: '10',
          rate: '780',
          pktUnit: 'Box',
          amount: '7800.00',
        },
        {
          particular: 'Ground Chakkars Deluxe',
          quantity: '20',
          rate: '190',
          pktUnit: 'Box',
          amount: '3800.00',
        },
      ],
    });

    const bill2 = await Particular.create({
      customerName: 'Venkateswara Fireworks Traders',
      companyName: 'PBL Crackers',
      caseCount: '2',
      billNo: '1002',
      date: '2026-10-11',
      discount: '0',
      transport: '200',
      packing: '100',
      tax: '0',
      amount: '14250.00',
      total: '14250.00',
      products: [
        {
          particular: 'Flower Pots Asoka',
          quantity: '25',
          rate: '220',
          pktUnit: 'Box',
          amount: '5500.00',
        },
        {
          particular: '12 Shots Multicolor',
          quantity: '15',
          rate: '320',
          pktUnit: 'Box',
          amount: '4800.00',
        },
        {
          particular: 'Bomb Rocket',
          quantity: '25',
          rate: '140',
          pktUnit: 'Box',
          amount: '3500.00',
        },
      ],
    });

    console.log('💰 Seeding Account Ledgers...');
    await AccountLedger.insertMany([
      {
        particularId: bill1._id.toString(),
        billNo: '1001',
        customerName: 'Sri Murugan Crackers Agency',
        companyName: 'PBL Crackers',
        date: '2026-10-10',
        debit: '22800.00',
        credit: '0.00',
        balance: '22800.00',
        type: 'BILL',
      },
      {
        customerName: 'Sri Murugan Crackers Agency',
        companyName: 'PBL Crackers',
        date: '2026-10-12',
        debit: '0.00',
        credit: '10000.00',
        balance: '12800.00',
        type: 'CREDIT',
      },
      {
        particularId: bill2._id.toString(),
        billNo: '1002',
        customerName: 'Venkateswara Fireworks Traders',
        companyName: 'PBL Crackers',
        date: '2026-10-11',
        debit: '14250.00',
        credit: '0.00',
        balance: '14250.00',
        type: 'BILL',
      },
    ]);

    console.log('=============================================');
    console.log('✅ PBL Crackers database seeded successfully into MongoDB Atlas!');
    console.log(`   - ${products.length} Products & Price List Items`);
    console.log(`   - ${categoriesData.length} Crackers Categories`);
    console.log(`   - ${companies.length} Companies`);
    console.log(`   - ${customers.length} Customers`);
    console.log(`   - 2 Particulars (Bills)`);
    console.log(`   - 3 Account Ledger Entries`);
    console.log(`   - Default Admin verified (admin / admin123)`);
    console.log('=============================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedSampleData();
