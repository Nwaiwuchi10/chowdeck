import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
// import { config } from 'process';
import { ResturantModule } from './resturant/resturant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // load: [config],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    ResturantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
