import { Page } from "puppeteer";
import { Driver } from "../types/Driver";
import { createNew } from "../Service/drivers";
import { getSeasonDriver } from "./seasonDriver";
import { SeasonDriver } from "types/SeasonDriver";
const CRAWL_SELECTOR = require("../constants").CRAWL;

export const getDriver = async (page: Page, raceUrl: string) => {
  const driverUrl = raceUrl.replace('races', 'drivers');
  await page.goto(driverUrl);
  await page.waitForSelector(CRAWL_SELECTOR.DRIVER_INFO);
  const driverInfoElements = await page.$$(CRAWL_SELECTOR.DRIVER_INFO);
  let seasonDriver : SeasonDriver[] = [] 
  for (let driverInfoElement of driverInfoElements) {
    const firstName = await driverInfoElement.$eval(
      CRAWL_SELECTOR.DRIVER_FIRST_NAME,
      (firstName) => firstName.textContent.trim()
    );
    const lastName = await driverInfoElement.$eval(
      CRAWL_SELECTOR.DRIVER_LAST_NAME,
      (lastName) => lastName.textContent.trim()
    );
    const nationality = await driverInfoElement.$eval(
      CRAWL_SELECTOR.DRIVER_NATIONALITY,
      (nationality) => nationality.textContent.trim()
    );

    const carName = await driverInfoElement?.$eval(
      CRAWL_SELECTOR.DRIVER_CAR,
      (carName) => carName.textContent.trim()
    );
    
    const driver: Driver = {
      name: `${firstName} ${lastName}`,
      nationality: nationality,
    };    
    const newDriver = await createNew(driver) as Driver;
    seasonDriver.push(await getSeasonDriver(page, newDriver, carName));
  }
  return seasonDriver;
};
