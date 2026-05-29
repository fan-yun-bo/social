<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { http } from '../api/http';

const stats = ref<Record<string, number>>({});
const modules = [
  '用户管理', '动态管理', '评论管理', '文件管理', '公告管理',
  '广告位管理', '广告套餐管理', '广告订单管理', '广告审核', '收入统计',
];

onMounted(async () => {
  const { data } = await http.get('/admin/statistics');
  stats.value = data;
});
</script>

<template>
  <el-container class="admin-shell">
    <el-aside width="220px" class="sidebar">
      <h2>Social Admin</h2>
      <el-menu default-active="0">
        <el-menu-item v-for="(item, index) in modules" :key="item" :index="String(index)">{{ item }}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <h1>仪表盘</h1>
      <el-row :gutter="16">
        <el-col v-for="(value, key) in stats" :key="key" :span="6">
          <el-card>
            <p class="metric-label">{{ key }}</p>
            <strong class="metric-value">{{ value }}</strong>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="mt">
        <h3>当前开发范围</h3>
        <p>已接入后台登录、统计概览菜单结构，后续按清单逐步补齐各管理页面。</p>
      </el-card>
    </el-main>
  </el-container>
</template>
