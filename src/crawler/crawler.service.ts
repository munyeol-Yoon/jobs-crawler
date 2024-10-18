import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import puppeteer from 'puppeteer';
import { CRAWLER_SK_URL } from 'src/constant/crawling.constant';
import { Repository } from 'typeorm';
import { Job } from './entity/job.entity';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async scrapeSKRecruitInfo() {
    try {
      const url = CRAWLER_SK_URL;

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

      for (const job of jobListings) {
        const existJob = await this.jobRepository.findOne({
          where: { link: job.link },
        });

        if (!existJob) {
          const jobEntity = this.jobRepository.create(job);
          await this.jobRepository.save(jobEntity);
        }
      }

      return jobListings;
    } catch (err) {
      console.error(err);
    }
  }
}
