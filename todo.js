'use strict'

const todoInput = document.querySelector('.todo-input');
const addTodoButton = document.querySelector('.add-todo');
const todoContainer = document.querySelector('.todo-container');
let storageId = 1;

const deleteStorage = (id) => {
      document.querySelector(`[data-id="${id}"]`).parentElement.remove();  
      localStorage.removeItem(id);
   }

const addDeleteEventListener = (id) => document.querySelector(`[data-id="${id}"]`)
         .addEventListener('click', () => deleteStorage(id));

const createTodo = (text, id) => {
   const todoItem = document.createElement('div');
   todoItem.classList.add('todo-item');
   todoItem.innerHTML = `<input type="checkbox" class="set-completed" name="set-completed" data-setid="${id}">${text} <button class="delete-button" data-id="${id}"><i class="far fa-trash-alt"></i></button>`;
   todoContainer.insertBefore(todoItem, todoContainer.firstChild);
}

const addTodo = () => {
   if (todoInput.value) {
      createTodo (todoInput.value, storageId);
      localStorage.setItem(storageId.toString(), todoInput.value);
      addDeleteEventListener (storageId);
      todoInput.value = '';
      storageId +=1; 
   }
}

Object.keys(localStorage).forEach((key) => {
   createTodo(localStorage.getItem(key), key)
   addDeleteEventListener(key);
   if(parseInt(key) >= storageId) storageId = parseInt(key) + 1;
});

const addTodoClickListener = () => addTodoButton.addEventListener('click', addTodo)
addTodoClickListener()

/* date */
const date = new Date();
const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
const dayName = days[date.getDay()];
document.querySelector('.date').innerHTML = date.toLocaleDateString('hu', {year: 'numeric', month: 'long', day: 'numeric'});
document.querySelector('.day').innerHTML = days[date.getDay()];;

/* pending items */
const pendingItems = document.querySelector('.pendingItems span')
const updatePendingItems = () => {pendingItems.innerHTML = localStorage.length,
   setTimeout(updatePendingItems, 100);
 }
 updatePendingItems()

