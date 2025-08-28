export class User {
  private static users: User[] = [];
  private static currentId = 1;

  public id: number;
  public username: string;
  public password: string;

  constructor(username: string, password: string) {
    this.id = User.currentId++;
    this.username = username;
    this.password = password; 
  }

  static create(username: string, password: string) {
    const user = new User(username, password);
    User.users.push(user);
    return user;
  }

  static findByUsername(username: string){
    return User.users.find(u => u.username === username)
  }

  static findById(id: number){
    return User.users.find(u => u.id === id)
  }
}
