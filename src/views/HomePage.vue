<template>
  <div class="home-page">
    <section class="hero">
      <h1>重庆建筑工程职业学院社团证查询系统</h1>
      <p>查询、下载你的社团证，快捷方便</p>
      <div class="hero-actions">
        <router-link to="/query" class="btn btn-primary">立即查询</router-link>
        <router-link to="/admin" class="btn btn-outline">管理员入口</router-link>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>快速查询</h3>
        <p>输入姓名和社团名称，即可快速查询社团证</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📄</div>
        <h3>社团证下载</h3>
        <p>查询到社团证后可一键下载高清社团证图片</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>移动友好</h3>
        <p>支持手机、平板等各种设备访问使用</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style lang="scss" scoped>
.home-page {
  padding: 20px 0;
}

.hero {
  text-align: center;
  padding: 50px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.2rem;
    color: #1890ff;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
  }
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  
  &-primary {
    background-color: #1890ff;
    color: white;
    border: 1px solid #1890ff;
    
    &:hover {
      background-color: #40a9ff;
      border-color: #40a9ff;
    }
  }
  
  &-outline {
    background-color: transparent;
    color: #1890ff;
    border: 1px solid #1890ff;
    
    &:hover {
      background-color: rgba(24, 144, 255, 0.1);
    }
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  p {
    color: #666;
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .hero {
    h1 {
      font-size: 1.8rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style> 