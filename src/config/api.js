import axios from 'axios';
import envConfig from '@/config/env';

// 创建axios实例
const createApiClient = () => {
  const apiClient = axios.create({
    baseURL: envConfig.getServerUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // 请求拦截器 - 动态更新baseURL
  apiClient.interceptors.request.use(config => {
    config.baseURL = envConfig.getServerUrl();
    return config;
  });
  
  // 响应拦截器 - 统一处理错误
  apiClient.interceptors.response.use(
    response => response.data,
    error => {
      // 处理无网络或服务器未响应情况
      if (!error.response) {
        console.error('网络错误或服务器未响应');
        return Promise.reject(new Error('网络错误或服务器未响应，请检查网络连接'));
      }
      
      // 处理服务器返回的错误
      const errorMessage = error.response.data?.message || error.message || '未知错误';
      console.error('API错误', errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
  );
  
  return apiClient;
};

// API方法
const api = {
  // 测试连接
  async testConnection() {
    try {
      const apiClient = createApiClient();
      await apiClient.get('/health');
      return true;
    } catch (error) {
      console.error('测试连接失败', error.message);
      return false;
    }
  },
  
  // 获取所有社团证
  async getCertificates() {
    const apiClient = createApiClient();
    return apiClient.get('/certificates');
  },
  
  // 获取证书数量
  async getCertificateCount() {
    const apiClient = createApiClient();
    return apiClient.get('/certificates/count');
  },
  
  // 创建社团证
  async createCertificate(certificate) {
    const apiClient = createApiClient();
    return apiClient.post('/certificates', certificate);
  },
  
  // 批量创建社团证
  async batchCreateCertificates(certificates) {
    const apiClient = createApiClient();
    return apiClient.post('/certificates/batch', { certificates });
  },
  
  // 更新社团证
  async updateCertificate(id, certificate) {
    const apiClient = createApiClient();
    return apiClient.put(`/certificates/${id}`, certificate);
  },
  
  // 删除社团证
  async deleteCertificate(id) {
    const apiClient = createApiClient();
    return apiClient.delete(`/certificates/${id}`);
  },
  
  // 删除所有社团证
  async deleteAllCertificates() {
    const apiClient = createApiClient();
    return apiClient.delete('/certificates/all');
  },
  
  // 从备份恢复数据
  async restoreFromBackup(certificates) {
    const apiClient = createApiClient();
    return apiClient.post('/certificates/restore', { certificates });
  }
};

export default api;