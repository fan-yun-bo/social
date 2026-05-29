<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { request } from '../../utils/request';

const orders = ref<any[]>([]);
onShow(async () => { orders.value = await request<any[]>('/my/ad-orders'); });
</script>

<template>
  <view class="page">
    <view v-for="order in orders" :key="order.id" class="card">
      <text>{{ order.orderNo }}</text>
      <text>￥{{ order.payAmount }}</text>
      <text>状态：{{ order.orderStatus }}</text>
    </view>
  </view>
</template>

<style scoped>
.page { padding: 24rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 24rpx; display: flex; flex-direction: column; gap: 8rpx; }
</style>
