import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerService } from './crawler/crawler.service';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [CrawlerModule],
  controllers: [AppController],
  providers: [AppService, CrawlerService],
})
export class AppModule {}
