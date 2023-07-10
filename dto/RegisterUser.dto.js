export class RegisterUserDto {
  constructor(name, email, password, role, boss) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.boss = boss;
  }
}
