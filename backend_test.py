import requests
import sys
import json
from datetime import datetime

class ValueNumberAPITester:
    def __init__(self, base_url="https://smartchoice-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.user_id = None
        self.admin_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 200:
                        print(f"   Response: {response_data}")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Raw response: {response.text[:200]}")

            return success, response.json() if response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success

    def test_passcode_verification(self):
        """Test passcode verification"""
        # Test valid passcode
        success, response = self.run_test(
            "Valid Passcode Verification",
            "POST",
            "verify-passcode",
            200,
            data="VN-2025-GO"
        )
        
        if success and response.get('valid'):
            print("   ✅ Valid passcode accepted")
        else:
            print("   ❌ Valid passcode rejected")
            return False
        
        # Test invalid passcode
        success2, response2 = self.run_test(
            "Invalid Passcode Verification",
            "POST",
            "verify-passcode",
            200,
            data="INVALID-CODE"
        )
        
        if success2 and not response2.get('valid'):
            print("   ✅ Invalid passcode correctly rejected")
            return True
        else:
            print("   ❌ Invalid passcode incorrectly accepted")
            return False

    def test_user_registration(self):
        """Test user registration with different invitation codes"""
        timestamp = datetime.now().strftime('%H%M%S')
        
        # Test regular user registration
        user_email = f"testuser_{timestamp}@example.com"
        success, response = self.run_test(
            "User Registration (VN-2025-GO)",
            "POST",
            "auth/register",
            200,
            data={
                "email": user_email,
                "password": "TestPass123!",
                "invitation_code": "VN-2025-GO"
            }
        )
        
        if success and response.get('access_token'):
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   ✅ User registered with ID: {self.user_id}")
        else:
            print("   ❌ User registration failed")
            return False
        
        # Test admin registration
        admin_email = f"testadmin_{timestamp}@example.com"
        success2, response2 = self.run_test(
            "Admin Registration (VN-ADMIN-2025)",
            "POST",
            "auth/register",
            200,
            data={
                "email": admin_email,
                "password": "AdminPass123!",
                "invitation_code": "VN-ADMIN-2025"
            }
        )
        
        if success2 and response2.get('access_token'):
            self.admin_token = response2['access_token']
            self.admin_id = response2['user']['id']
            print(f"   ✅ Admin registered with ID: {self.admin_id}")
            return True
        else:
            print("   ❌ Admin registration failed")
            return False

    def test_user_login(self):
        """Test user login"""
        if not self.user_id:
            print("❌ Cannot test login - no user registered")
            return False
            
        timestamp = datetime.now().strftime('%H%M%S')
        user_email = f"testuser_{timestamp}@example.com"
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": user_email,
                "password": "TestPass123!"
            }
        )
        
        if success and response.get('access_token'):
            print("   ✅ Login successful")
            return True
        else:
            print("   ❌ Login failed")
            return False

    def test_user_profile(self):
        """Test getting user profile"""
        if not self.token:
            print("❌ Cannot test profile - no token available")
            return False
            
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "auth/me",
            200,
            headers={'Authorization': f'Bearer {self.token}'}
        )
        
        if success and response.get('id'):
            print(f"   ✅ Profile retrieved for user: {response.get('email')}")
            return True
        else:
            print("   ❌ Profile retrieval failed")
            return False

    def test_s_formula_calculation(self):
        """Test S Formula calculation"""
        calculation_data = {
            "old_time": {"hours": 2, "minutes": 30},
            "old_effort": 8.0,
            "training_time": {"hours": 1, "minutes": 0},
            "new_effort": 5.0
        }
        
        # Test without authentication (guest)
        success, response = self.run_test(
            "S Formula Calculation (Guest)",
            "POST",
            "calculate/s-formula",
            200,
            data=calculation_data
        )
        
        if success and response.get('value_number') is not None:
            print(f"   ✅ S Formula calculated: VN = {response['value_number']}")
            print(f"   Recommendation: {response.get('recommendation')}")
            return True
        else:
            print("   ❌ S Formula calculation failed")
            return False

    def test_w_formula_calculation(self):
        """Test W Formula calculation"""
        calculation_data = {
            "old_time": {"hours": 3, "minutes": 0},
            "old_effort": 7.0,
            "training_time": {"hours": 2, "minutes": 0},
            "new_effort": 4.0,
            "old_cost": 100.0,
            "new_cost": 50.0
        }
        
        # Test with authentication
        headers = {}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
            
        success, response = self.run_test(
            "W Formula Calculation (Authenticated)",
            "POST",
            "calculate/w-formula",
            200,
            data=calculation_data,
            headers=headers
        )
        
        if success and response.get('value_number') is not None:
            print(f"   ✅ W Formula calculated: VN = {response['value_number']}")
            print(f"   Recommendation: {response.get('recommendation')}")
            return True
        else:
            print("   ❌ W Formula calculation failed")
            return False

    def test_calculation_history(self):
        """Test getting calculation history"""
        if not self.token:
            print("❌ Cannot test history - no token available")
            return False
            
        success, response = self.run_test(
            "Get Calculation History",
            "GET",
            "calculations/history",
            200,
            headers={'Authorization': f'Bearer {self.token}'}
        )
        
        if success:
            history_count = len(response) if isinstance(response, list) else 0
            print(f"   ✅ History retrieved: {history_count} calculations")
            return True
        else:
            print("   ❌ History retrieval failed")
            return False

    def test_admin_analytics(self):
        """Test admin analytics endpoint"""
        if not self.admin_token:
            print("❌ Cannot test analytics - no admin token available")
            return False
            
        success, response = self.run_test(
            "Admin Analytics",
            "GET",
            "admin/analytics",
            200,
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        
        if success and 'totalUsers' in response:
            print(f"   ✅ Analytics retrieved: {response.get('totalUsers')} users, {response.get('totalCalculations')} calculations")
            return True
        else:
            print("   ❌ Analytics retrieval failed")
            return False

    def test_admin_users(self):
        """Test admin users management"""
        if not self.admin_token:
            print("❌ Cannot test user management - no admin token available")
            return False
            
        success, response = self.run_test(
            "Admin Get All Users",
            "GET",
            "admin/users",
            200,
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        
        if success and isinstance(response, list):
            print(f"   ✅ Users list retrieved: {len(response)} users")
            return True
        else:
            print("   ❌ Users list retrieval failed")
            return False

    def test_invitation_request(self):
        """Test invitation request submission"""
        request_data = {
            "name": "Test User",
            "email": "test@example.com",
            "organization": "Test Org",
            "reason": "Testing the invitation system"
        }
        
        success, response = self.run_test(
            "Submit Invitation Request",
            "POST",
            "request-invitation",
            200,
            data=request_data
        )
        
        if success and 'message' in response:
            print("   ✅ Invitation request submitted")
            return True
        else:
            print("   ❌ Invitation request failed")
            return False

def main():
    print("🚀 Starting Value Number™ API Testing")
    print("=" * 50)
    
    tester = ValueNumberAPITester()
    
    # Test sequence
    tests = [
        ("API Root", tester.test_root_endpoint),
        ("Passcode Verification", tester.test_passcode_verification),
        ("User Registration", tester.test_user_registration),
        ("User Login", tester.test_user_login),
        ("User Profile", tester.test_user_profile),
        ("S Formula Calculation", tester.test_s_formula_calculation),
        ("W Formula Calculation", tester.test_w_formula_calculation),
        ("Calculation History", tester.test_calculation_history),
        ("Admin Analytics", tester.test_admin_analytics),
        ("Admin Users", tester.test_admin_users),
        ("Invitation Request", tester.test_invitation_request),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if failed_tests:
        print(f"\n❌ Failed tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   • {test}")
    else:
        print("\n✅ All tests passed!")
    
    print(f"\nSuccess rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())