<script setup lang="ts">
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { request } from '../../utils/request';

interface PostItem { id: string; content?: string; images?: string[]; likeCount: number; commentCount: number; createdAt: string; }

const posts = ref<PostItem[]>([]);
const announcements = ref<any[]>([]);
const ads = ref<any[]>([]);

async function load() {
  const postData = await request<{ list: PostItem[] }>('/posts');
  posts.value = postData.list;
  announcements.value = await request<any[]>('/announcements?position=home_top');
  ads.value = await request<any[]>('/ads');
  uni.stopPullDownRefresh();
}

onShow(load);
onPullDownRefresh(load);
</script>

<template>
  <view class="page">
    <view v-if="announcements.length" class="notice">📢 {{ announcements[0].title }}</view>
    <swiper v-if="ads.length" class="banner" autoplay circular>
      <swiper-item v-for="ad in ads" :key="ad.id"><image :src="ad.imageUrl" mode="aspectFill" /></swiper-item>
    </swiper>
    <view v-for="post in posts" :key="post.id" class="card">
      <text class="content">{{ post.content }}</text>
      <view class="grid"><image v-for="img in post.images" :key="img" :src="img" mode="aspectFill" /></view>
      <view class="actions">👍 {{ post.likeCount }}　💬 {{ post.commentCount }}</view>
    </view>
  </view>
</template>

<style scoped>
.page { padding: 24rpx; }
.notice, .card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 24rpx; }
.banner { height: 240rpx; margin-bottom: 24rpx; border-radius: 20rpx; overflow: hidden; }
.banner image { width: 100%; height: 100%; }
.content { display: block; margin-bottom: 16rpx; }
.grid { display: flex; flex-wrap: wrap; gap: 12rpx; }
.grid image { width: 200rpx; height: 200rpx; border-radius: 12rpx; }
.actions { margin-top: 16rpx; color: #64748b; }
</style>
