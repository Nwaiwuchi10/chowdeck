import { Injectable } from '@nestjs/common';
import { CreateResturantDto } from './dto/create-resturant.dto';
import { UpdateResturantDto } from './dto/update-resturant.dto';

@Injectable()
export class ResturantService {
  create(createResturantDto: CreateResturantDto) {
    return 'This action adds a new resturant';
  }

  findAll() {
    return `This action returns all resturant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resturant`;
  }

  update(id: number, updateResturantDto: UpdateResturantDto) {
    return `This action updates a #${id} resturant`;
  }

  remove(id: number) {
    return `This action removes a #${id} resturant`;
  }
}
