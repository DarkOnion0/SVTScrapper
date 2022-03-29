import { Browser } from "playwright"
import { expect } from "@playwright/test"

interface ColorElement {
  id: string
  roundOfVanishing: number
  screenShotPath: string
}

interface VanishedColorList {
  settings: {
    colorNumber: number
    sphereNumber: number
  }
  data: Array<ColorElement>
}

async function scrapWebsite(
  colorNumber: number,
  sphereNumber: number,
  browser: Browser
) {
  console.log("Starting scrapping the website...")

  // This is the color order (from the top to the bottom)
  /* let colorList = [
    "#bf2f2f",
    "#a2bf2f",
    "#2fbf69",
    "#2f69bf",
    "#a22fbf"
  ].splice(colorNumber) */

  // const browser = await firefox.launch()
  const page = await browser.newPage()
  // website specific
  await page.goto("http://philippe.cosentino.free.fr/productions/derivehtml5/")

  const toutTirer = page.locator("#touttirer")
  const genSuivantes = page.locator("#suivante")
  // const vanishedColorList: VanishedColorList = [{ id: "#0000", roundOfVanishing: 0 }]
  const vanishedColorList = {
    settings: { colorNumber, sphereNumber },
    data: []
  } as VanishedColorList
  let stopClicking = false
  let counter = 1

  await page.fill("#text_couleurs", colorNumber.toString())
  await page.fill("#text_nombre", sphereNumber.toString())

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
      (svgChildNodes, number: number) => {
        // console.log("Scraping path and color from svg path...")

        const svgChildNodesFilter = svgChildNodes.filter(
          (value) => value.getAttribute("stroke") !== "#000000"
        )

        return svgChildNodesFilter
          .map((element) => [
            element.getAttribute("d"),
            element.getAttribute("stroke")
          ])
          .reverse()
          .splice(5 - number)
      },
      colorNumber
    )

    // console.log("\nsvgChildNodesPath ==> ", svgChildNodesPaths)

    for (let i = 0; i < svgChildNodesPaths.length; i++) {
      const value = svgChildNodesPaths[i]

      const splitSvgPath = value[0]!.split(",")

      if (splitSvgPath[splitSvgPath.length - 1] === "260.5") {
        let alreadyExist = false

        vanishedColorList.data.forEach((value1) => {
          if (value1.id === value[1]) {
            alreadyExist = true
          }
        })

        if (!alreadyExist) {
          // console.log(splitSvgPath)

          vanishedColorList.data.push({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: value[1]!,
            roundOfVanishing: counter,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            screenShotPath: `./images/test_1/color_disappear_${value[1]!}_${Math.floor(
              +new Date() / 1000
            )}.png`
          })

          // eslint-disable-next-line no-await-in-loop
          await page.screenshot({
            path: vanishedColorList.data[vanishedColorList.data.length - 1]
              .screenShotPath
          })

          console.log(
            `Color ${
              vanishedColorList.data[vanishedColorList.data.length - 1].id
            } is disappeared in round ${
              vanishedColorList.data[vanishedColorList.data.length - 1]
                .roundOfVanishing
            }`
          )
        }
      }
      // else {
      //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //   // console.log(`Color ${value[1]!} is always alive in round ${counter}`)
      // }
    }
    if (vanishedColorList.data !== null) {
      if (vanishedColorList.data.length === colorNumber - 1) {
        stopClicking = true
        // eslint-disable-next-line no-await-in-loop
        await page.screenshot({
          path: "./images/test_1/end_test.jpg"
        })

        console.log("\nvanishedColorLst ==> ", vanishedColorList)
      }
    }

    counter += 1
    // eslint-disable-next-line no-await-in-loop
    await genSuivantes.click()
  }

  console.log("Scrapping has finished !!!")
}

export default scrapWebsite
