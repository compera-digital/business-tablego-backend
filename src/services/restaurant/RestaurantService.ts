import { DbService } from '../dbService';
import { UserRole } from '@prisma/client';

export class RestaurantService {
  static async createRestaurant(data: any, userId: string) {
    const restaurant = await DbService.create('restaurant', data);

    // Restoran oluşturan kişiyi OWNER olarak ata
    await DbService.create('userRestaurantRole', {
      userId,
      restaurantId: restaurant.id,
      role: UserRole.OWNER
    });

    return restaurant;
  }

  static async addStaffMember(restaurantId: string, userId: string, role: UserRole) {
    return DbService.create('userRestaurantRole', {
      userId,
      restaurantId,
      role
    });
  }
} 