/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  FC, FormEvent, memo, useEffect, useState, useRef,
} from 'react';
import classNames from 'classnames';
import { Todo, TodoUpdateFields } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleRemoveTodo: (todoId: number) => void,
  handleUpdate: (id: number, data: TodoUpdateFields) => void,
  isLoading: boolean,
};

export const TodoItem: FC<Props> = memo((props) => {
  const {
    todo,
    handleRemoveTodo,
    handleUpdate,
    isLoading,
  } = props;
  const { id, completed, title } = todo;
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(todo.title);
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
    }
  }, [isDoubleClicked]);

  const handleTodoStatusChange = () => {
    handleUpdate(id, { completed: !completed });
  };

  const handleTitleChange = () => {
    setIsDoubleClicked(false);

    if (title === currentTitle) {
      return;
    }

    if (!currentTitle) {
      handleRemoveTodo(id);

      return;
    }

    handleUpdate(id, { title: currentTitle });
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
            ref={editField}
            onChange={(event) => setCurrentTitle(event.target.value)}
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDoubleClicked(true)}
            onKeyDown={() => {}}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleRemoveTodo(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              { 'is-active': isLoading },
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
