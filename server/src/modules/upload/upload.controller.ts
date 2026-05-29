import { Controller, Get, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Query('scene') scene: string, @CurrentUser() user: { sub: string }) {
    return this.uploadService.saveImage(file, scene, user.sub);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 9))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[], @Query('scene') scene: string, @CurrentUser() user: { sub: string }) {
    const list = await Promise.all(files.map((file) => this.uploadService.saveImage(file, scene, user.sub)));
    return { list };
  }
}

@Controller('admin/files')
@UseGuards(JwtAuthGuard)
export class AdminFilesController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  list() { return this.uploadService.list(); }
}
