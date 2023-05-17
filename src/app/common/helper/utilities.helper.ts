import { HttpException, Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
moment.tz.setDefault('Asia/Karachi');
import { ConfigService } from './../../../config/config.service';
const configService = new ConfigService();

import { salesUnitCalculationType, sendSMS } from '../type';
import * as fs from 'fs';

import { RoleEnum } from '../enum';

const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
@Injectable()
export class Helper {
  onlyUnique(value, index, self) {
    return (
      self.findIndex(
        (item) =>
          Object.values(item).toString() === Object.values(value).toString(),
      ) === index
    );
  }

  transformObjectToKey(values, key) {
    const returnedObject = {};
    values.map((item) => {
      returnedObject[item[key].toString()] = item;
    });
    return returnedObject;
  }

  getFields(input, field) {
    console.log('..2');
    const output = [];
    for (let i = 0; i < input.length; ++i)
      if (!output.includes(input[i][field].toString()))
        output.push(input[i][field].toString());
    console.log('..2');
    return output;
  }

  calculatePercentage(amount: number, percent: number): number {
    return (percent / 100) * amount;
  }

  removeDuplicates(arr) {
    return arr.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => String(t.block) === String(value.block)),
    );
  }

  generateUniqueCode(): number {
    const OTP = Math.floor(1000 + Math.random() * 9000);
    return OTP;
  }

  generateJWTForWeb(cnic: number, otp: number, expiresIn: string): any {
    return jwt.sign({ cnic: cnic, otp: otp }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
  }



  async generateHash(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

}
