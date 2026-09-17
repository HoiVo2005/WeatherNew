import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    // Cho phép next/image tối ưu với chất lượng 90 (mặc định chỉ 75)
    // để ảnh ngày lễ hiển thị sắc nét hơn
    qualities: [75, 90],
  },
};

export default nextConfig;
