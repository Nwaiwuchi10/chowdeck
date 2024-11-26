import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/auth.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RandomService } from './utils/randomService';
import { Twilio } from 'twilio';

@Injectable()
export class AuthService {
  private readonly twilio = new Twilio(
    process.env.twilio_Account_SID,
    process.env.twilio_Auth_Token,
  );
  private readonly fromSMS = '+17433306894';
  private readonly fromWhatsApp = 'whatsapp:+14155238886'; // Twilio sandbox number for WhatsApp

  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,

    private readonly randomService: RandomService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }
  async signup(userData: any): Promise<any> {
    // Hash password and create user
    const newUser = new this.UserModel({
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
    });
    await newUser.save();

    // Generate verification token
    // const token = this.kbToken.generate();
    const token: any = this.randomService.getRandom(4);
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity
    await this.UserModel.findByIdAndUpdate(newUser._id, {
      verificationToken: token,
      tokenExpiry,
    });

    // Send token via SMS and WhatsApp
    await this.sendVerificationToken(newUser.phoneNumber, token);

    return { message: 'Signup successful. Verification token sent.' };
  }

  private async sendVerificationToken(
    phoneNumber: string,
    token: string,
  ): Promise<void> {
    const toPhoneNumber = `+${phoneNumber}`;
    // const toPhoneNumber = '+2348136757488';

    // Send SMS
    await this.twilio.messages.create({
      body: `Your verification code is: ${token}`,
      from: this.fromSMS,
      to: toPhoneNumber,
    });

    // Send WhatsApp
    await this.twilio.messages.create({
      body: `Your verification code is: ${token}`,
      from: this.fromWhatsApp,
      to: `whatsapp:${toPhoneNumber}`,
    });
  }

  async verifyToken(phoneNumber: string, token: string): Promise<any> {
    const user = await this.UserModel.findOne({ phoneNumber });

    if (!user) throw new Error('User not found');
    if (user.verificationToken !== token || user.tokenExpiry < new Date()) {
      throw new Error('Invalid or expired token');
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.tokenExpiry = null;
    await user.save();

    return { message: 'Verification successful' };
  }

  // async CreateAccount(signupData: CreateAuthDto) {
  //   const {
  //     email,
  //     password,
  //     firstName,
  //     lastName,

  //     phoneNumber,
  //     address,

  //   } = signupData;

  //   // Check if email is in use
  //   const emailInUse = await this.UserModel.findOne({ email });
  //   if (emailInUse) {
  //     throw new BadRequestException('Email already in use');
  //   }

  //   // Hash password
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   // Create user document and save in MongoDB
  //   const newUser = new this.UserModel({
  //     email,
  //     password: hashedPassword,
  //     firstName,
  //     address,
  //     lastName,
  //     phoneNumber,

  //   });

  //   await newUser.save();
  //   try {
  //     await this.mailService.signupMail(email, firstName, lastName);
  //   } catch (error) {
  //     throw new Error(`Failed to send email to ${email}`);
  //   }
  //   // Prepare JWT payload and sign the token
  //   const payload = {
  //     email: newUser.email,
  //     sub: newUser._id,
  //     firstName: newUser.firstName,
  //     lastName: newUser.lastName,
  //     phoneNumber: newUser.phoneNumber,

  //     address: newUser.address,

  //   };

  //   const token = this.jwtService.sign(payload);

  //   return {
  //     token,
  //     user: {
  //       _id: newUser._id,
  //       email: newUser.email,
  //       firstName: newUser.firstName,
  //       lastName: newUser.lastName,
  //       address: newUser.address,
  //       phoneNumber: newUser.phoneNumber,

  //     },
  //   };
  // }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
