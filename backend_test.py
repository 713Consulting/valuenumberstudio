import requests
import sys
from datetime import datetime
import json

class SimpleAPITester:
    def __init__(self, base_url="https://sci-powered-site.preview.emergentagent.com"):
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
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

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
            response = requests.get(url, headers=headers, timeout=10, stream=True)
            
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

def main():
    print("🚀 Starting 713 Consulting Backend API Tests")
    print("=" * 50)
    
    # Setup
    tester = SimpleAPITester()

    # Run tests
    print("\n📋 Testing Backend API Endpoints...")
    
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
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())