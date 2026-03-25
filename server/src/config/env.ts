import "dotenv/config";

let loaded = false;

export function loadEnv() {
  if (loaded) return;
  loaded = true;
}

