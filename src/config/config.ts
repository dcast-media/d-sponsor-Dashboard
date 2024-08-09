import devConfig from "@/config/config.dev";
import prodConfig from "@/config/config.prod";

const config = process.env.NEXT_PUBLIC_CONFIG_MODE === "dev" ? devConfig : prodConfig;

export default config;
