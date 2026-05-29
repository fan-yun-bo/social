<script setup lang="ts">
import { ref } from 'vue';
import { request } from '../../utils/request';

const content = ref('');
const images = ref<string[]>([]);

function chooseImages() {
  uni.chooseImage({
    count: 9 - images.value.length,
    success: async ({ tempFilePaths }) => {
      for (const path of tempFilePaths) {
        await new Promise<void>((resolve, reject) => {
          uni.uploadFile({
            url: 'http://localhost:3000/api/upload/image?scene=post',
            filePath: path,
            name: 'file',
            header: { Authorization: `Bearer ${uni.getStorageSync('token')}` },
            success: (res) => {
              const file = JSON.parse(res.data);
              images.value.push(file.fileUrl);
              resolve();
            },
            fail: reject,
          });
        });
      }
    },
  });
}

async function publish() {
  await request('/posts', { method: 'POST', data: { content: content.value, images: images.value } });
  uni.showToast({ title: '发布成功' });
  content.value = '';
  images.value = [];
  uni.switchTab({ url: '/pages/index/index' });
}
</script>

<template>
  <view class="page">
    <textarea v-model="content" placeholder="分享新鲜事..." class="textarea" />
    <view class="grid">
      <image v-for="img in images" :key="img" :src="img" mode="aspectFill" />
      <button v-if="images.length < 9" class="upload" @click="chooseImages">+</button>
    </view>
    <button type="primary" @click="publish">发布动态</button>
  </view>
</template>

<style scoped>
.page { padding: 24rpx; }
.textarea { width: 100%; min-height: 260rpx; background: #fff; border-radius: 20rpx; padding: 24rpx; box-sizing: border-box; }
.grid { display: flex; flex-wrap: wrap; gap: 12rpx; margin: 24rpx 0; }
.grid image, .upload { width: 200rpx; height: 200rpx; border-radius: 12rpx; }
.upload { display: grid; place-items: center; font-size: 60rpx; color: #64748b; }
</style>
