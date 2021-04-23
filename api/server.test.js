const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async ()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async ()=>{
  await db('users').truncate()
})
afterAll(async ()=>{
  await db.destroy()
})

const alice = {username: 'Alice', password: 'Wonderland'}
const val = {username: 'Valentino', password: 'Khan'}

test('sanity', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('[POST] /api/auth/register', () => {
  it('responds with 201', async () => {
    let res
    res = await request(server).post('/api/auth/register').send(alice)
    expect(res.status).toBe(201);
  })
})