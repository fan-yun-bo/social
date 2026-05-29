<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { http } from '../api/http';

const router = useRouter();
const username = ref('admin');
const password = ref('admin123');
const loading = ref(false);

async function login() {
  loading.value = true;
  const { data } = await http.post('/admin/auth/login', { username: username.value, password: password.value });
  localStorage.setItem('admin_token', data.token);
  loading.value = false;
  await router.push('/');
}
</script>

<template>
  <main class="login-page">
    <el-card class="login-card">
      <h1>社交广告平台后台</h1>
      <el-form label-position="top">
        <el-form-item label="账号"><el-input v-model="username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="password" type="password" show-password /></el-form-item>
        <el-button type="primary" :loading="loading" @click="login">登录</el-button>
      </el-form>
    </el-card>
  </main>
</template>
