<template>
  <div class="batch-upload-page">
    <div class="batch-upload-container">
      <h2>批量添加社团证</h2>
      
      <div class="upload-tabs">
        <div 
          class="upload-tab" 
          :class="{ active: activeType === 'form' }"
          @click="setActiveType('form')"
        >
          批量表单
        </div>
        <div 
          class="upload-tab" 
          :class="{ active: activeType === 'photos' }"
          @click="setActiveType('photos')"
        >
          照片批量导入
        </div>
      </div>
      
      <!-- 批量表单 -->
      <div v-if="activeType === 'form'" class="upload-panel">
        <div class="batch-form-instructions">
          <h3>批量表单说明</h3>
          <p>1. 点击"添加一行"增加表单</p>
          <p>2. 填写社团证信息</p>
          <p>3. 点击"提交"保存所有信息</p>
        </div>
        
        <div class="batch-form">
          <div v-for="(form, index) in batchForms" :key="index" class="batch-form-item">
            <div class="form-item-header">
              <h4>社团证 #{{ index + 1 }}</h4>
              <button v-if="batchForms.length > 1" class="btn-icon" @click="removeForm(index)">❌</button>
            </div>
            <div class="form-item-body">
              <div class="form-row">
                <div class="form-group">
                  <label :for="'name-' + index">姓名</label>
                  <input 
                    :id="'name-' + index" 
                    type="text" 
                    v-model="form.name" 
                    placeholder="学生姓名"
                  >
                </div>
                <div class="form-group">
                  <label :for="'club-' + index">社团</label>
                  <select
                    :id="'club-' + index"
                    v-model="form.club"
                    class="form-select"
                  >
                    <option value="" disabled>请选择社团</option>
                    <option v-for="club in clubList" :key="club" :value="club">{{ club }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label :for="'role-' + index">角色</label>
                  <select
                    :id="'role-' + index"
                    v-model="form.role"
                    class="form-select"
                  >
                    <option value="" disabled>请选择职务</option>
                    <option v-for="role in roleList" :key="role" :value="role">{{ role }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label :for="'photo-' + index">照片</label>
                  <input 
                    :id="'photo-' + index" 
                    type="file" 
                    @change="handlePhotoChange($event, index)" 
                    accept="image/jpeg,image/png"
                  >
                </div>
              </div>
              <div v-if="form.photoPreview" class="photo-preview">
                <img :src="form.photoPreview" alt="照片预览">
              </div>
            </div>
          </div>
          
          <div class="batch-form-actions">
            <button class="btn btn-default" @click="addFormRow">添加一行</button>
            <button class="btn btn-primary" @click="saveBatchForms">提交</button>
          </div>
        </div>
      </div>
      
      <!-- 照片批量导入 -->
      <div v-if="activeType === 'photos'" class="upload-panel">
        <div class="batch-form-instructions">
          <h3>照片批量导入说明</h3>
          <p>1. 您可以选择包含照片的文件夹进行批量导入</p>
          <p>2. 照片文件名应遵循格式：社团名称-姓名-其他信息</p>
          <p>3. 例如：书法社-张三-012322100029.jpg</p>
          <p>4. 系统将自动解析文件名并导入相关信息</p>
        </div>
        
        <div class="photo-import">
          <div class="import-section">
            <h4>选择照片文件夹</h4>
            <div class="file-upload-area">
              <input 
                type="file" 
                id="folder-upload" 
                ref="folderUpload" 
                webkitdirectory 
                directory 
                multiple 
                @change="handleFolderSelect"
                style="display: none"
              >
              <button class="btn btn-primary" @click="triggerFolderUpload">
                选择文件夹
              </button>
              <span v-if="selectedFiles.length > 0" class="file-count">
                已选择 {{ selectedFiles.length }} 个照片文件
              </span>
            </div>
          </div>
          
          <div class="role-assignment" v-if="selectedFiles.length > 0">
            <h4>默认职务设置</h4>
            <p>为没有在文件名中指定职务的照片设置默认职务：</p>
            <div class="form-group">
              <select v-model="defaultRole" class="form-select">
                <option v-for="role in roleList" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>
          </div>
          
          <div class="parsed-files" v-if="parsedData.length > 0">
            <h4>解析结果预览</h4>
            <p>系统已解析以下信息，请检查并确认：</p>
            <table class="preview-table">
              <thead>
                <tr>
                  <th>照片</th>
                  <th>姓名</th>
                  <th>社团</th>
                  <th>职务</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in parsedData" :key="index">
                  <td class="photo-cell">
                    <img :src="item.photoUrl" alt="学生照片" class="preview-photo">
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.club }}</td>
                  <td>
                    <select v-model="item.role" class="form-select">
                      <option v-for="role in roleList" :key="role" :value="role">{{ role }}</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="batch-import-actions" v-if="parsedData.length > 0">
            <button class="btn btn-default" @click="resetPhotoImport">重置</button>
            <button class="btn btn-primary" @click="importParsedData">导入数据</button>
          </div>
        </div>
      </div>
      
      <div class="page-actions">
        <button class="btn btn-default" @click="goBack">返回管理页面</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BatchUploadPage',
  data() {
    return {
      activeType: 'form',
      batchForms: [
        {
          name: '',
          club: '',
          role: '',
          photoPreview: null,
          photo: null
        }
      ],
      roleList: ['社长', '副社长', '社员'],
      clubList: ['书法社', '摄影社', '足球社', '舞蹈社', '数学社', '篮球社', '音乐社', '美术社'],
      // 照片批量导入相关
      selectedFiles: [],
      parsedData: [],
      defaultRole: '社员'
    }
  },
  created() {
    // 从路由参数中获取上传类型
    const type = this.$route.query.type;
    if (type && (type === 'form' || type === 'photos')) {
      this.activeType = type;
    }
  },
  methods: {
    setActiveType(type) {
      this.activeType = type;
    },
    addFormRow() {
      this.batchForms.push({
        name: '',
        club: '',
        role: '',
        photoPreview: null,
        photo: null
      });
    },
    removeForm(index) {
      this.batchForms.splice(index, 1);
    },
    handlePhotoChange(event, index) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.batchForms[index].photoPreview = e.target.result;
          this.batchForms[index].photo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    saveBatchForms() {
      // 表单验证
      const invalidForms = this.batchForms.filter(form => 
        !form.name || !form.club || !form.role
      );
      
      if (invalidForms.length > 0) {
        this.$message.warning('请确保所有表单中的姓名、社团和角色都已填写');
        return;
      }
      
      // 在实际项目中，这里应该将数据提交到后端API
      this.$message.success(`成功保存 ${this.batchForms.length} 条社团证数据`);
      this.goBack();
    },
    // 照片批量导入相关方法
    triggerFolderUpload() {
      this.$refs.folderUpload.click();
    },
    handleFolderSelect(event) {
      const files = event.target.files;
      this.selectedFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (this.selectedFiles.length === 0) {
        this.$message.warning('未找到有效的图片文件');
        return;
      }
      
      this.parseFileNames();
    },
    parseFileNames() {
      this.parsedData = [];
      
      this.selectedFiles.forEach(file => {
        // 从文件名中解析信息
        const fileName = file.name.split('.')[0]; // 移除扩展名
        const parts = fileName.split('-');
        
        if (parts.length >= 2) {
          const club = parts[0].trim();
          const name = parts[1].trim();
          
          // 检查社团名称是否在预设列表中
          let validClub = this.clubList.includes(club) ? club : '';
          
          // 创建URL以预览图片
          const photoUrl = URL.createObjectURL(file);
          
          this.parsedData.push({
            name: name,
            club: validClub,
            role: this.defaultRole, // 使用默认职务
            photoUrl: photoUrl,
            file: file
          });
        }
      });
      
      if (this.parsedData.length === 0) {
        this.$message.warning('无法从文件名中解析有效信息，请确保文件名格式正确');
      }
    },
    resetPhotoImport() {
      // 释放创建的对象URL以避免内存泄漏
      this.parsedData.forEach(item => {
        URL.revokeObjectURL(item.photoUrl);
      });
      
      this.selectedFiles = [];
      this.parsedData = [];
      
      // 重置文件输入
      if (this.$refs.folderUpload) {
        this.$refs.folderUpload.value = '';
      }
    },
    importParsedData() {
      // 验证数据
      const invalidData = this.parsedData.filter(item => 
        !item.name || !item.club || !item.role
      );
      
      if (invalidData.length > 0) {
        this.$message.warning('请确保所有记录都有完整的姓名、社团和职务信息');
        return;
      }
      
      // 将文件转换为Base64以便存储
      let processedCount = 0;
      const totalCount = this.parsedData.length;
      const processedData = [];
      
      this.parsedData.forEach(item => {
        const reader = new FileReader();
        reader.onload = (e) => {
          processedData.push({
            name: item.name,
            club: item.club,
            role: item.role,
            photo: e.target.result
          });
          
          processedCount++;
          if (processedCount === totalCount) {
            // 全部处理完成后提交
            this.submitParsedData(processedData);
          }
        };
        reader.readAsDataURL(item.file);
      });
    },
    submitParsedData(data) {
      // 在实际项目中，这里应该将数据提交到后端API
      this.$message.success(`成功导入 ${data.length} 条社团证数据`);
      
      // 释放资源
      this.resetPhotoImport();
      
      // 返回管理页面
      this.goBack();
    },
    goBack() {
      this.$router.push('/admin');
    }
  }
}
</script>

<style lang="scss" scoped>
.batch-upload-page {
  padding: 20px 0;
}

.batch-upload-container {
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

.upload-tabs {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 30px;
}

.upload-tab {
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  
  &:hover {
    color: #1890ff;
  }
  
  &.active {
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
  }
}

.upload-panel {
  margin-bottom: 30px;
}

.upload-instructions, .batch-form-instructions {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  
  h3 {
    margin-bottom: 15px;
    color: #1890ff;
  }
  
  p {
    margin-bottom: 10px;
    line-height: 1.5;
  }
}

.template-download {
  text-align: center;
  margin: 20px 0;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #1890ff;
  }
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #1890ff;
}

.upload-text {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.upload-hint {
  color: #999;
}

.excel-preview {
  margin-top: 30px;
  
  h3 {
    margin-bottom: 15px;
    color: #1890ff;
  }
}

.excel-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.batch-form-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.form-item-header {
  background-color: #f5f5f5;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  
  h4 {
    margin: 0;
    color: #1890ff;
  }
}

.form-item-body {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 10px 15px;
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
}

.form-select {
  height: 42px;
  background-color: #fff;
  cursor: pointer;
}

.batch-form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
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
    color: #333;
    
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

.add-item-button {
  width: 100%;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  color: #1890ff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #1890ff;
    background-color: #f0f8ff;
  }
}

.progress-bar-container {
  margin: 20px 0;
  
  h4 {
    margin-bottom: 15px;
  }
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  
  .progress {
    height: 100%;
    background-color: #1890ff;
    border-radius: 10px;
    transition: width 0.3s ease;
  }
}

.progress-text {
  text-align: center;
  margin-top: 10px;
  color: #1890ff;
  font-weight: 500;
}

.message {
  margin: 15px 0;
  padding: 15px;
  border-radius: 6px;
  
  &-success {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
  }
  
  &-error {
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
  }
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  
  th, td {
    border: 1px solid #e8e8e8;
    padding: 12px 15px;
    text-align: left;
  }
  
  th {
    background-color: #fafafa;
    font-weight: 500;
  }
  
  tr {
    &:nth-child(even) {
      background-color: #fafafa;
    }
    
    &.success {
      background-color: #f6ffed;
    }
    
    &.error {
      background-color: #fff2f0;
    }
  }
}

.photo-preview {
  max-width: 150px;
  margin-top: 10px;
}

.photo-preview img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

/* 照片批量导入样式 */
.photo-import {
  margin-top: 20px;
}

.import-section {
  margin-bottom: 25px;
}

.import-section h4 {
  margin-bottom: 15px;
  color: #1890ff;
}

.file-upload-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-count {
  font-weight: 500;
  color: #1890ff;
}

.role-assignment {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

.role-assignment h4 {
  margin-bottom: 10px;
  color: #1890ff;
}

.parsed-files {
  margin-bottom: 25px;
}

.parsed-files h4 {
  margin-bottom: 10px;
  color: #1890ff;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.preview-table th, .preview-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.preview-table th {
  background-color: #f5f5f5;
  color: #555;
  font-weight: 500;
}

.photo-cell {
  width: 80px;
}

.preview-photo {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.batch-import-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.page-actions {
  text-align: center;
  margin-top: 30px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .upload-tabs {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .batch-form-actions, .excel-actions, .batch-import-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 