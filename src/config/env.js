/**
 * 环境配置文件
 * 用于管理不同环境的API地址和配置
 */

// 预设的服务器地址
const SERVER_CONFIGS = {
    development: 'http://localhost:3000/api',
    test: 'http://152.32.209.225/api',
    production: 'http://8.137.70.54/api'
  };
  
  // 获取当前环境
  const getEnvironment = () => {
    return localStorage.getItem('serverEnvironment') || 'test';
  };
  
  // 设置当前环境
  const setEnvironment = (env) => {
    if (['development', 'test', 'production'].includes(env)) {
      localStorage.setItem('serverEnvironment', env);
      return true;
    }
    return false;
  };
  
  // 获取当前服务器地址
  const getServerUrl = () => {
    // 优先使用用户自定义的服务器地址
    const customUrl = localStorage.getItem('customServerUrl');
    if (customUrl) {
      return customUrl;
    }
    
    // 否则使用预设环境地址
    const env = getEnvironment();
    return SERVER_CONFIGS[env];
  };
  
  // 设置自定义服务器地址
  const setCustomServerUrl = (url) => {
    if (url) {
      localStorage.setItem('customServerUrl', url);
    } else {
      localStorage.removeItem('customServerUrl');
    }
  };
  
  // 重置为默认服务器地址
  const resetToDefaultServer = () => {
    localStorage.removeItem('customServerUrl');
  };
  
  export default {
    getServerUrl,
    getEnvironment,
    setEnvironment,
    setCustomServerUrl,
    resetToDefaultServer,
    SERVER_CONFIGS
  };