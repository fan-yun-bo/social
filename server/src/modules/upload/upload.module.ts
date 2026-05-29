import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { AdminFilesController, UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [UploadController, AdminFilesController],
  providers: [UploadService],
})
export class UploadModule {}
