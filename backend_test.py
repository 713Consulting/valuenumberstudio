import requests
import sys
from datetime import datetime
import json

class SimpleAPITester:
    def __init__(self, base_url="https://value-calc-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.headers.get('content-type', '').startswith('application/json') else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        return success

    def test_create_status_check(self):
        """Create a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data=test_data
        )
        return response.get('id') if success else None

    def test_get_status_checks(self):
        """Get all status checks"""
        success, response = self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        return success

    def test_concepts_access_notification(self):
        """Test concepts access notification endpoint with review request payload"""
        test_data = {
            "fullname": "Test Two",
            "email": "test2@example.com",
            "zip": "77019"
        }
        success, response = self.run_test(
            "Concepts Access Notification (Review Request)",
            "POST",
            "api/notify/concepts-access",
            200,
            data=test_data
        )
        
        if success:
            # Verify required fields in response
            required_fields = ['ok', 'email_sent', 'record_id']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                self.failed_tests.append({
                    'name': 'Concepts Access Notification - Response Fields',
                    'error': f'Missing fields: {missing_fields}'
                })
                return False
            
            if response.get('ok') is not True:
                print(f"❌ Expected ok=true, got ok={response.get('ok')}")
                self.failed_tests.append({
                    'name': 'Concepts Access Notification - OK Field',
                    'error': f'Expected ok=true, got ok={response.get("ok")}'
                })
                return False
            
            # Check if email was sent successfully after SMTP password update
            email_sent = response.get('email_sent')
            print(f"✅ All required fields present: ok={response.get('ok')}, email_sent={email_sent}, record_id={response.get('record_id')}")
            
            if email_sent is True:
                print(f"✅ SMTP Configuration Working: Gmail accepted the app password and email was sent successfully")
            else:
                print(f"⚠️  Email not sent: email_sent={email_sent}, error={response.get('error')}")
                
        return success, response

    def test_download_headers_only(self, endpoint, test_name):
        """Test download endpoint headers without downloading full content"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {test_name}...")
        print(f"   URL: {url}")
        
        try:
            # Use GET request with stream=True to avoid downloading full content
            response = requests.get(url, headers=headers, timeout=30, stream=True)
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Check content-type
                content_type = response.headers.get('content-type', '')
                content_length = response.headers.get('content-length', '0')
                
                print(f"   Content-Type: {content_type}")
                print(f"   Content-Length: {content_length}")
                
                if 'application/zip' not in content_type:
                    print(f"❌ Expected content-type to contain 'application/zip', got '{content_type}'")
                    self.failed_tests.append({
                        'name': f'{test_name} - Content Type',
                        'error': f'Expected application/zip, got {content_type}'
                    })
                    return False
                
                if int(content_length) < 1000:  # Non-trivial content length
                    print(f"❌ Content length too small: {content_length} bytes")
                    self.failed_tests.append({
                        'name': f'{test_name} - Content Length',
                        'error': f'Content length too small: {content_length} bytes'
                    })
                    return False
                    
                print(f"✅ Valid ZIP headers confirmed")
                
                # Close the response to avoid downloading the full content
                response.close()
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': test_name,
                    'expected': 200,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': test_name,
                'error': str(e)
            })
            return False

    def test_all_in_one_download(self):
        """Test all-in-one download endpoint headers"""
        return self.test_download_headers_only("api/download/all-in-one", "All-in-One Download")

    def test_source_download(self):
        """Test source download endpoint headers"""
        return self.test_download_headers_only("api/download/source", "Source Download")

    def test_build_download(self):
        """Test build download endpoint headers"""
        return self.test_download_headers_only("api/download/build", "Build Download")

    def test_value_number_passcode_verification(self):
        """Test Value Number™ passcode verification endpoint"""
        # Test with correct passcode - using query parameter format
        success, response = self.run_test(
            "Value Number™ Passcode Verification (Correct)",
            "POST",
            "api/verify-passcode?passcode=VN-2025-GO",
            200
        )
        
        if success and response.get('valid') is not True:
            print(f"❌ Expected valid=true for correct passcode, got valid={response.get('valid')}")
            self.failed_tests.append({
                'name': 'Passcode Verification - Valid Response',
                'error': f'Expected valid=true, got valid={response.get("valid")}'
            })
            return False
            
        # Test with incorrect passcode
        success_wrong, response_wrong = self.run_test(
            "Value Number™ Passcode Verification (Incorrect)",
            "POST",
            "api/verify-passcode?passcode=WRONG-CODE",
            200
        )
        
        if success_wrong and response_wrong.get('valid') is not False:
            print(f"❌ Expected valid=false for incorrect passcode, got valid={response_wrong.get('valid')}")
            self.failed_tests.append({
                'name': 'Passcode Verification - Invalid Response',
                'error': f'Expected valid=false, got valid={response_wrong.get("valid")}'
            })
            return False
            
        return success and success_wrong

    def test_user_registration(self):
        """Test Value Number™ user registration endpoint"""
        import time
        timestamp = str(int(time.time()))
        test_data = {
            "email": f"testuser{timestamp}@example.com",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "Value Number™ User Registration",
            "POST",
            "api/register",
            200,
            data=test_data
        )
        
        if success:
            # Verify required fields in response
            required_fields = ['id', 'email', 'created_at', 'is_active']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                self.failed_tests.append({
                    'name': 'User Registration - Response Fields',
                    'error': f'Missing fields: {missing_fields}'
                })
                return False, None
                
            if response.get('email') != test_data['email']:
                print(f"❌ Email mismatch: expected {test_data['email']}, got {response.get('email')}")
                self.failed_tests.append({
                    'name': 'User Registration - Email Match',
                    'error': f'Email mismatch'
                })
                return False, None
                
        return success, test_data if success else None

    def test_user_login(self, user_credentials=None):
        """Test Value Number™ user login endpoint"""
        if not user_credentials:
            # Create a test user first
            success, user_credentials = self.test_user_registration()
            if not success:
                print("❌ Cannot test login - user registration failed")
                return False, None
        
        success, response = self.run_test(
            "Value Number™ User Login",
            "POST",
            "api/login",
            200,
            data=user_credentials
        )
        
        if success:
            # Verify required fields in response
            required_fields = ['access_token', 'token_type', 'user']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                self.failed_tests.append({
                    'name': 'User Login - Response Fields',
                    'error': f'Missing fields: {missing_fields}'
                })
                return False, None
                
            if response.get('token_type') != 'bearer':
                print(f"❌ Expected token_type=bearer, got {response.get('token_type')}")
                self.failed_tests.append({
                    'name': 'User Login - Token Type',
                    'error': f'Expected bearer token type'
                })
                return False, None
                
            access_token = response.get('access_token')
            if not access_token:
                print(f"❌ No access token received")
                self.failed_tests.append({
                    'name': 'User Login - Access Token',
                    'error': 'No access token in response'
                })
                return False, None
                
        return success, response.get('access_token') if success else None

    def test_s_formula_calculation(self, access_token=None):
        """Test Value Number™ S-formula calculation endpoint"""
        test_data = {
            "old_time": {"hours": 2, "minutes": 30},
            "old_effort": 7.0,
            "training_time": {"hours": 1, "minutes": 0},
            "new_effort": 4.0
        }
        
        headers = {'Content-Type': 'application/json'}
        if access_token:
            headers['Authorization'] = f'Bearer {access_token}'
        
        url = f"{self.base_url}/api/calculate/s-formula"
        self.tests_run += 1
        print(f"\n🔍 Testing Value Number™ S-Formula Calculation...")
        print(f"   URL: {url}")
        
        try:
            response = requests.post(url, json=test_data, headers=headers, timeout=10)
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)}")
                
                # Verify required fields
                required_fields = ['value_number', 'calculation_type', 'recommendation', 'explanation', 'timestamp']
                missing_fields = [field for field in required_fields if field not in response_data]
                
                if missing_fields:
                    print(f"❌ Missing required fields: {missing_fields}")
                    self.failed_tests.append({
                        'name': 'S-Formula Calculation - Response Fields',
                        'error': f'Missing fields: {missing_fields}'
                    })
                    return False
                
                if response_data.get('calculation_type') != 's_formula':
                    print(f"❌ Expected calculation_type=s_formula, got {response_data.get('calculation_type')}")
                    self.failed_tests.append({
                        'name': 'S-Formula Calculation - Type',
                        'error': f'Wrong calculation type'
                    })
                    return False
                
                # Check for AI insights
                explanation = response_data.get('explanation', '')
                if '🤖 AI Insights:' not in explanation:
                    print(f"❌ AI insights not found in explanation")
                    self.failed_tests.append({
                        'name': 'S-Formula Calculation - AI Insights',
                        'error': 'AI insights prefix not found in explanation'
                    })
                    return False
                else:
                    print(f"✅ AI insights integration confirmed")
                
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': 'S-Formula Calculation',
                    'expected': 200,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': 'S-Formula Calculation',
                'error': str(e)
            })
            return False

    def test_w_formula_calculation(self, access_token=None):
        """Test Value Number™ W-formula calculation endpoint"""
        test_data = {
            "old_time": {"hours": 2, "minutes": 30},
            "old_effort": 7.0,
            "training_time": {"hours": 1, "minutes": 0},
            "new_effort": 4.0,
            "old_cost": 1000.0,
            "new_cost": 300.0
        }
        
        headers = {'Content-Type': 'application/json'}
        if access_token:
            headers['Authorization'] = f'Bearer {access_token}'
        
        url = f"{self.base_url}/api/calculate/w-formula"
        self.tests_run += 1
        print(f"\n🔍 Testing Value Number™ W-Formula Calculation...")
        print(f"   URL: {url}")
        
        try:
            response = requests.post(url, json=test_data, headers=headers, timeout=10)
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)}")
                
                # Verify required fields
                required_fields = ['value_number', 'calculation_type', 'recommendation', 'explanation', 'timestamp']
                missing_fields = [field for field in required_fields if field not in response_data]
                
                if missing_fields:
                    print(f"❌ Missing required fields: {missing_fields}")
                    self.failed_tests.append({
                        'name': 'W-Formula Calculation - Response Fields',
                        'error': f'Missing fields: {missing_fields}'
                    })
                    return False
                
                if response_data.get('calculation_type') != 'w_formula':
                    print(f"❌ Expected calculation_type=w_formula, got {response_data.get('calculation_type')}")
                    self.failed_tests.append({
                        'name': 'W-Formula Calculation - Type',
                        'error': f'Wrong calculation type'
                    })
                    return False
                
                # Check for AI insights
                explanation = response_data.get('explanation', '')
                if '🤖 AI Insights:' not in explanation:
                    print(f"❌ AI insights not found in explanation")
                    self.failed_tests.append({
                        'name': 'W-Formula Calculation - AI Insights',
                        'error': 'AI insights prefix not found in explanation'
                    })
                    return False
                else:
                    print(f"✅ AI insights integration confirmed")
                
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': 'W-Formula Calculation',
                    'expected': 200,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': 'W-Formula Calculation',
                'error': str(e)
            })
            return False

def main():
    print("🚀 Starting Value Number™ Backend API Tests")
    print("=" * 50)
    
    # Setup
    tester = SimpleAPITester()

    # Run tests
    print("\n📋 Testing Core Backend API Endpoints...")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test status check creation
    status_id = tester.test_create_status_check()
    
    # Test getting status checks
    tester.test_get_status_checks()
    
    # Test specific endpoints from review request
    print("\n📋 Testing Review Request Endpoints...")
    
    # 1. Test concepts access notification with specific payload
    success, response = tester.test_concepts_access_notification()
    
    # Print the full response body as requested
    if success:
        print(f"\n📋 Full Response Body for Concepts Access:")
        print(json.dumps(response, indent=2))
    
    # 2. Test all-in-one download
    tester.test_all_in_one_download()
    
    # 3. Test regression - source and build downloads
    tester.test_source_download()
    tester.test_build_download()

    # Value Number™ Specific Tests
    print("\n📋 Testing Value Number™ Endpoints...")
    
    # 1. Test passcode verification
    tester.test_value_number_passcode_verification()
    
    # 2. Test user registration and login flow
    success, user_credentials = tester.test_user_registration()
    access_token = None
    if success:
        success_login, access_token = tester.test_user_login(user_credentials)
    
    # 3. Test S-formula calculation (with and without authentication)
    tester.test_s_formula_calculation()  # Without auth
    if access_token:
        tester.test_s_formula_calculation(access_token)  # With auth
    
    # 4. Test W-formula calculation (with and without authentication)  
    tester.test_w_formula_calculation()  # Without auth
    if access_token:
        tester.test_w_formula_calculation(access_token)  # With auth

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Backend Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for test in tester.failed_tests:
            if 'error' in test:
                print(f"   - {test['name']}: {test['error']}")
            else:
                print(f"   - {test['name']}: Expected {test.get('expected')}, got {test.get('actual')}")
    else:
        print("\n✅ All tests passed!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())