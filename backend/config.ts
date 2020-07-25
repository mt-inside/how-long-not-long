const env = Deno.env.toObject();

export const APP_HOST = env.APP_HOST || "0.0.0.0";
export const APP_PORT = env.APP_PORT || 4000;
export const DB_PATH = env.DB_PATH || "/data/";
