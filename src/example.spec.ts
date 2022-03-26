import { firefox } from "playwright"
import { expect } from "@playwright/test"

interface ColorElement {
  id: string
  roundOfVanishing: number
  screenShotPath: string
}

(async () => {
  console.log("Starting scrapping the website...")

  // base browser setup
  // const browser = await firefox.launch({ headless: false, slowMo: 1000 })
  const browser = await firefox.launch()
  const page = await browser.newPage()
  // website specific
  await page.goto("http://philippe.cosentino.free.fr/productions/derivehtml5/")

  const toutTirer = page.locator("#touttirer")
  const genSuivantes = page.locator("#suivante")
  // const vanishedColorList: VanishedColorList = [{ id: "#0000", roundOfVanishing: 0 }]
  const vanishedColorList = [] as ColorElement[]
  let stopClicking = false
  let counter = 1

  await page.fill("#text_couleurs", "3")

  await expect(toutTirer).toHaveValue("Tout tirer")
  await expect(genSuivantes).toHaveValue("Génération suivante")

  await page.click("#demarre")

  await page.screenshot({ path: "./images/test_1/init_test.png" })

  while (!stopClicking) {
    // eslint-disable-next-line no-await-in-loop
    await toutTirer.click()

    // eslint-disable-next-line no-await-in-loop
    const svgChildNodesPaths = await page.$$eval(
      "#cadre2 > svg > path",
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (svgChildNodes) => {
        // the 2 last color excluded is the 2 other color that you can have
        // TODO disable tracking for this line according to the wanted number of color
        const svgChildNodesFilter = svgChildNodes.filter(
          (value) => value.getAttribute("stroke") !== "#000000"
            && value.getAttribute("stroke") !== "#a22fbf"
            && value.getAttribute("stroke") !== "#2f69bf"
        )

        return svgChildNodesFilter.map((element) => [
          element.getAttribute("d"),
          element.getAttribute("stroke")
        ])
      }
    )

    console.log("\nsvgChildNodesPath ==> ", svgChildNodesPaths)

    for (let i = 0; i < svgChildNodesPaths.length; i++) {
      const value = svgChildNodesPaths[i]
      const splitSvgPath = value[0]!.split(",")

      if (splitSvgPath[splitSvgPath.length - 1] === "260.5") {
        let alreadyExist = false

        vanishedColorList.forEach((value1) => {
          if (value1.id === value[1]) {
            alreadyExist = true
          }
        })

        if (!alreadyExist) {
          console.log(splitSvgPath)

          vanishedColorList.push({
            id: value[1]!,
            roundOfVanishing: counter,
            screenShotPath: `./images/test_1/color_disappear_${value[1]!}_${Math.floor(
              +new Date() / 1000
            )}.png`
          })

          // eslint-disable-next-line no-await-in-loop
          await page.screenshot({
            path: vanishedColorList[vanishedColorList.length - 1]
              .screenShotPath
          })

          console.log(
            `Color ${
              vanishedColorList[vanishedColorList.length - 1].id
            } is disappeared in round ${
              vanishedColorList[vanishedColorList.length - 1].roundOfVanishing
            }`
          )
        }
      } else {
        console.log(`Color ${value[1]!} is always alive in round ${counter}`)
      }

      console.log("\nvanishedColorLst ==> ", vanishedColorList)
    }

    if (vanishedColorList.length === 2) {
      stopClicking = true
      // eslint-disable-next-line no-await-in-loop
      await page.screenshot({
        path: "./images/test_1/end_test.jpg"
      })
    }

    counter += 1
    // eslint-disable-next-line no-await-in-loop
    await genSuivantes.click()
  }

  console.log("Scrapping has finished !!!")

  await browser.close()
})()
