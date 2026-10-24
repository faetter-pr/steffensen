import { defineConfig } from "storyblok/config";
import { loadEnvironment, readSettings } from "./scripts/storyblok.mjs";

loadEnvironment();
const { space, region } = readSettings(process.env, false);

export default defineConfig({
  space,
  region,
  path: ".storyblok",
});
