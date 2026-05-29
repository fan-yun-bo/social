<script setup lang="ts">
import { ref } from 'vue';
import { request } from '../../utils/request';

const profile = ref<any>();

async function login() {
  const { token, user } = await request<{ token: string; user: any }>('/auth/wx-login', { method: 'POST', data: { code: `dev-${Date.now()}`, nickname: '测试用户' } });
  uni.setStorageSync('token', token);
  profile.value = user;
}

async function bindPhone() {
  await request('/auth/wx-phone', { method: 'POST', data: { code: '13800138000', phone: '13800138000' } });
  uni.showToast({ title: '手机号已入库' });
}
</script>

<template>
  <view class="page">
    <view class="card">
      <text class="title">{{ profile?.nickname || '未登录用户' }}</text>
      <button @click="login">微信登录</button>
      <button @click="bindPhone">授权手机号</button>
      <navigator url="/pages/ad/orders">我的广告订单</navigator>
    </view>
  </view>
</template>

<style scoped>
.page { padding: 24rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 24rpx; }
.title { display: block; font-size: 36rpx; margin-bottom: 24rpx; }
button { margin-bottom: 16rpx; }
</style>
