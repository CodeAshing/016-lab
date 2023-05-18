import { Injectable } from '@nestjs/common';

const bcrypt = require('bcrypt');
@Injectable()
export class Helper {
  async generateHash(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
