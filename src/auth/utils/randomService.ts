import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  getRandom(length: number): number {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
    );
  }
}
