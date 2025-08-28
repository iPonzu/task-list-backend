export class Task {
  private static tasks: Task[] = [];
  private static currentId = 1;

  public id: number;
  public title: string;
  public description?: string;
  public status: 'pendente' | 'em progresso' | 'concluída';
  public dueDate?: Date;
  public listId: number;
  public userId: number;

  constructor(
    title: string,
    userId: number,
    listId: number,
    status: 'pendente' | 'em progresso' | 'concluída' = 'pendente',
    description?: string,
    dueDate?: Date
  ) {
    this.id = Task.currentId++;
    this.title = title;
    this.userId = userId;
    this.listId = listId;
    this.status = status;
    this.description = description;
    this.dueDate = dueDate;
  }

  static create(data: {
    title: string;
    userId: number;
    listId: number;
    status?: 'pendente' | 'em progresso' | 'concluída';
    description?: string;
    dueDate?: Date;
  }) {
    const task = new Task(
      data.title,
      data.userId,
      data.listId,
      data.status,
      data.description,
      data.dueDate
    );
    Task.tasks.push(task);
    return task;
  }

  static getAll(userId: number, filters?: { status?: string; dueDate?: string; listId?: number }) {
    let userTasks = Task.tasks.filter(t => t.userId === userId);

    if (filters?.status) userTasks = userTasks.filter(t => t.status === filters.status);
    if (filters?.dueDate) {
      const dateFilter = new Date(filters.dueDate).toDateString();
      userTasks = userTasks.filter(t => t.dueDate?.toDateString() === dateFilter);
    }
    if (filters?.listId) userTasks = userTasks.filter(t => t.listId === filters.listId);

    return userTasks;
  }

  static getById(id: number, userId: number) {
    return Task.tasks.find(t => t.id === id && t.userId === userId);
  }

  static update(id: number, userId: number, data: Partial<Omit<Task, 'id' | 'userId'>>) {
    const task = Task.getById(id, userId);
    if (!task) return null;
    Object.assign(task, data);
    return task;
  }

  static delete(id: number, userId: number) {
    const index = Task.tasks.findIndex(t => t.id === id && t.userId === userId);
    if (index >= 0) return Task.tasks.splice(index, 1)[0];
    return null;
  }
}
