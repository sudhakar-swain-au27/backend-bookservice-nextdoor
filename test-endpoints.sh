#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5050/api/v1"

# Optional env helpers:
# Set USER_TOKEN to an authenticated user's token to run protected booking tests.
# Set BUSINESS_ID and SERVICE_ID if you already have seeded data; otherwise skip booking steps.


echo "=============================================="
echo "  BOOK SERVICE API ENDPOINT TEST SUITE"
echo "=============================================="
echo ""

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check${NC}"
curl -s "$BASE_URL/health" | jq . && echo -e "${GREEN}✅ PASS${NC}\n" || echo -e "${RED}❌ FAIL${NC}\n"

# Test 2: Root Endpoint
echo -e "${YELLOW}2. Testing Root Endpoint${NC}"
curl -s "http://localhost:5050/" && echo -e "\n${GREEN}✅ PASS${NC}\n" || echo -e "${RED}❌ FAIL${NC}\n"

# Test 3: Send OTP
echo -e "${YELLOW}3. Testing Send OTP${NC}"
OTP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/otp/send" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+919876543210"}')
echo "$OTP_RESPONSE" | jq . && echo -e "${GREEN}✅ PASS${NC}\n" || echo -e "${RED}❌ FAIL${NC}\n"

# Test 4: Get All Services
echo -e "${YELLOW}4. Testing Get All Services (Public)${NC}"
curl -s "$BASE_URL/services" | jq . && echo -e "${GREEN}✅ PASS${NC}\n" || echo -e "${RED}❌ FAIL${NC}\n"

# Test 5: Get All Businesses (Search)
echo -e "${YELLOW}5. Testing Search Businesses${NC}"
curl -s "$BASE_URL/public/search?category=salon" | jq . && echo -e "${GREEN}✅ PASS${NC}\n" || echo -e "${RED}❌ FAIL${NC}\n"

# Test 6: Business Registration
echo -e "${YELLOW}6. Testing Business Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/business/register" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName":"Test Salon",
    "email":"test@salon.com",
    "password":"password123"
  }')
echo "$REGISTER_RESPONSE" | jq .
if echo "$REGISTER_RESPONSE" | jq -e '.token' > /dev/null; then
  echo -e "${GREEN}✅ PASS${NC}\n"
  BUSINESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
  echo "Business Token: $BUSINESS_TOKEN"
else
  echo -e "${RED}❌ FAIL${NC}\n"
fi

# Test 7: Contact Form Submission
echo -e "${YELLOW}7. Testing Contact Form Submission${NC}"
curl -s -X POST "$BASE_URL/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "message":"Test message"
  }' | jq . && echo -e "${GREEN}✅ PASS${NC}\n" || echo -e "${RED}❌ FAIL${NC}\n"

# Test 8: Get Health with detailed info
echo -e "${YELLOW}8. Testing Root Endpoint with Details${NC}"
curl -s "http://localhost:5050/" && echo -e "\n${GREEN}✅ PASS${NC}\n" || echo -e "${RED}❌ FAIL${NC}\n"

echo "=============================================="
echo "  TEST SUITE COMPLETED"
echo "=============================================="

# === Booking flow (optional) ===
if [ -n "$BUSINESS_ID" ] && [ -n "$SERVICE_ID" ] && [ -n "$USER_TOKEN" ]; then
  echo -e "${YELLOW}9. Testing Booking Flow: GET /slots -> POST /bookings${NC}"

  DATE=$(date -v+1d +%Y-%m-%d 2>/dev/null || date -d "tomorrow" +%Y-%m-%d)
  echo "Checking slots for $DATE"
  SLOTS=$(curl -s "$BASE_URL/slots?businessId=$BUSINESS_ID&serviceId=$SERVICE_ID&date=$DATE")
  echo "$SLOTS" | jq .

  FIRST_SLOT=$(echo "$SLOTS" | jq -r '.slots[0].start' 2>/dev/null)
  if [ "$FIRST_SLOT" = "null" ] || [ -z "$FIRST_SLOT" ]; then
    echo -e "${YELLOW}No slots available, skipping booking creation.${NC}"
  else
    echo "Creating booking for slot $FIRST_SLOT"
    BOOK_PAYLOAD=$(jq -n --arg b "$BUSINESS_ID" --arg s "$SERVICE_ID" --arg start "$FIRST_SLOT" '{ businessId: $b, serviceId: $s, category: "other", slot: { start: $start }, payment: { amount: 100, status: "unpaid", mode: "cash" }, location: { address: "Test", city: "TestCity", pincode: "000000" } }')

    CREATE_RESP=$(curl -s -X POST "$BASE_URL/bookings" -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" -d "$BOOK_PAYLOAD")
    echo "$CREATE_RESP" | jq .
    if echo "$CREATE_RESP" | jq -e '.success == true' > /dev/null; then
      echo -e "${GREEN}Booking created successfully${NC}"
    else
      echo -e "${RED}Booking creation failed${NC}"
    fi
  fi
fi
