import { test, expect } from "@playwright/test"

test("basic test", async ({ page }) => {
  page.once("load", async () => {
    const title = page.locator("#demarre")
    const toutTirer = page.locator("#touttirer")
    const genSuivantes = page.locator("#suivante")

    await page.goto(
      "http://philippe.cosentino.free.fr/productions/derivehtml5/"
    )
    await expect(title).toHaveValue("Démarrer")

    await page.fill("#text_nombre", "16")
    await page.fill("#text_couleurs", "3")

    for (let i = 0; i < 3; i++) {
      expect(toutTirer).toHaveValue("Tout tirer")
      expect(genSuivantes).toHaveValue("Génération suivante")

      page
        .locator("#cadre2")
        .screenshot({ path: `./images/basic_test/basic_test_${i + 1}.png` })
    }
  })
})
