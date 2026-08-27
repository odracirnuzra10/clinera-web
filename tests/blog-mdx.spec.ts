import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const blogPage = readFileSync(
  join(process.cwd(), "src/app/blog/[slug]/page.tsx"),
  "utf8",
);
const instagramPost = readFileSync(
  join(
    process.cwd(),
    "src/content/posts/instagram-direct-facebook-messenger-clinera.mdx",
  ),
  "utf8",
);

test.describe("blog MDX: tablas GFM y logos de canal", () => {
  test("el renderer del blog activa remark-gfm", () => {
    expect(blogPage).toMatch(/remarkGfm/);
    expect(blogPage).toMatch(/remarkPlugins:\s*\[remarkGfm\]/);
  });

  test("el post de Instagram declara los logos de canal", () => {
    expect(instagramPost).toMatch(/heroChannels:\s*true/);
    expect(instagramPost).toContain("<ChannelMarks");
  });

  test("la comparación dental se ve como tabla, no como pipes crudos", async ({
    page,
  }) => {
    await page.goto(
      "/blog/odontograma-presupuestador-clinera-vs-dentalink-dentalsoft",
    );
    const table = page.locator("article table");
    await expect(table).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Sistema" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Dentalink" })).toBeVisible();
    await expect(page.locator("article")).not.toContainText("|---|");
  });

  test("Instagram, Facebook y WhatsApp se ven en el post de Direct", async ({
    page,
  }) => {
    await page.goto("/blog/instagram-direct-facebook-messenger-clinera");
    const marks = page.getByRole("list", {
      name: "Canales: Instagram, Facebook y WhatsApp",
    });
    await expect(marks.first()).toBeVisible();
    await expect(page.getByRole("img", { name: "Instagram" }).first()).toBeVisible();
    await expect(page.getByRole("img", { name: "Facebook" }).first()).toBeVisible();
    await expect(page.getByRole("img", { name: "WhatsApp" }).first()).toBeVisible();
  });
});
