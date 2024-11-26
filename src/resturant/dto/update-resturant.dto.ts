import { PartialType } from '@nestjs/mapped-types';
import { CreateResturantDto } from './create-resturant.dto';

export class UpdateResturantDto extends PartialType(CreateResturantDto) {}
