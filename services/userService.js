class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getUsers = () => {
    return this.userRepository.getUsers();
  };

  getSubordinates = (bossId) => {
    return this.userRepository.getSubordinates(bossId);
  };

  authUser = async ({ email, password }) => {
    const user = await this.findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      return user;
    }

    return null;
  };

  createUser = (userToCreate) => {
    return this.userRepository.createUser(userToCreate);
  };

  promoteUserAndGetSubs = (user, createdUserId) => {
    return this.userRepository.promoteUserAndGetSubs(user, createdUserId);
  };

  findUserById = (userId) => {
    return this.userRepository.findUserById(userId);
  };

  findUserByEmail = (email) => {
    return this.userRepository.findUserByEmail(email);
  };

  updateUser = (user, updates) => {
    return this.userRepository.updateUser(user, updates);
  };

  isAdminExists = () => {
    return this.userRepository.isAdminExists();
  };
}

export default UserService;
