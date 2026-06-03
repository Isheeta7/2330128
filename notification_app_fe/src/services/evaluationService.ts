import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://4.224.186.213/evaluation-service';

interface RegistrationData {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
}

interface AuthData {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientId: string;
  clientSecret: string;
}

interface LogData {
  stack: 'frontend' | 'backend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: string;
  message: string;
}

interface RegistrationResponse {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientId: string;
  clientSecret: string;
}

interface AuthResponse {
  token_type: string;
  access_token: string;
}

class EvaluationService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Registration API Call
  async register(data: RegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await this.apiClient.post<RegistrationResponse>(
        '/register',
        data
      );
      // Save credentials to localStorage
      localStorage.setItem('clientId', response.data.clientId);
      localStorage.setItem('clientSecret', response.data.clientSecret);
      localStorage.setItem('accessCode', response.data.accessCode);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Authentication API Call
  async authenticate(data: AuthData): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth',
        data
      );
      // Save token to localStorage
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('tokenType', response.data.token_type);
      
      // Set default authorization header
      this.apiClient.defaults.headers.common['Authorization'] = 
        `${response.data.token_type} ${response.data.access_token}`;
      
      return response.data;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  // Log API Call
  async sendLog(logData: LogData): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('Skipping log because user is not authenticated yet.');
        return;
      }

      await this.apiClient.post('/logs', logData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Log sending failed:', error);
      // Swallow log errors so they do not break form submission.
      return;
    }
  }

  // Helper method to send logs with different levels
  async logInfo(message: string, packageName: string): Promise<void> {
    await this.sendLog({
      stack: 'frontend',
      level: 'info',
      package: packageName,
      message,
    });
  }

  async logError(message: string, packageName: string): Promise<void> {
    await this.sendLog({
      stack: 'frontend',
      level: 'error',
      package: packageName,
      message,
    });
  }

  async logDebug(message: string, packageName: string): Promise<void> {
    await this.sendLog({
      stack: 'frontend',
      level: 'debug',
      package: packageName,
      message,
    });
  }
}

const evaluationService = new EvaluationService();
export default evaluationService;
