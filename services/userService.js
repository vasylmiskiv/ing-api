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

  promoteUserAndGetSubs = (userToPromote, createdUserId) => {
    return this.userRepository.promoteUserAndGetSubs(
      userToPromote,
      createdUserId
    );
  };

  addSubordinates = (boss, userId) => {
    return this.userRepository.addSubordinates(boss, userId);
  };

  removeSubordinates = (boss, userId) => {
    return this.userRepository.removeSubordinates(boss, userId);
  };

  changeUserBoss = (user, bossId) => {
    return this.userRepository.changeUserBoss(user, bossId);
  };

  findUserById = (userId) => {
    return this.userRepository.findUserById(userId);
  };

  findUserByEmail = (email) => {
    return this.userRepository.findUserByEmail(email);
  };

  isAdminExists = () => {
    return this.userRepository.isAdminExists();
  };
}

export default UserService;
