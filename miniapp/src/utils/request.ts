const BASE_URL = 'http://localhost:3000/api';

export function request<T>(url: string, options: UniApp.RequestOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    const token = uni.getStorageSync('token');
    uni.request({
      url: `${BASE_URL}${url}`,
      ...options,
      header: { ...(options.header ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      success: (res) => resolve(res.data as T),
      fail: reject,
    });
  });
}
