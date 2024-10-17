import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { Job } from './entity/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
