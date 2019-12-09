import { JWT_ENCRYPTION } from './../database/config';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config({ debug: true });

export interface IJwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

class Helpers {
  /**
   * generate the jwt for a user
   * @param {user} user IJwtPayload
   * @returns Promise<string>
   */
  public async generateToken(user: IJwtPayload): Promise<string> {
    const { id, email, isAdmin } = user;
    return this.encryptToken({
      id,
      email,
      isAdmin,
    });
  }

  /**
   * generate the jwt for a user
   * @param {data} data IJwtPayload
   * @returns Promise<string>
   */
  private encryptToken(data: IJwtPayload): string {
    const token = jwt.sign(data, JWT_ENCRYPTION, { expiresIn: '3d' });
    return token;
  }
}

export default Helpers;
