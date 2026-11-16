#!/bin/bash
# Comprehensive Browser Test Script for Autism Platform

echo "=========================================="
echo "Autism Platform - Comprehensive Testing"
echo "=========================================="
echo ""

BASE_URL="http://localhost:3020"
TEST_RESULTS=()

# Function to test a page
test_page() {
    local url=$1
    local description=$2
    echo "Testing: $description ($url)"
    
    # Use curl to check if page is accessible
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>&1)
    
    if [ "$response" = "200" ] || [ "$response" = "302" ] || [ "$response" = "301" ]; then
        echo "  ✓ Page accessible (Status: $response)"
        TEST_RESULTS+=("✓ $description - OK")
        return 0
    else
        echo "  ✗ Page error (Status: $response)"
        TEST_RESULTS+=("✗ $description - Failed (Status: $response)")
        return 1
    fi
}

echo "1. Testing Public Pages"
echo "---------------------"
test_page "/" "Homepage"
test_page "/pricing" "Pricing Page"
test_page "/contact" "Contact Page"
test_page "/login" "Login Page"
test_page "/register" "Register Page"
test_page "/demo" "Demo Page"
test_page "/privacy" "Privacy Policy"
test_page "/terms" "Terms of Service"

echo ""
echo "2. Testing API Endpoints"
echo "---------------------"
test_page "/api/health" "Health Check API"
test_page "/api/openapi/" "OpenAPI Documentation"

echo ""
echo "3. Testing Dashboard Pages (require auth)"
echo "---------------------"
test_page "/dashboard/" "Dashboard Home"
test_page "/dashboard/patients/" "Patients List"
test_page "/dashboard/goals/" "Goals Page"
test_page "/dashboard/sessions/" "Sessions Page"
test_page "/dashboard/schedules/" "Visual Schedules"
test_page "/dashboard/communication/" "Communication Tools"
test_page "/dashboard/assessments/" "Assessments Page"
test_page "/dashboard/analytics" "Analytics Dashboard"
test_page "/dashboard/reports" "Reports Page"
test_page "/dashboard/settings" "Settings Page"
test_page "/dashboard/users" "Users Page"

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""

# Count results
passed=$(printf '%s\n' "${TEST_RESULTS[@]}" | grep -c "✓" || echo "0")
failed=$(printf '%s\n' "${TEST_RESULTS[@]}" | grep -c "✗" || echo "0")
total=$((${passed} + ${failed}))

echo "Total Pages Tested: $total"
echo "Passed: $passed"
echo "Failed: $failed"
echo ""

if [ $failed -eq 0 ]; then
    echo "✓ All pages are accessible!"
    exit 0
else
    echo "✗ Some pages failed to load"
    exit 1
fi
