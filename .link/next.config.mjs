import nextra from "nextra";

/** @type {import('nextra').NextraConfig} */
const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.js',
  readingTime: true,
  latex: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // any configs you need
}

export default withNextra(nextConfig)
