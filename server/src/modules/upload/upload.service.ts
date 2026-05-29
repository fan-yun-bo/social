import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class UploadService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(FileEntity) private readonly files: Repository<FileEntity>,
  ) {}

  async saveImage(file: Express.Multer.File, scene = 'post', userId?: string) {
    const root = this.config.get<string>('UPLOAD_DIR', 'uploads');
    const datePath = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
    const dir = join(process.cwd(), root, datePath);
    mkdirSync(dir, { recursive: true });
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}${extname(file.originalname)}`;
    const filePath = join(dir, fileName);
    writeFileSync(filePath, file.buffer);
    const urlPath = `/${root}/${datePath}/${fileName}`;
    const baseUrl = this.config.get<string>('PUBLIC_BASE_URL', 'http://localhost:3000');
    return this.files.save(this.files.create({
      userId,
      fileUrl: `${baseUrl}${urlPath}`,
      filePath,
      fileName,
      originalName: file.originalname,
      fileType: 'image',
      mimeType: file.mimetype,
      fileSize: file.size,
      scene,
    }));
  }

  list() { return this.files.find({ order: { createdAt: 'DESC' } }); }
}
