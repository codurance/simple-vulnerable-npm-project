import puppeteer from "puppeteer";
import path from "node:path";

// Function to get the current date and time formatted as YYYY-MM-DD_HH-MM-SS
function getFormattedDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

let pageIsReadyToPrint = false;

async function waitForPageToBeReady(page: any) {
  while (!pageIsReadyToPrint) {
    try {
      await page.waitForSelector("#loading-spinner", { hidden: true, timeout: 60000 });
      pageIsReadyToPrint = !(await page.$("#loading-spinner"));
    } catch (error) {
      console.info("The report is still loading, waiting for another 60 seconds...");
      pageIsReadyToPrint = false;
    }
  }
}

export async function createPdf() {
  const fileName = `software-quality-report_${getFormattedDateTime()}.pdf`;

  const pdfOutputPath = path.join(
    __dirname,
    "../../pdf-output",
    fileName,
  );

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--allow-file-access-from-files", "--no-sandbox", '--start-maximized'],
  });
  const [page] = await browser.pages();

  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(`http://localhost:4200/`);

  await waitForPageToBeReady(page);

  setTimeout(async () => {
    await page.pdf({
      path: pdfOutputPath,
      preferCSSPageSize: true,
      printBackground: true,
      omitBackground: true,
    });

    await browser.close();
  }, 10000);
}
