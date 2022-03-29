import { firefox } from "playwright"
import scrapWebsite from "./example";

(async () => {
  // base browser setup
  // const browser = await firefox.launch({ headless: false, slowMo: 1000 })
  const browser = await firefox.launch()

  console.log("\nBeginning the 1st test...")

  await scrapWebsite(3, 16, browser).then(() => console.log("1st test had finished!!!"))

  console.log("\nBeginning the 2nd test...")

  await scrapWebsite(3, 100, browser).then(() => console.log("2nd test had finished!!!"))

  await browser.close()
})()

// TODO add support for a config file (see the env var in shell.nix)
