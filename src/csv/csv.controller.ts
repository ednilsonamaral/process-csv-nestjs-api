import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as xlsx from 'xlsx';

import { CsvService } from './csv.service';

import { CreateCsvDto } from './dto/create-csv.dto';

import { ICreateCSV } from './interfaces/create-csv.interface';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.includes('excel') ||
          file.originalname.match(/\.(csv|xlsx)$/)
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only Excel files are allowed!'), false);
        }
      },
    }),
  )
  create(@UploadedFile() file: Express.Multer.File): Promise<ICreateCSV> {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

    return this.csvService.create(data as unknown as CreateCsvDto[]);
  }
}
