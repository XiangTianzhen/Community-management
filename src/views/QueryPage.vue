<template>
  <div class="query-page">
    <div class="query-box">
      <h2>社团证查询</h2>
      <div class="form-group">
        <label for="name">姓名</label>
        <input 
          type="text" 
          id="name" 
          v-model="queryForm.name" 
          placeholder="请输入你的姓名"
        >
      </div>
      <div class="form-group">
        <label for="club">社团名称</label>
        <select
          id="club"
          v-model="queryForm.club"
          class="form-select"
        >
          <option value="" disabled>请选择社团</option>
          <option v-for="club in clubList" :key="club" :value="club">{{ club }}</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="handleQuery">查询</button>
      
      <div class="result-area" v-if="showResult">
        <div v-if="hasResult">
          <!-- 新样式的社团证 -->
          <div class="certificate-card">
            <!-- 顶部Logo和标题 -->
            <div class="certificate-header">
              <div class="school-logo">
                <div class="logo-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="#ffffff">
                    <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
                  </svg>
                </div>
                <div class="school-title">
                  <div class="school-name-cn">重庆建筑工程职业学院</div>
                  <div class="school-name-en">CHONGQING JIANZHU COLLEGE</div>
                </div>
              </div>
            </div>
            
            <!-- 证书主体 -->
            <div class="certificate-body">
              <div class="student-photo-container">
                <img 
                  :src="result.photo || 'https://randomuser.me/api/portraits/men/1.jpg'" 
                  alt="学生照片" 
                  class="student-photo"
                />
              </div>
              
              <div class="student-info">
                <div class="info-item">
                  <span class="info-label">姓名：</span>
                  <span class="info-value">{{ result.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">社团：</span>
                  <span class="info-value">{{ result.club }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">职务：</span>
                  <span class="info-value">{{ result.role }}</span>
                </div>
              </div>
            </div>
            
            <!-- 证书底部 -->
            <div class="certificate-footer">
            </div>
            
            <!-- 印章，放置在整个卡片的最上层 -->
            <div class="school-seal">
              <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5252" stroke-width="2" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ff5252" stroke-width="1" />
                <text x="50" y="50" font-size="12" text-anchor="middle" fill="#ff5252">重庆建筑工程</text>
                <text x="50" y="65" font-size="12" text-anchor="middle" fill="#ff5252">职业学院</text>
                <path d="M50 15 L53 25 L45 20 L55 20 L47 25 Z" fill="#ff5252" />
              </svg>
            </div>
          </div>
          
          <div class="result-actions">
            <button class="btn btn-success" @click="downloadCertificate">下载社团证</button>
          </div>
        </div>
        
        <div class="no-result" v-else>
          <p>未找到匹配的社团证信息，请检查输入是否正确</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueryPage',
  data() {
    return {
      queryForm: {
        name: '',
        club: ''
      },
      showResult: false,
      hasResult: false,
      result: null,
      clubList: ['书法社', '摄影社', '足球社', '舞蹈社', '数学社', '篮球社', '音乐社', '美术社']
    }
  },
  methods: {
    handleQuery() {
      // 模拟查询操作
      if (this.queryForm.name && this.queryForm.club) {
        // 模拟API调用延迟
        setTimeout(() => {
          // 模拟查询结果
          if (this.queryForm.name === '张三' && this.queryForm.club === '书法社') {
            this.hasResult = true;
            this.result = {
              name: '张三',
              club: '书法社',
              role: '社长',
              photo: 'https://randomuser.me/api/portraits/men/1.jpg'
            };
          } else if (this.queryForm.name === '李四' && this.queryForm.club === '摄影社') {
            this.hasResult = true;
            this.result = {
              name: '李四',
              club: '摄影社',
              role: '副社长',
              photo: 'https://randomuser.me/api/portraits/men/2.jpg'
            };
          } else if (this.queryForm.name === '王五' && this.queryForm.club === '足球社') {
            this.hasResult = true;
            this.result = {
              name: '王五',
              club: '足球社',
              role: '社员',
              photo: 'https://randomuser.me/api/portraits/men/3.jpg'
            };
          } else if (this.queryForm.name === '赵六' && this.queryForm.club === '舞蹈社') {
            this.hasResult = true;
            this.result = {
              name: '赵六',
              club: '舞蹈社',
              role: '社长',
              photo: 'https://randomuser.me/api/portraits/women/1.jpg'
            };
          } else {
            this.hasResult = false;
            this.result = null;
          }
          this.showResult = true;
        }, 800);
      } else {
        this.$message.warning('请填写完整的查询信息');
      }
    },
    downloadCertificate() {
      // 实际项目中应该是调用后端API下载或生成社团证图片
      this.$message.success('社团证已开始下载！（实际项目中这里应该触发真实下载）');
    }
  }
}
</script>

<style lang="scss" scoped>
.query-page {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.query-box {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

h2 {
  text-align: center;
  color: #1890ff;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s;
  
  &:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  font-size: 16px;
  width: 100%;
  
  &-primary {
    background-color: #1890ff;
    color: white;
    
    &:hover {
      background-color: #40a9ff;
    }
  }
  
  &-success {
    background-color: #52c41a;
    color: white;
    
    &:hover {
      background-color: #73d13d;
    }
  }
}

.result-area {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e8e8e8;
}

/* 新样式社团证 */
.certificate-card {
  width: 100%;
  aspect-ratio: 3/4;
  max-width: 400px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #1e88e5, #1565c0);
  background-size: cover;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.certificate-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.school-logo {
  display: flex;
  align-items: center;
  
  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-right: 15px;
  }
}

.logo-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1565c0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.school-title {
  text-align: center;
}

.school-name-cn {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.school-name-en {
  font-size: 12px;
  opacity: 0.9;
}

.certificate-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.student-photo-container {
  width: 150px;
  height: 200px;
  margin-bottom: 30px;
  border: 4px solid rgba(255, 255, 255, 0.7);
  overflow: hidden;
  position: relative;
}

.student-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-info {
  text-align: center;
  width: 100%;
  padding: 0 20px;
  max-width: 350px;
  margin: 0 auto;
}

.info-item {
  margin-bottom: 15px;
  font-size: 18px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.info-label {
  font-weight: bold;
  text-align: left;
  width: 20%;
  margin-left: 20px;
}

.info-value {
  font-weight: 500;
  width: 60%;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  padding-bottom: 5px;
}

.certificate-footer {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.result-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.no-result {
  text-align: center;
  padding: 30px;
  color: #ff4d4f;
}

.form-select {
  width: 100%;
  height: 46px;
  padding: 12px 15px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #fff;
  cursor: pointer;
  
  &:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

.school-seal {
  position: absolute;
  right: 20px;
  bottom: 40px;
  transform: rotate(15deg);
  opacity: 0.8;
  z-index: 10;
}

@media (max-width: 768px) {
  .query-box {
    padding: 20px;
  }
  
  .certificate-card {
    max-width: 320px;
  }
  
  .school-name-cn {
    font-size: 18px;
  }
  
  .student-photo-container {
    width: 120px;
    height: 160px;
  }
  
  .info-item {
    font-size: 14px;
  }
  
  .school-seal {
    svg {
      width: 60px;
      height: 60px;
    }
  }
}
</style> 