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
}


//testar criar um usuario
describe ('user interface', () => {
    it('criar um usuário válido', () => {
        const user: User = User.create("João", "senha123");
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("password");
    });
});
