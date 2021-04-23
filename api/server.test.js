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
    let res;
    res = await request(server).post('/api/auth/register').send(alice);
    expect(res.status).toBe(201);
  });

  it('responds with correct name on register', async () => {
    const res = await request(server).post('/api/auth/register').send(alice);
    expect(res.body.username).toBe(alice.username);
  });

  it('responds with an incorrect password match due to hash', async () => {
    const res = await request(server).post('/api/auth/register').send(val);
    expect(res.body.password).not.toBe(val.password);
  });
});

describe('[POST] /api/auth/login', () => {
  it('gives invalid credential message on bad credentials', async () => {
    const logged = await request(server).post('/api/auth/login').send(alice);
    expect(logged.body.message).toBe("invalid credentials");
  });

  it('brings back a welcome message', async () => {
    await request(server).post('/api/auth/register').send(alice);
    const logged = await request(server).post('/api/auth/login').send(alice);
    expect(logged.body.message).toBe("welcome, Alice");
  });
});