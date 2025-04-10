<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="logo">重庆建筑工程职业学院社团证系统</div>
        <div class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/query">社团证查询</router-link>
          <router-link to="/admin">管理员入口</router-link>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container">
        <p>© 2025 重庆建筑工程职业学院社团管理系统</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  background-color: #f0f2f5;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: #1890ff;
}

main {
  min-height: calc(100vh - 130px);
  padding: 30px 0;
}

.footer {
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 20px 0;
  text-align: center;
  color: #666;
}
</style> 