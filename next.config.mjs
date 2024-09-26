import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/getRequestConfig.ts");

/** @type {import("next").NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH === "/" ? "" : process.env.NEXT_PUBLIC_BASE_PATH,
    experimental: {
        optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    },
};

// eslint-disable-next-line import/no-default-export
export default withNextIntl(nextConfig);
