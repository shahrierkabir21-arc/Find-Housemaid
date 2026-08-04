import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileImageValidationPipe implements PipeTransform {
  transform(file: any) {
    const maxSize = 2 * 1024 * 1024; // 2 MB

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    if (file.size > maxSize) {
      throw new BadRequestException('Image size must be maximum 2 MB');
    }

    return file;
  }
}