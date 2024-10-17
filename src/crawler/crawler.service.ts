import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {
  async scrapeRecruitInfo() {
    try {
      const url = 'https://www.skcareers.com/Recruit';

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      let jobListings = [];

      while (true) {
        const newJobListings = await page.evaluate(() => {
          const jobs = [];
          const jobElements = document.querySelectorAll('.list-item');

          jobElements.forEach((job) => {
            const title = job.querySelector('.title')?.textContent?.trim();
            const category = job.querySelector('.jobRole')?.textContent?.trim();
            const link = job.querySelector('a.list-link')?.getAttribute('href');

            if (title) {
              jobs.push({ title, category, link });
            }
          });

          return jobs;
        });

        jobListings = [...jobListings, ...newJobListings];

        const isButtonVisible = await page.evaluate(() => {
          const button = document.querySelector('button.btnMoSearch');
          return button && window.getComputedStyle(button).display !== 'none';
        });

        if (!isButtonVisible) {
          break;
        }
        await page.click('button.btnMoSearch');

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      await browser.close();
      return jobListings;
    } catch (err) {
      console.error(err);
    }
  }
}
