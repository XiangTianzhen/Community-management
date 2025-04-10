<template>
    <div class="server-config-page">
      <div class="server-container">
        <h2>服务器配置</h2>
        
        <!-- 环境选择 -->
        <div class="server-section">
          <h3>环境选择</h3>
          <div class="env-selector">
            <div 
              v-for="(url, env) in envConfig.SERVER_CONFIGS" 
              :key="env"
              class="env-option"
              :class="{ active: currentEnv === env }"
              @click="switchEnvironment(env)"
            >
              <div class="env-name">{{ getEnvDisplayName(env) }}</div>
              <div class="env-url">{{ url }}</div>
            </div>
          </div>
        </div>
        
        <!-- 自定义服务器 -->
        <div class="server-section">
          <h3>自定义服务器</h3>
          <div class="form-group">
            <label for="custom-server">服务器API地址</label>
            <div class="input-group">
              <input 
                type="text" 
                id="custom-server" 
                v-model="customServerUrl" 
                placeholder="http://example.com/api"
              >
              <button class="btn btn-primary" @click="saveCustomServer">保存</button>
              <button class="btn btn-default" @click="resetToDefault">重置</button>
            </div>
            <p class="form-hint">当前使用的服务器: {{ currentServerUrl }}</p>
          </div>
        </div>
        
        <!-- 连接测试 -->
        <div class="server-section">
          <h3>连接测试</h3>
          <div class="connection-test">
            <button 
              class="btn btn-primary test-btn" 
              @click="testConnection"
              :disabled="isLoading"
            >
              {{ isLoading ? '测试中...' : '测试连接' }}
            </button>
            <div class="connection-status" :class="connectionStatusClass">
              {{ connectionStatus }}
            </div>
          </div>
        </div>
        
        <!-- 数据同步 -->
        <div class="server-section">
          <h3>数据同步</h3>
          <div class="sync-actions">
            <div class="sync-option" @click="uploadToServer">
              <div class="option-icon">⬆️</div>
              <div class="option-title">上传到服务器</div>
              <div class="option-desc">将本地数据上传到服务器</div>
            </div>
            <div class="sync-option" @click="downloadFromServer">
              <div class="option-icon">⬇️</div>
              <div class="option-title">从服务器下载</div>
              <div class="option-desc">从服务器获取最新数据</div>
            </div>
          </div>
        </div>
        
        <div class="page-actions">
          <button class="btn btn-default" @click="goBack">返回</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
  import envConfig from '@/config/env';
  import { mapState } from 'vuex';
  
  export default {
    name: 'ServerConfigPage',
    data() {
      return {
        envConfig,
        customServerUrl: localStorage.getItem('customServerUrl') || '',
        currentEnv: envConfig.getEnvironment(),
        connectionStatus: '未测试',
        connectionStatusClass: '',
        isLoading: false,
        certificates: []
      }
    },
    computed: {
      ...mapState(['certificates']),
      
      currentServerUrl() {
        return envConfig.getServerUrl();
      },
    },
    methods: {
      // 获取环境显示名称
      getEnvDisplayName(env) {
        const displayNames = {
          development: '开发环境',
          test: '测试环境',
          production: '生产环境'
        };
        return displayNames[env] || env;
      },
      
      // 切换环境
      switchEnvironment(env) {
        envConfig.setEnvironment(env);
        this.currentEnv = env;
        // 清除自定义服务器设置
        envConfig.resetToDefaultServer();
        this.customServerUrl = '';
        this.$message.success(`已切换到${this.getEnvDisplayName(env)}`);
      },
      
      // 保存自定义服务器
      saveCustomServer() {
        if (!this.customServerUrl) {
          this.$message.warning('请输入服务器地址');
          return;
        }
        
        // 验证URL格式
        try {
          new URL(this.customServerUrl);
        } catch (e) {
          this.$message.error('服务器地址格式不正确');
          return;
        }
        
        envConfig.setCustomServerUrl(this.customServerUrl);
        this.$message.success('自定义服务器地址已保存');
      },
      
      // 重置为默认服务器
      resetToDefault() {
        envConfig.resetToDefaultServer();
        this.customServerUrl = '';
        this.$message.success(`已重置为${this.getEnvDisplayName(this.currentEnv)}默认地址`);
      },
      
      // 测试连接
      async testConnection() {
        this.isLoading = true;
        this.connectionStatus = '测试中...';
        this.connectionStatusClass = '';
        
        try {
          const isConnected = await api.testConnection();
          
          if (isConnected) {
            this.connectionStatus = '连接成功';
            this.connectionStatusClass = 'status-success';
            this.$message.success('服务器连接测试成功');
          } else {
            this.connectionStatus = '连接失败';
            this.connectionStatusClass = 'status-error';
            this.$message.error('服务器连接测试失败');
          }
        } catch (error) {
          this.connectionStatus = '连接错误: ' + error.message;
          this.connectionStatusClass = 'status-error';
          this.$message.error('服务器连接测试错误: ' + error.message);
        } finally {
          this.isLoading = false;
        }
      },
      
      // 上传数据到服务器
      async uploadToServer() {
        if (this.connectionStatus !== '连接成功') {
          this.$message.warning('请先测试连接确保服务器可用');
          return;
        }
        
        try {
          this.isLoading = true;
          
          if (!this.certificates || this.certificates.length === 0) {
            this.$message.warning('本地没有数据可上传');
            return;
          }
          
          await api.batchCreateCertificates(this.certificates);
          this.$message.success(`成功上传 ${this.certificates.length} 条数据到服务器`);
        } catch (error) {
          this.$message.error('上传数据失败: ' + error.message);
        } finally {
          this.isLoading = false;
        }
      },
      
      // 从服务器下载数据
      async downloadFromServer() {
        if (this.connectionStatus !== '连接成功') {
          this.$message.warning('请先测试连接确保服务器可用');
          return;
        }
        
        try {
          this.isLoading = true;
          
          // 获取服务器数据数量
          const countResponse = await api.getCertificateCount();
          
          if (!countResponse.count) {
            this.$message.warning('服务器上没有数据可下载');
            return;
          }
          
          // 确认下载
          if (!confirm(`将从服务器下载 ${countResponse.count} 条数据并覆盖本地数据，是否继续？`)) {
            return;
          }
          
          // 下载数据
          const serverData = await api.getCertificates();
          
          // 更新本地数据
          this.$store.commit('updateCertificates', serverData);
          
          this.$message.success(`已成功从服务器下载 ${serverData.length} 条数据`);
        } catch (error) {
          this.$message.error('下载数据失败: ' + error.message);
        } finally {
          this.isLoading = false;
        }
      },
      
      goBack() {
        this.$router.push('/admin');
      }
    }
  }
  </script>
  
  <style scoped>
  .server-config-page {
    padding: 20px;
  }
  
  .server-container {
    max-width: 900px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  h2 {
    text-align: center;
    color: #1890ff;
    margin-bottom: 30px;
  }
  
  .server-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .env-selector {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .env-option {
    flex: 1;
    border: 2px solid #e8e8e8;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .env-option:hover {
    border-color: #1890ff;
    transform: translateY(-3px);
  }
  
  .env-option.active {
    border-color: #1890ff;
    background-color: rgba(24, 144, 255, 0.05);
  }
  
  .env-name {
    font-weight: bold;
    margin-bottom: 8px;
    color: #1890ff;
  }
  
  .env-url {
    font-size: 12px;
    color: #888;
    word-break: break-all;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .input-group {
    display: flex;
    gap: 10px;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
  }
  
  input:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  .form-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #888;
  }
  
  .btn {
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    border: none;
    transition: all 0.3s;
  }
  
  .btn-primary {
    background-color: #1890ff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #40a9ff;
  }
  
  .btn-default {
    background-color: #f7f7f7;
    border: 1px solid #d9d9d9;
    color: rgba(0, 0, 0, 0.65);
  }
  
  .btn-default:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
  
  .btn[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .connection-test {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .test-btn {
    min-width: 120px;
  }
  
  .connection-status {
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
  }
  
  .status-success {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
  }
  
  .status-error {
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
  }
  
  .sync-actions {
    display: flex;
    gap: 20px;
  }
  
  .sync-option {
    flex: 1;
    padding: 20px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .sync-option:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-color: #1890ff;
  }
  
  .option-icon {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .option-title {
    font-weight: bold;
    color: #1890ff;
    margin-bottom: 8px;
  }
  
  .option-desc {
    font-size: 12px;
    color: #888;
  }
  
  .page-actions {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    .env-selector,
    .sync-actions {
      flex-direction: column;
    }
    
    .input-group {
      flex-wrap: wrap;
    }
    
    .input-group .btn {
      flex: 1;
      min-width: 100px;
    }
  }
  </style>