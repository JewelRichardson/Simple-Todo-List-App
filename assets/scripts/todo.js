// DOM SELECTORS
const stateBtns = document.querySelector('.todo-app__state-btns');
const todoList = document.querySelector('.todo-app__list');
const addTodoBtn = document.querySelector('.todo-app__form-btn');
const addTodoInput = document.getElementById('todo-app__form-input');
const todosCompleted = document.querySelector('.todo-app__todos-completed');

// STATE
let todos = [];
let completedTodos;
let activeTodos;

// FUNCTIONS
const clearInputFields = (...inputs) => {
  inputs.forEach(input => {
    input.value = '';
    input.focus();
  });
};

const renderTodos = todo => {
  // prettier-ignore
  const html = `
        <li class="todo-app__item" id="${todo.id}">
            <div class="todo-app__item-edit">
                <label for="todo-app__edit-input-${todo.id}" class="todo-app__edit-label">New name for '${todo.todo}'</label>
                <input type="text" id="todo-app__edit-input-${todo.id}" class="todo-app__edit-input"/>
                <button class="btn btn--cancel" data-cancel="${todo.id}">Cancel</button>
                <button class="btn btn--save" data-save="${todo.id}">Save</button>
            </div>
            <div class="todo-app__item-save">
                <div class="todo-app__item-todo">
                    <div class="todo-app__item-checkbox ${todo.completed ? 'todo-app__item-checkbox--completed' : ''}" data-check-id="${todo.id}"></div>
                    <p class="todo-app__item-content">${todo.todo}</p>
                </div>
                <button class="btn btn--edit" data-edit="${todo.id}">Edit</button>
                <button class="btn btn--delete" data-delete="${todo.id}">Delete</button>
            </div>
        </li>
    `;
  todoList.insertAdjacentHTML('afterbegin', html);
};

const updateHeader = () => {
  let numCompleted = todos.filter(todo => todo.completed).length;
  let totalCompleted = todos.length;
  if (todos.length === 0) {
    todosCompleted.style.display = 'none';
  } else {
    todosCompleted.style.display = 'block';
    todosCompleted.textContent = `${numCompleted} out of ${totalCompleted} items completed`;
  }
};

const addTodoToLS = todos => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const getTodosFromLS = () => {
  todos = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
  todos.forEach(todo => renderTodos(todo));
  updateHeader();
};

// EVENT HANDLERS
const addTodo = e => {
  e.preventDefault();
  if (addTodoInput.value === '') return alert('Please enter a task');
  const todo = addTodoInput.value;
  const todoObj = {
    id: Math.random().toString(),
    completed: false,
    todo
  };
  todos.push(todoObj);
  addTodoToLS(todos);
  renderTodos(todoObj);
  updateHeader();
  clearInputFields(addTodoInput);
};

// EVENT LISTENERS
stateBtns.addEventListener('click', e => {
  if (e.target.classList.contains('todo-app__state-btn')) {
    const stateBtn = e.target;
    Array.from(stateBtns.children, btn => {
      btn.classList.remove('todo-app__state-btn--active');

      stateBtn === btn && btn.classList.add('todo-app__state-btn--active');
    });
  }

  if (e.target.dataset.state === 'all') {
    todoList.innerHTML = '';
    todos.length > 0 && todos.forEach(todo => renderTodos(todo));
  } else if (e.target.dataset.state === 'active') {
    todoList.innerHTML = '';
    activeTodos = todos.filter(todo => !todo.completed);
    activeTodos.length > 0 && activeTodos.forEach(todo => renderTodos(todo));
  } else if (e.target.dataset.state === 'completed') {
    todoList.innerHTML = '';
    completedTodos = todos.filter(todo => todo.completed);
    completedTodos.length > 0 &&
      completedTodos.forEach(todo => renderTodos(todo));
  }
});

todoList.addEventListener('click', e => {
  // CHECKBOX FUNCTIONALITY
  if (e.target.classList.contains('todo-app__item-checkbox')) {
    const checkbox = e.target;
    checkbox.classList.toggle('todo-app__item-checkbox--completed');
    todos.forEach(todo => {
      if (todo.id === checkbox.dataset.checkId) {
        todo.completed = !todo.completed;
      }
    });
    addTodoToLS(todos);
    updateHeader();
  }

  // EDIT FUNCTIONALITY
  if (e.target.classList.contains('btn--edit')) {
    console.log(11);
    const editBtn = e.target;
    const todoItems = document.querySelectorAll('.todo-app__item');
    todoItems.forEach(item => {
      if (item.id === editBtn.dataset.edit) {
        item.classList.add('edit-mode');
      }
    });
  }

  // CANCEL EDIT FUNCTIONALITY

  if (e.target.classList.contains('btn--cancel')) {
    const cancelBtn = e.target;
    const todoItems = document.querySelectorAll('.todo-app__item');
    todoItems.forEach(item => {
      if (item.id === cancelBtn.dataset.cancel) {
        item.classList.remove('edit-mode');
      }
    });
  }

  // DELETE FUNCTIONALITY

  if (e.target.classList.contains('btn--delete')) {
    const deleteBtn = e.target;
    todos.forEach((todo, index, arr) => {
      if (deleteBtn.dataset.delete === todo.id) {
        arr.splice(index, 1);
        deleteBtn.closest('.todo-app__item').remove();
        todos = arr;
        addTodoToLS(todos);
        updateHeader();
      }
    });
  }

  // SAVE FUNCTIONALITY

  if (e.target.classList.contains('btn--save')) {
    const saveBtn = e.target;
    const editInput = document.getElementById(
      `todo-app__edit-input-${saveBtn.dataset.save}`
    );

    if (editInput.value === '') return alert('Please enter a value');

    todos.forEach(todo => {
      if (saveBtn.dataset.save === todo.id) {
        todo.todo = editInput.value;
        saveBtn
          .closest('.todo-app__item')
          .querySelector('.todo-app__item-content').textContent = todo.todo;
        saveBtn.closest('.todo-app__item').classList.remove('edit-mode');
        saveBtn
          .closest('.todo-app__item')
          .querySelector(
            '.todo-app__edit-label'
          ).textContent = `New name for '${todo.todo}'`;
        addTodoToLS(todos);
        clearInputFields(editInput);
      }
    });
  }
});

addTodoBtn.addEventListener('click', addTodo);
document.addEventListener('DOMContentLoaded', getTodosFromLS);
