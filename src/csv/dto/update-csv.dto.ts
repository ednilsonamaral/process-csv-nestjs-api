import { PartialType } from '@nestjs/mapped-types';
import { CreateCsvDto } from './create-csv.dto';

export class UpdateCsvDto extends PartialType(CreateCsvDto) {}
