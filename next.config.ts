import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Every next/image goes through Sanity's image CDN (see the loader file).
    loader: 'custom',
    loaderFile: './src/sanity/lib/image-loader.ts',
  },
}

export default nextConfig
