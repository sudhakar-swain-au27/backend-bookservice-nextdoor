import axios from 'axios';

const BASE_URL = 'http://localhost:5050/api/v1';

const tests = [
  {
    name: 'Health Check',
    method: 'get',
    url: `${BASE_URL}/health`
  },
  {
    name: 'Root Endpoint',
    method: 'get',
    url: 'http://localhost:5050/'
  },
  {
    name: 'Get All Services',
    method: 'get',
    url: `${BASE_URL}/services`
  },
  {
    name: 'Search Businesses',
    method: 'get',
    url: `${BASE_URL}/public/search?category=salon`
  },
  {
    name: 'Send OTP',
    method: 'post',
    url: `${BASE_URL}/auth/otp/send`,
    data: { phoneNumber: '+919876543210' }
  },
  {
    name: 'Business Registration',
    method: 'post',
    url: `${BASE_URL}/business/register`,
    data: { businessName: 'Test Salon', email: 'test@salon.com', password: 'password123' }
  },
  {
    name: 'Contact Form',
    method: 'post',
    url: `${BASE_URL}/contact`,
    data: { name: 'John Doe', email: 'john@example.com', message: 'Test message' }
  }
];

async function runTests() {
  console.log('\n============================================');
  console.log('  BOOK SERVICE API ENDPOINT TEST SUITE');
  console.log('============================================\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const config = {
        method: test.method,
        url: test.url,
        validateStatus: () => true
      };
      
      if (test.data) {
        config.data = test.data;
      }
      
      const response = await axios(config);
      console.log(`Status: ${response.status}`);
      console.log(`Success: ${response.data.success !== false ? '✅ YES' : '❌ NO'}`);
      console.log(`---\n`);
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}\n`);
    }
  }

  console.log('============================================');
  console.log('  TEST SUITE COMPLETED');
  console.log('============================================\n');
  process.exit(0);
}

runTests();
