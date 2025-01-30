import DbService from '../dbService';

class UserService {
  private dbService: DbService;

  constructor(dbService: DbService) {
    this.dbService = dbService;
  }

  async getUser(userId: string) {
    // Kullanıcı bilgilerini getirme işlemleri
  }

  async updateUser(userId: string, userData: any) {
    // Kullanıcı güncelleme işlemleri
  }
}

export default UserService; 