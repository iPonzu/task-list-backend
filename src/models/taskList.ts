export class List {
  private static lists: List[] = [];
  private static currentId = 1;

  public id: number;
  public name: string;
  public userId: number;

  constructor(name: string, userId: number) {
    this.id = List.currentId++;
    this.name = name;
    this.userId = userId;
  }

  static create(name: string, userId: number) {
    const list = new List(name, userId);
    List.lists.push(list);
    return list;
  }

  static getAll(userId: number) {
    return List.lists.filter(l => l.userId === userId);
  }

  static getById(id: number, userId: number) {
    return List.lists.find(l => l.id === id && l.userId === userId);
  }

  static update(id: number, userId: number, name: string) {
    const list = List.getById(id, userId);
    if (list) list.name = name;
    return list;
  }

  static delete(id: number, userId: number) {
    const index = List.lists.findIndex(l => l.id === id && l.userId === userId);
    if (index >= 0) return List.lists.splice(index, 1)[0];
    return null;
  }
}
