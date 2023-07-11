import User from "../models/userModel.js";

class UserRepository {
  getUsers = () => {
    return User.find({}).select("-password");
  };

  getSubordinates = (boss) => {
    return User.find({ boss }).select("-password");
  };

  findUserByEmail = (email) => {
    return User.findOne({ email });
  };

  createUser = (userToCreate) => {
    return User.create(userToCreate);
  };

  promoteUserAndGetSubs = (userToPromote, createdUserId) => {
    if (userToPromote.role === "Regular User") {
      userToPromote.role = "Boss";
    }

    userToPromote.subordinates.push(createdUserId);

    return userToPromote.save();
  };

  removeSubordinates = (boss, userId) => {
    boss.subordinates.pull(userId);

    if (!boss.subordinates.length) {
      boss.role = "Regular User";
    }

    boss.save();
  };

  addSubordinates = (boss, userId) => {
    boss.subordinates.push(userId);

    if (boss.role !== "Boss") {
      boss.role = "Boss";
    }

    boss.save();
  };

  changeUserBoss = (user, nextBossId) => {
    user.boss = nextBossId;

    user.save();
  };

  findUserById = (userId) => {
    return User.findById(userId).select("-password");
  };

  isAdminExists = () => {
    const collectionLength = User.countDocuments();
    const isAdminExists = User.findOne({ role: "Administrator" });

    return !collectionLength || !isAdminExists ? undefined : isAdminExists;
  };
}

export default UserRepository;
