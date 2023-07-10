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

  promoteUserAndGetSubs = (user, createdUserId) => {
    user.role = "Boss";
    user.subordinates.push(createdUserId);

    return user.save();
  };

  findUserById = (userId) => {
    return User.findById(userId).select("-password");
  };

  updateUser = (user, updates) => {
    user.name = updates.name || user.name;
    user.email = updates.email || user.email;

    if (updates.password) {
      user.password = updates.password;
    }

    return user.save();
  };

  isAdminExists = () => {
    const collectionLength = User.countDocuments();
    const isAdminExists = User.findOne({ role: "Administrator" });

    return !collectionLength || !isAdminExists ? undefined : isAdminExists;
  };
}

export default UserRepository;
