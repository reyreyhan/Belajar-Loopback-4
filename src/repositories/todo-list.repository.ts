import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Todo, TodoList, TodoListImage, TodoListRelations} from '../models';
import {TodoListImageRepository} from './todo-list-image.repository';
import {TodoRepository} from './todo.repository';

export class TodoListRepository extends DefaultCrudRepository<
  TodoList,
  typeof TodoList.prototype.id,
  TodoListRelations
> {
  public readonly todos: HasManyRepositoryFactory<
    Todo,
    typeof TodoList.prototype.id
  >;

  public readonly todoListImage: HasOneRepositoryFactory<
    TodoListImage,
    typeof TodoList.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TodoRepository')
    protected todoRepositoryGetter: Getter<TodoRepository>,
    @repository.getter('TodoListImageRepository')
    protected todoListImageRepositoryGetter: Getter<TodoListImageRepository>,
  ) {
    super(TodoList, dataSource);
    this.todoListImage = this.createHasOneRepositoryFactoryFor(
      'todoListImage',
      todoListImageRepositoryGetter,
    );
    this.registerInclusionResolver(
      'todoListImage',
      this.todoListImage.inclusionResolver,
    );
    this.todos = this.createHasManyRepositoryFactoryFor(
      'todos',
      todoRepositoryGetter,
    );
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);
  }

  public findByTitle(title: string) {
    return this.findOne({where: {title}});
  }
}
