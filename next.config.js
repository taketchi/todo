/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        PORT: process.env.PORT
    }
}

module.exports = nextConfig
