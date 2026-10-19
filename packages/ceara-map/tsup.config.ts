import { copyFile, readFile, writeFile } from "node:fs/promises";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts", data: "src/data.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react"],
  async onSuccess() {
    // the component holds state, so the main entry is "use client" (Next.js App Router);
    // the "data" entry has no directive so it can be used from Server Components
    for (const file of ["dist/index.js", "dist/index.cjs"]) {
      const code = await readFile(file, "utf8");
      if (!code.startsWith('"use client"')) await writeFile(file, `"use client";\n${code}`);
    }
    await copyFile("src/styles.css", "dist/styles.css");
  },
});
