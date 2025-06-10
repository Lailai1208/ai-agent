# Testing Guide

Comprehensive testing strategy and implementation guide for the AI Agent project.

## 🧪 Testing Strategy

### Testing Pyramid
```
                    🔺 E2E Tests
                   /  (Integration)
                  /
               🔺 Integration Tests  
              /   (API + Frontend)
             /
          🔺 Unit Tests
         /   (Components + Functions)
        /
     🔺 Static Analysis
    /   (Types + Linting)
```

### Test Categories
1. **Static Analysis**: TypeScript, ESLint, Python typing
2. **Unit Tests**: Individual functions and components
3. **Integration Tests**: API endpoints and service integration
4. **End-to-End Tests**: Complete user workflows
5. **Performance Tests**: Load testing and benchmarks
6. **Security Tests**: Vulnerability scanning

## 🏗️ Frontend Testing

### 1. Setup & Configuration

#### Testing Dependencies
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@types/jest": "^29.0.0",
    "msw": "^2.0.0"
  }
}
```

#### Jest Configuration
```javascript
// frontend-nextjs/jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### Jest Setup
```javascript
// frontend-nextjs/jest.setup.js
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. Component Testing

#### Testing React Components
```typescript
// frontend-nextjs/src/components/features/Integration/__tests__/BackendTestCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackendTestCard } from '../BackendTestCard';
import { AppProvider } from '@/context/AppContext';

// Mock the hook
jest.mock('@/hooks/useConnectionTest');

const MockedBackendTestCard = () => (
  <AppProvider>
    <BackendTestCard />
  </AppProvider>
);

describe('BackendTestCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render provider selection buttons', () => {
    render(<MockedBackendTestCard />);
    
    expect(screen.getByText('NVIDIA NIM')).toBeInTheDocument();
    expect(screen.getByText('Ollama')).toBeInTheDocument();
  });

  it('should handle NVIDIA provider selection', async () => {
    const user = userEvent.setup();
    render(<MockedBackendTestCard />);
    
    const nvidiaButton = screen.getByText('NVIDIA NIM');
    await user.click(nvidiaButton);
    
    expect(screen.getByDisplayValue('Hello AI!')).toBeInTheDocument();
  });

  it('should display loading state during API call', async () => {
    const mockTestAIModel = jest.fn().mockResolvedValue({
      response: 'Test response',
      model: 'deepseek-r1',
      timestamp: '2025-06-08T11:07:33.717811'
    });
    
    require('@/hooks/useConnectionTest').useConnectionTest.mockReturnValue({
      testAIModel: mockTestAIModel,
      isLoading: true,
      error: null,
      result: null,
    });

    render(<MockedBackendTestCard />);
    
    expect(screen.getByText('測試中...')).toBeInTheDocument();
  });

  it('should display error message on API failure', async () => {
    const mockTestAIModel = jest.fn().mockRejectedValue(
      new Error('Network error')
    );
    
    require('@/hooks/useConnectionTest').useConnectionTest.mockReturnValue({
      testAIModel: mockTestAIModel,
      isLoading: false,
      error: 'Network error',
      result: null,
    });

    render(<MockedBackendTestCard />);
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });
});
```

#### Testing Custom Hooks
```typescript
// frontend-nextjs/src/hooks/__tests__/useConnectionTest.test.ts
import { renderHook, act } from '@testing-library/react';
import { useConnectionTest } from '../useConnectionTest';
import * as BackendService from '@/services/backendService';

jest.mock('@/services/backendService');
const mockedBackendService = BackendService as jest.Mocked<typeof BackendService>;

describe('useConnectionTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful AI model test', async () => {
    const mockResponse = {
      response: 'Hello! How can I help you?',
      model: 'deepseek-r1',
      timestamp: '2025-06-08T11:07:33.717811'
    };

    mockedBackendService.testAIModel.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useConnectionTest());

    await act(async () => {
      await result.current.testAIModel('nvidia', 'Hello AI!');
    });

    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API error', async () => {
    const mockError = new Error('API Error');
    mockedBackendService.testAIModel.mockRejectedValue(mockError);

    const { result } = renderHook(() => useConnectionTest());

    await act(async () => {
      await result.current.testAIModel('nvidia', 'Hello AI!');
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('API Error');
    expect(result.current.isLoading).toBe(false);
  });
});
```

### 3. API Mocking with MSW

#### Setup Mock Server
```typescript
// frontend-nextjs/src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

#### Mock Handlers
```typescript
// frontend-nextjs/src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock successful NVIDIA chat
  http.post('http://localhost:8000/api/v1/ai/chat/nvidia', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      response: `Mock response to: ${body.message}`,
      model: 'deepseek-r1',
      timestamp: new Date().toISOString(),
    });
  }),

  // Mock Ollama chat
  http.post('http://localhost:8000/api/v1/ai/chat/ollama', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      response: `Ollama mock response to: ${body.message}`,
      model: 'qwen2:7b',
      timestamp: new Date().toISOString(),
    });
  }),

  // Mock health check
  http.get('http://localhost:8000/api/v1/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }),

  // Mock error scenarios
  http.post('http://localhost:8000/api/v1/ai/chat/error', () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }),
];
```

### 4. Frontend Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## 🔧 Backend Testing

### 1. Setup & Configuration

#### Testing Dependencies
```txt
# backend/requirements-test.txt
pytest>=7.0.0
pytest-asyncio>=0.21.0
httpx>=0.24.0
pytest-mock>=3.10.0
pytest-cov>=4.0.0
faker>=18.0.0
```

#### Pytest Configuration
```ini
# backend/pytest.ini
[tool:pytest]
testpaths = tests
asyncio_mode = auto
python_files = test_*.py
python_functions = test_*
python_classes = Test*
addopts = 
    --strict-markers
    --strict-config
    --cov=app
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
```

### 2. API Testing

#### Test API Endpoints
```python
# backend/tests/test_ai_models.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from main import app

client = TestClient(app)

class TestAIModelsEndpoints:
    """Test AI model endpoints"""

    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data

    @patch('app.core.ai_models.call_nvidia_nim')
    def test_nvidia_chat_success(self, mock_nvidia):
        """Test successful NVIDIA chat request"""
        # Mock the NVIDIA API response
        mock_nvidia.return_value = {
            "choices": [{
                "message": {"content": "Hello! How can I help you?"}
            }]
        }

        request_data = {
            "message": "Hello AI",
            "model": "deepseek-ai/deepseek-r1",
            "temperature": 0.7,
            "max_tokens": 1000
        }

        response = client.post("/api/v1/ai/chat/nvidia", json=request_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "model" in data
        assert "timestamp" in data

    def test_nvidia_chat_missing_api_key(self):
        """Test NVIDIA chat without API key"""
        with patch.dict('os.environ', {}, clear=True):
            request_data = {
                "message": "Hello AI",
                "model": "deepseek-ai/deepseek-r1"
            }
            
            response = client.post("/api/v1/ai/chat/nvidia", json=request_data)
            assert response.status_code == 400
            assert "API key not configured" in response.json()["detail"]

    def test_invalid_request_format(self):
        """Test invalid request format"""
        response = client.post("/api/v1/ai/chat/nvidia", json={})
        assert response.status_code == 422

    @pytest.mark.parametrize("message,expected_status", [
        ("", 422),  # Empty message
        ("x" * 10001, 422),  # Too long message
        ("Valid message", 200),  # Valid message
    ])
    @patch('app.core.ai_models.call_nvidia_nim')
    def test_message_validation(self, mock_nvidia, message, expected_status):
        """Test message validation"""
        if expected_status == 200:
            mock_nvidia.return_value = {
                "choices": [{"message": {"content": "Response"}}]
            }

        request_data = {
            "message": message,
            "model": "deepseek-ai/deepseek-r1"
        }

        response = client.post("/api/v1/ai/chat/nvidia", json=request_data)
        assert response.status_code == expected_status

class TestOllamaEndpoints:
    """Test Ollama endpoints"""

    @patch('app.core.ai_models.call_ollama')
    def test_ollama_chat_success(self, mock_ollama):
        """Test successful Ollama chat request"""
        mock_ollama.return_value = {
            "response": "Hello! How can I help you?"
        }

        request_data = {
            "message": "Hello AI",
            "temperature": 0.7
        }

        response = client.post("/api/v1/ai/chat/ollama", json=request_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "model" in data

    @patch('httpx.AsyncClient.post')
    def test_ollama_connection_error(self, mock_post):
        """Test Ollama connection error"""
        mock_post.side_effect = Exception("Connection failed")

        request_data = {"message": "Hello AI"}
        
        response = client.post("/api/v1/ai/chat/ollama", json=request_data)
        assert response.status_code == 500
```

### 3. Unit Testing

#### Test Core Functions
```python
# backend/tests/test_core.py
import pytest
from unittest.mock import patch, AsyncMock
from app.core.ai_models import call_nvidia_nim, call_ollama
from app.core.config import Settings

class TestAIModelCore:
    """Test core AI model functions"""

    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.post')
    async def test_call_nvidia_nim_success(self, mock_post):
        """Test successful NVIDIA NIM API call"""
        mock_response = AsyncMock()
        mock_response.json.return_value = {
            "choices": [{
                "message": {"content": "Test response"}
            }]
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        result = await call_nvidia_nim("Hello", "deepseek-ai/deepseek-r1")
        
        assert result["choices"][0]["message"]["content"] == "Test response"
        mock_post.assert_called_once()

    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.post')
    async def test_call_ollama_success(self, mock_post):
        """Test successful Ollama API call"""
        mock_response = AsyncMock()
        mock_response.json.return_value = {
            "response": "Ollama test response"
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        result = await call_ollama("Hello")
        
        assert result["response"] == "Ollama test response"

class TestConfiguration:
    """Test configuration management"""

    def test_settings_initialization(self):
        """Test settings initialization"""
        settings = Settings()
        assert hasattr(settings, 'nim_deepseek_r1_api')
        assert hasattr(settings, 'ollama_api_base')

    @patch.dict('os.environ', {'NIM_DEEPSEEK_R1_API': 'test-key'})
    def test_api_key_loading(self):
        """Test API key loading from environment"""
        settings = Settings()
        assert settings.nim_deepseek_r1_api == 'test-key'
```

### 4. Integration Testing

#### Test Full Workflows
```python
# backend/tests/test_integration.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

client = TestClient(app)

class TestFullWorkflow:
    """Test complete AI model workflows"""

    @pytest.mark.integration
    @patch('app.core.ai_models.call_nvidia_nim')
    def test_nvidia_full_workflow(self, mock_nvidia):
        """Test complete NVIDIA workflow"""
        # Setup mock
        mock_nvidia.return_value = {
            "choices": [{
                "message": {"content": "Integration test response"}
            }]
        }

        # Test health check
        health_response = client.get("/api/v1/health")
        assert health_response.status_code == 200

        # Test AI status
        status_response = client.get("/api/v1/ai/status")
        assert status_response.status_code == 200

        # Test chat endpoint
        chat_request = {
            "message": "Integration test",
            "model": "deepseek-ai/deepseek-r1",
            "temperature": 0.7,
            "max_tokens": 1000
        }

        chat_response = client.post("/api/v1/ai/chat/nvidia", json=chat_request)
        assert chat_response.status_code == 200
        
        data = chat_response.json()
        assert "response" in data
        assert "timestamp" in data

    @pytest.mark.slow
    def test_rate_limiting(self):
        """Test rate limiting functionality"""
        # Make multiple rapid requests
        responses = []
        for i in range(15):  # Exceed rate limit
            response = client.get("/api/v1/health")
            responses.append(response.status_code)

        # Should have some rate limited responses
        assert any(status == 429 for status in responses[-5:])
```

### 5. Backend Test Scripts

```bash
#!/bin/bash
# backend/scripts/test.sh

echo "Running backend tests..."

# Run unit tests
echo "🧪 Running unit tests..."
python -m pytest tests/test_core.py -v

# Run integration tests
echo "🔗 Running integration tests..."
python -m pytest tests/test_integration.py -v

# Run API tests
echo "🌐 Running API tests..."
python -m pytest tests/test_ai_models.py -v

# Generate coverage report
echo "📊 Generating coverage report..."
python -m pytest --cov=app --cov-report=html --cov-report=term

echo "✅ All tests completed!"
```

## 🔄 End-to-End Testing

### 1. Playwright Setup

```typescript
// frontend-nextjs/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd ../backend && ./start.sh',
      port: 8000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

### 2. E2E Test Cases

```typescript
// frontend-nextjs/e2e/ai-model-testing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AI Model Testing Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete NVIDIA NIM testing workflow', async ({ page }) => {
    // Navigate to AI testing section
    await page.click('text=AI 模型測試');
    
    // Select NVIDIA provider
    await page.click('text=NVIDIA NIM');
    
    // Enter test message
    await page.fill('input[placeholder="輸入測試訊息"]', 'Hello AI!');
    
    // Start test
    await page.click('text=開始測試');
    
    // Wait for loading state
    await expect(page.locator('text=測試中...')).toBeVisible();
    
    // Wait for result
    await expect(page.locator('text=測試完成')).toBeVisible({ timeout: 30000 });
    
    // Verify response is displayed
    await expect(page.locator('[data-testid="ai-response"]')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/v1/ai/chat/nvidia', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ detail: 'API Error' }),
      });
    });

    await page.click('text=AI 模型測試');
    await page.click('text=NVIDIA NIM');
    await page.fill('input[placeholder="輸入測試訊息"]', 'Test error');
    await page.click('text=開始測試');

    // Verify error is displayed
    await expect(page.locator('text=API Error')).toBeVisible();
  });

  test('should switch between providers', async ({ page }) => {
    await page.click('text=AI 模型測試');
    
    // Test NVIDIA
    await page.click('text=NVIDIA NIM');
    await expect(page.locator('input[value="Hello AI!"]')).toBeVisible();
    
    // Switch to Ollama
    await page.click('text=Ollama');
    await expect(page.locator('input[value="Hello AI!"]')).toBeVisible();
    
    // Verify UI updates
    await expect(page.locator('text=使用本地 Ollama 模型')).toBeVisible();
  });
});
```

## 📊 Performance Testing

### 1. Load Testing with Artillery

```yaml
# tests/load/artillery.yml
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 5
    - duration: 120
      arrivalRate: 10
    - duration: 60
      arrivalRate: 5

scenarios:
  - name: "Health Check Load"
    weight: 60
    flow:
      - get:
          url: "/api/v1/health"
  
  - name: "AI Status Check"
    weight: 30
    flow:
      - get:
          url: "/api/v1/ai/status"
  
  - name: "AI Chat Simulation"
    weight: 10
    flow:
      - post:
          url: "/api/v1/ai/chat/nvidia"
          json:
            message: "Performance test message"
            model: "deepseek-ai/deepseek-r1"
            temperature: 0.7
            max_tokens: 100
```

### 2. Performance Test Scripts

```bash
#!/bin/bash
# scripts/performance-test.sh

echo "🚀 Starting performance tests..."

# Install artillery if not present
if ! command -v artillery &> /dev/null; then
    npm install -g artillery
fi

# Start services
echo "📡 Starting services..."
./dev-start.sh &
sleep 10

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
until curl -f http://localhost:8000/api/v1/health; do
    sleep 2
done

until curl -f http://localhost:3000; do
    sleep 2
done

# Run load tests
echo "🔥 Running load tests..."
artillery run tests/load/artillery.yml

echo "✅ Performance tests completed!"
```

## 🔐 Security Testing

### 1. Security Test Cases

```python
# backend/tests/test_security.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestSecurityMeasures:
    """Test security implementations"""

    def test_sql_injection_protection(self):
        """Test SQL injection prevention"""
        malicious_input = "'; DROP TABLE users; --"
        
        response = client.post("/api/v1/ai/chat/nvidia", json={
            "message": malicious_input,
            "model": "deepseek-ai/deepseek-r1"
        })
        
        # Should handle gracefully, not crash
        assert response.status_code in [200, 400, 422, 500]

    def test_xss_protection(self):
        """Test XSS prevention"""
        xss_payload = "<script>alert('xss')</script>"
        
        response = client.post("/api/v1/ai/chat/nvidia", json={
            "message": xss_payload,
            "model": "deepseek-ai/deepseek-r1"
        })
        
        # Should sanitize or reject
        if response.status_code == 200:
            data = response.json()
            assert "<script>" not in data.get("response", "")

    def test_rate_limiting(self):
        """Test rate limiting enforcement"""
        # Make rapid requests
        responses = []
        for i in range(20):
            response = client.get("/api/v1/health")
            responses.append(response.status_code)
        
        # Should eventually get rate limited
        rate_limited = any(status == 429 for status in responses)
        assert rate_limited or len([r for r in responses if r == 200]) < 20

    def test_cors_headers(self):
        """Test CORS configuration"""
        response = client.options("/api/v1/health")
        headers = response.headers
        
        assert "access-control-allow-origin" in headers
        assert "access-control-allow-methods" in headers
```

## 🤖 Automated Testing

### 1. GitHub Actions CI/CD

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: frontend-nextjs/package-lock.json
    
    - name: Install dependencies
      working-directory: ./frontend-nextjs
      run: npm ci
    
    - name: Run type check
      working-directory: ./frontend-nextjs
      run: npm run type-check
    
    - name: Run linting
      working-directory: ./frontend-nextjs
      run: npm run lint
    
    - name: Run tests
      working-directory: ./frontend-nextjs
      run: npm run test:ci
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./frontend-nextjs/coverage/lcov.info

  backend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      working-directory: ./backend
      run: |
        pip install -r requirements.txt
        pip install -r requirements-test.txt
    
    - name: Run tests
      working-directory: ./backend
      run: |
        python -m pytest --cov=app --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./backend/coverage.xml

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [frontend-tests, backend-tests]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: |
        cd frontend-nextjs && npm ci
        cd ../backend && pip install -r requirements.txt
    
    - name: Install Playwright
      working-directory: ./frontend-nextjs
      run: npx playwright install
    
    - name: Run E2E tests
      working-directory: ./frontend-nextjs
      run: npx playwright test
    
    - uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: frontend-nextjs/playwright-report/
```

### 2. Test Reporting

```typescript
// frontend-nextjs/jest.config.js - Additional reporters
module.exports = {
  // ... other config
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'jest-results.xml',
    }],
    ['jest-html-reporters', {
      publicPath: 'test-results',
      filename: 'test-report.html',
    }],
  ],
};
```

---

**Testing is crucial for maintaining code quality and reliability. Make sure to write tests for new features and update existing tests when making changes.**
