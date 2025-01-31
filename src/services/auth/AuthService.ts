import { DbService } from '../dbService';
import { Helper } from '../../utils/Helper';
import { DEFAULT_ROLE_PERMISSIONS } from '../../constants/rolePermissions';

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    name: string;
  }) {
    const hashedPassword = await Helper.hashPassword(userData.password);
    
    const user = await DbService.create('user', {
      ...userData,
      password: hashedPassword
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await DbService.findOne('user', { email });
    if (!user) throw new Error('User not found');

    const isValid = await Helper.comparePassword(password, user.password);
    if (!isValid) throw new Error('Invalid password');

    const token = Helper.generateToken(user);
    return { user, token };
  }
}
