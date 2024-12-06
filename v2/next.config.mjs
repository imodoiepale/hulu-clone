// /** @type {import('next').NextConfig} */
// const nextConfig = {

//     images: {
//     domains: ['image.tmdb.org'],
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'dist',
    images: {
        domains: ['image.tmdb.org'],
        unoptimized: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    trailingSlash: true
};

export default nextConfig;
