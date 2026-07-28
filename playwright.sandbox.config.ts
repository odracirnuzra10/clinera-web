import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Solo para correr los E2E dentro del sandbox: mismo config del repo apuntando al
// Chromium ya instalado acá (la versión pineada espera un headless-shell ausente).
export default defineConfig({
  ...base,
  use: {
    ...base.use,
    launchOptions: { executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" },
  },
  webServer: undefined,
});
