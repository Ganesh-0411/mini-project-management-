const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany();
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.name).toEqual('Test User');
    });

    it('should not register user with existing email', async () => {
        await User.create({ name: 'Test', email: 'test@test.com', password: 'password123' });
        
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User 2',
                email: 'test@test.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(400);
    });
});
