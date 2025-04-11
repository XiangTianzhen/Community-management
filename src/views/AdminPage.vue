<template>
  <div class="admin-page">
    <div class="admin-container">
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'add' }" 
          @click="activeTab = 'add'"
        >
          添加社团证
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'batch' }" 
          @click="activeTab = 'batch'"
        >
          批量管理
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'list' }" 
          @click="activeTab = 'list'"
        >
          社团证列表
        </div>
      </div>
      
      <div class="tab-content">
        <!-- 单个添加表单 -->
        <div v-if="activeTab === 'add'" class="tab-pane">
          <h3>添加新社团证</h3>
          <div class="form">
            <div class="form-group">
              <label for="add-name">学生姓名</label>
              <input 
                type="text" 
                id="add-name" 
                v-model="addForm.name" 
                placeholder="请输入学生姓名"
              >
            </div>
            <div class="form-group">
              <label for="add-club">社团名称</label>
              <select
                id="add-club"
                v-model="addForm.club"
                class="form-select"
              >
                <option value="" disabled>请选择社团</option>
                <option v-for="club in clubList" :key="club" :value="club">{{ club }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="add-role">担任职务</label>
              <select
                id="add-role"
                v-model="addForm.role"
                class="form-select"
              >
                <option value="" disabled>请选择职务</option>
                <option v-for="role in roleList" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="add-photo">学生照片</label>
              <div class="photo-upload">
                <div v-if="photoPreview" class="photo-preview">
                  <img :src="photoPreview" alt="照片预览">
                  <button class="btn-icon remove-photo" @click="removePhoto">❌</button>
                </div>
                <div v-else class="upload-box" @click="triggerPhotoInput">
                  <div class="upload-icon">📷</div>
                  <p>点击上传照片</p>
                  <p class="upload-hint">支持jpg、png格式</p>
                </div>
                <input 
                  type="file" 
                  id="add-photo"
                  ref="photoInput" 
                  style="display: none" 
                  accept="image/jpeg,image/png"
                  @change="handlePhotoChange"
                >
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-primary" @click="handleAddCertificate">保存</button>
              <button class="btn btn-default" @click="resetAddForm">重置</button>
            </div>
          </div>
        </div>
        
        <!-- 批量管理 -->
        <div v-if="activeTab === 'batch'" class="tab-pane">
          <h3>社团证批量管理</h3>
          <div class="batch-actions">
            <div class="batch-section">
              <h4>批量添加</h4>
              <p>通过多种方式批量添加社团证信息</p>
              <div class="batch-options-row">
                <div class="batch-option clickable" @click="goToBatchUpload('photos')">
                  <div class="option-icon">📷</div>
                  <div class="option-title">照片批量导入</div>
                  <div class="option-desc">从照片文件名解析并导入社团证信息</div>
                </div>
                <div class="batch-option clickable" @click="goToBatchUpload('form')">
                  <div class="option-icon">📝</div>
                  <div class="option-title">批量表单</div>
                  <div class="option-desc">通过表单批量添加多个社团证信息</div>
                </div>
              </div>
            </div>
            
            <div class="batch-section">
              <h4>全部删除</h4>
              <p>删除所有社团证信息</p>
              <div class="batch-option clickable" @click="showConfirmDialog = true">
                <div class="option-icon">🗑️</div>
                <div class="option-title">全部删除</div>
                <div class="option-desc">一键删除所有社团证信息</div>
              </div>
            </div>
          </div>
          
          <!-- 确认对话框 -->
          <div class="dialog-overlay" v-if="showConfirmDialog">
            <div class="dialog">
              <h4>全部删除确认</h4>
              <p>删除所有社团证信息，此操作不可恢复，是否继续？</p>
              <div class="dialog-footer">
                <button class="btn btn-default" @click="showConfirmDialog = false">取消</button>
                <button class="btn btn-danger" @click="handleBatchDelete">确认删除</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 社团证列表 -->
        <div v-if="activeTab === 'list'" class="tab-pane">
          <h3>社团证列表</h3>
          <div class="filter-bar">
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="搜索姓名或社团..." 
                @input="filterCertificates"
              >
              <button class="btn-search" @click="searchCertificates">搜索</button>
            </div>
          </div>
          
          <div class="certificates-list">
            <div v-for="club in clubCategories" :key="club" class="club-category">
              <h4 class="club-title">{{ club }}</h4>
              <table>
                <thead>
                  <tr>
                    <th class="text-center">照片</th>
                    <th>姓名</th>
                    <th>社团名称</th>
                    <th>职位</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(cert, index) in getCertificatesByClub(club)" :key="index">
                    <td class="photo-cell">
                      <img 
                        v-if="cert.photo" 
                        :src="cert.photo" 
                        alt="学生照片" 
                        class="student-photo"
                      >
                      <div v-else class="no-photo">暂无照片</div>
                    </td>
                    <td>{{ cert.name }}</td>
                    <td>{{ cert.club }}</td>
                    <td>{{ cert.role }}</td>
                    <td class="actions">
                      <div class="action-buttons">
                        <button class="op-btn edit-btn" @click="editCertificate(getOriginalIndex(cert))">编辑</button>
                        <button class="op-btn delete-btn" @click="deleteCertificate(getOriginalIndex(cert))">删除</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="getCertificatesByClub(club).length === 0">
                    <td colspan="5" class="empty-message">暂无社团证数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="clubCategories.length === 0" class="empty-state">
              <p>暂无社团证数据</p>
            </div>
          </div>
          
          <!-- 编辑对话框 -->
          <div class="dialog-overlay" v-if="showEditDialog">
            <div class="dialog edit-dialog">
              <h4>编辑社团证</h4>
              <div class="form">
                <div class="form-group">
                  <label for="edit-name">学生姓名</label>
                  <input 
                    type="text" 
                    id="edit-name" 
                    v-model="editForm.name" 
                    placeholder="请输入学生姓名"
                  >
                </div>
                <div class="form-group">
                  <label for="edit-club">社团名称</label>
                  <select
                    id="edit-club"
                    v-model="editForm.club"
                    class="form-select"
                  >
                    <option v-for="club in clubList" :key="club" :value="club">{{ club }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="edit-role">担任职务</label>
                  <select
                    id="edit-role"
                    v-model="editForm.role"
                    class="form-select"
                  >
                    <option v-for="role in roleList" :key="role" :value="role">{{ role }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>学生照片</label>
                  <div class="photo-upload">
                    <div v-if="editPhotoPreview" class="photo-preview">
                      <img :src="editPhotoPreview" alt="照片预览">
                      <button class="btn-icon remove-photo" @click="removeEditPhoto">❌</button>
                    </div>
                    <div v-else class="upload-box" @click="triggerEditPhotoInput">
                      <div class="upload-icon">📷</div>
                      <p>点击上传照片</p>
                      <p class="upload-hint">支持jpg、png格式</p>
                    </div>
                    <input 
                      type="file"
                      ref="editPhotoInput" 
                      style="display: none" 
                      accept="image/jpeg,image/png"
                      @change="handleEditPhotoChange"
                    >
                  </div>
                </div>
                <div class="dialog-footer">
                  <button class="btn btn-default" @click="showEditDialog = false">取消</button>
                  <button class="btn btn-primary" @click="saveEdit">保存</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      activeTab: 'add',
      addForm: {
        name: '',
        club: '',
        role: '',
        photo: null
      },
      photoPreview: null,
      editPhotoPreview: null,
      clubList: ['BIM协会','爱心社','辩论社','测量协会','茶艺社','动漫社','发明与专利协会','工程检测协会','古风社','轨道创新社','航模社','话剧与电影协会','建工键球社','健身社','军事爱好者协会','篮球社','礼仪社','马克思主义青年研究会','美术社','排球社','乒乓球协会','棋艺社','青藤协会','摄影社','识图与绘图社','书法社','数学建模协会','数字商务协会','武术社','舞蹈协会','校乐团','心理社','学习互助社','逸驰汽车社','音乐协会','羽毛球社','约创社','志趣英语社','智汇学习社','助跑编程社','筑梦职航社','装配式智能建造协会','足球社'],
      roleList: ['社长', '副社长', '社员'],
      certificates: [
        {
          name: '张三',
          club: '书法社',
          role: '社长', 
          photo: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          name: '李四',
          club: '摄影社',
          role: '社长',
          photo: 'https://randomuser.me/api/portraits/men/2.jpg'
        },
        {
          name: '王五',
          club: '足球社',
          role: '社长',
          photo: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
        {
          name: '赵六',
          club: '舞蹈社',
          role: '社长',
          photo: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        {
          name: '钱七',
          club: '数学社',
          role: '社长',
          photo: 'https://randomuser.me/api/portraits/men/4.jpg'
        },
        {
          name: '周八',
          club: '书法社',
          role: '副社长',
          photo: 'https://randomuser.me/api/portraits/men/5.jpg'
        },
        {
          name: '吴九',
          club: '摄影社',
          role: '副社长',
          photo: 'https://randomuser.me/api/portraits/men/6.jpg'
        },
        {
          name: '郑十',
          club: '足球社',
          role: '副社长',
          photo: 'https://randomuser.me/api/portraits/men/7.jpg'
        },
        {
          name: '林一',
          club: '书法社',
          role: '社员',
          photo: null
        },
        {
          name: '陈二',
          club: '书法社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/men/8.jpg'
        },
        {
          name: '杨三',
          club: '摄影社',
          role: '社员',
          photo: null
        },
        {
          name: '刘四',
          club: '摄影社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
          name: '黄五',
          club: '足球社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/men/9.jpg'
        },
        {
          name: '宋六',
          club: '足球社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/men/10.jpg'
        },
        {
          name: '孙七',
          club: '足球社',
          role: '社员',
          photo: null
        },
        {
          name: '何八',
          club: '舞蹈社',
          role: '副社长',
          photo: 'https://randomuser.me/api/portraits/women/3.jpg'
        },
        {
          name: '龙九',
          club: '舞蹈社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/women/4.jpg'
        },
        {
          name: '胡十',
          club: '舞蹈社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/women/5.jpg'
        },
        {
          name: '高一',
          club: '数学社',
          role: '副社长',
          photo: null
        },
        {
          name: '谢二',
          club: '数学社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/men/11.jpg'
        },
        {
          name: '姚三',
          club: '数学社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/men/12.jpg'
        },
        {
          name: '冯四',
          club: '篮球社',
          role: '社长',
          photo: 'https://randomuser.me/api/portraits/men/13.jpg'
        },
        {
          name: '唐五',
          club: '篮球社',
          role: '副社长',
          photo: 'https://randomuser.me/api/portraits/men/14.jpg'
        },
        {
          name: '薛六',
          club: '篮球社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/men/15.jpg'
        },
        {
          name: '魏七',
          club: '音乐社',
          role: '社长',
          photo: 'https://randomuser.me/api/portraits/women/6.jpg'
        },
        {
          name: '邓八',
          club: '音乐社',
          role: '副社长',
          photo: 'https://randomuser.me/api/portraits/women/7.jpg'
        },
        {
          name: '廖九',
          club: '音乐社',
          role: '社员',
          photo: null
        },
        {
          name: '曾十',
          club: '美术社',
          role: '社长',
          photo: 'https://randomuser.me/api/portraits/women/8.jpg'
        },
        {
          name: '严一',
          club: '美术社',
          role: '副社长',
          photo: 'https://randomuser.me/api/portraits/women/9.jpg'
        },
        {
          name: '江二',
          club: '美术社',
          role: '社员',
          photo: 'https://randomuser.me/api/portraits/women/10.jpg'
        }
      ],
      filteredCertificates: [],
      searchQuery: '',
      showConfirmDialog: false,
      showEditDialog: false,
      editForm: {
        name: '',
        club: '',
        role: '',
        photo: null
      },
      editIndex: -1
    }
  },
  computed: {
    clubCategories() {
      // 获取所有存在证书的社团列表（去重）
      const clubs = [...new Set(this.filteredCertificates.map(cert => cert.club))];
      return clubs.sort(); // 按社团名称排序
    }
  },
  created() {
    // 初始化过滤后的证书列表
    this.filteredCertificates = [...this.certificates];
  },
  methods: {
    getCertificatesByClub(club) {
      // 获取特定社团的所有证书
      return this.filteredCertificates.filter(cert => cert.club === club);
    },
    getOriginalIndex(cert) {
      // 找到原始数据的索引
      return this.certificates.findIndex(c => 
        c.name === cert.name && c.club === cert.club
      );
    },
    triggerPhotoInput() {
      this.$refs.photoInput.click();
    },
    handlePhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreview = e.target.result;
          this.addForm.photo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removePhoto() {
      this.photoPreview = null;
      this.addForm.photo = null;
      if (this.$refs.photoInput) {
        this.$refs.photoInput.value = '';
      }
    },
    triggerEditPhotoInput() {
      this.$refs.editPhotoInput.click();
    },
    handleEditPhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editPhotoPreview = e.target.result;
          this.editForm.photo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removeEditPhoto() {
      this.editPhotoPreview = null;
      this.editForm.photo = null;
      if (this.$refs.editPhotoInput) {
        this.$refs.editPhotoInput.value = '';
      }
    },
    handleAddCertificate() {
      // 简单表单验证
      if (!this.addForm.name || !this.addForm.club || !this.addForm.role) {
        this.$message.warning('请至少填写姓名、社团和职务信息');
        return;
      }
      
      // 添加到列表
      this.certificates.push({...this.addForm});
      this.filteredCertificates = [...this.certificates];
      
      // 重置表单
      this.resetAddForm();
      
      // 显示成功消息
      this.$message.success('社团证添加成功');
    },
    resetAddForm() {
      this.addForm = {
        name: '',
        club: '',
        role: '',
        photo: null
      };
      this.photoPreview = null;
      if (this.$refs.photoInput) {
        this.$refs.photoInput.value = '';
      }
    },
    goToBatchUpload(type) {
      this.$router.push({
        path: '/batch-upload',
        query: { type }
      });
    },
    handleBatchDelete() {
      if (confirm('确定要删除所有社团证吗？')) {
        this.certificates = [];
        this.filteredCertificates = [];
        this.showConfirmDialog = false;
        this.$message.success('所有社团证已删除');
      }
    },
    filterCertificates() {
      if (!this.searchQuery) {
        this.filteredCertificates = [...this.certificates];
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredCertificates = this.certificates.filter(cert => 
        cert.name.toLowerCase().includes(query) ||
        cert.club.toLowerCase().includes(query)
      );
    },
    searchCertificates() {
      console.log('搜索社团证:', this.searchQuery);
    },
    editCertificate(index) {
      this.editIndex = index;
      this.editForm = {...this.certificates[index]};
      this.editPhotoPreview = this.certificates[index].photo;
      this.showEditDialog = true;
    },
    saveEdit() {
      if (!this.editForm.name || !this.editForm.club || !this.editForm.role) {
        this.$message.warning('姓名、社团和职务不能为空');
        return;
      }
      
      if (this.editIndex !== -1) {
        this.certificates[this.editIndex] = {...this.editForm};
        this.filterCertificates(); // 重新应用过滤
        this.showEditDialog = false;
        this.$message.success('社团证已更新');
      }
    },
    deleteCertificate(index) {
      if (confirm('确定要删除这条社团证吗？')) {
        this.certificates.splice(index, 1);
        this.filterCertificates(); // 重新应用过滤
        this.$message.success('社团证已删除');
      }
    },
    previewCertificate(cert) {
      // 实现预览逻辑
      console.log('预览社团证:', cert);
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-page {
  padding: 20px 0;
}

.admin-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tabs {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
}

.tab {
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  
  &:hover {
    background-color: rgba(24, 144, 255, 0.1);
  }
  
  &.active {
    color: #1890ff;
    background-color: #fff;
    border-bottom: 2px solid #1890ff;
  }
}

.tab-content {
  padding: 25px;
}

.tab-pane {
  h3 {
    margin-bottom: 25px;
    color: #1890ff;
    text-align: center;
  }
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input, select, textarea {
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

.form-select {
  height: 46px;
  background-color: #fff;
  cursor: pointer;
}

.photo-upload {
  margin-top: 10px;
}

.upload-box {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #1890ff;
  }
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #1890ff;
}

.upload-hint {
  color: #999;
  font-size: 0.9rem;
  margin-top: 5px;
}

.photo-preview {
  position: relative;
  width: 150px;
  height: 200px;
  margin: 0 auto;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }
}

.remove-photo {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 16px;
  
  &-primary {
    background-color: #1890ff;
    color: white;
    
    &:hover {
      background-color: #40a9ff;
    }
  }
  
  &-default {
    background-color: #f5f5f5;
    color: #666;
    border: 1px solid #d9d9d9;
    
    &:hover {
      background-color: #e8e8e8;
    }
  }
  
  &-danger {
    background-color: #ff4d4f;
    color: white;
    
    &:hover {
      background-color: #ff7875;
    }
  }
}

.batch-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.batch-section {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    border-color: #1890ff;
  }
}

.option-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: #1890ff;
}

.option-desc {
  font-size: 0.9rem;
  color: #666;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  h4 {
    margin-bottom: 15px;
    color: #333;
  }
  
  p {
    margin-bottom: 25px;
    color: #666;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.edit-dialog {
  max-width: 600px;
}

/* 列表样式 */
.filter-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  position: relative;
  width: 250px;
  
  input {
    padding-right: 40px;
  }
}

.btn-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #1890ff;
}

.club-category {
  margin-bottom: 30px;
}

.club-title {
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff;
  color: #1890ff;
  font-size: 18px;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  table-layout: fixed;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
  width: 20%;
  word-break: break-word;
}

th {
  background-color: #f5f5f5;
  color: #555;
  font-weight: 500;
}

tr {
  &:hover {
    background-color: #f9f9f9;
  }
}

.photo-cell {
  width: 20%;
  padding: 10px;
  text-align: center;
}

.student-photo {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.no-photo {
  width: 60px;
  height: 80px;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.empty-state {
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 1.1rem;
}

.actions {
  height: 100%;
  padding: 0 15px;
  width: 20%;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.op-btn {
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  color: #fff;
  border: none;
}

.edit-btn {
  background-color: #1890ff;
  
  &:hover {
    background-color: #40a9ff;
  }
}

.delete-btn {
  background-color: #ff4d4f;
  
  &:hover {
    background-color: #ff7875;
  }
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }
  
  .tab {
    padding: 12px 15px;
  }
  
  .tab-content {
    padding: 15px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  table {
    display: block;
    overflow-x: auto;
  }
  
  .batch-actions {
    grid-template-columns: 1fr;
  }
}

tbody tr {
  background-color: #fff;
  transition: background-color 0.3s;
}

.text-center {
  text-align: center;
}

.batch-options-row {
  display: flex;
  gap: 20px;
}

.batch-option {
  margin-top: 15px;
  height: 200px;
  flex: 1;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    border-color: #1890ff;
  }
}

.clickable {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
}
</style> 