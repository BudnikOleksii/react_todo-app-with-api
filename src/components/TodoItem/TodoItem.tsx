/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  FC, FormEvent, memo, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodoByTodoId, updateTodoByTodoId } from '../../api/todos';

type Props = {
  todo: Todo,
  handleError: (errorMsg: string) => void,
  handleUpdate: (bool: boolean) => void,
};

export const TodoItem: FC<Props> = memo(({
  todo,
  handleError,
  handleUpdate,
}) => {
  const { id, completed, title } = todo;
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveTodo = () => {
    setIsLoading(true);

    removeTodoByTodoId(id)
      .then(() => handleUpdate(true))
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleTodoChange = (data: {}) => {
    setIsLoading(true);

    updateTodoByTodoId(id, data)
      .then(() => handleUpdate(true))
      .catch(() => handleError('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleTodoStatusChange = () => {
    handleTodoChange({ completed: !completed });
  };

  const handleTitleChange = () => {
    setIsDoubleClicked(false);

    if (title === currentTitle) {
      return;
    }

    if (!currentTitle) {
      handleRemoveTodo();

      return;
    }

    handleTodoChange({ title: currentTitle });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleTitleChange();
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCurrentTitle(title);
        setIsDoubleClicked(false);
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoStatusChange}
        />
      </label>

      {isDoubleClicked ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={currentTitle}
            onChange={(event) => setCurrentTitle(event.target.value)}
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={(event) => {
              if (event.detail === 2) {
                setIsDoubleClicked(true);
              }
            }}
            onKeyDown={() => {}}
          >
            {currentTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleRemoveTodo}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              { 'is-active': isLoading }
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
});
