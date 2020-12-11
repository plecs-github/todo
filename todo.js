'use strict'
const todoInput = document.querySelector('.todo-input');
const addTodoButton = document.querySelector('.add-todo');
const todoContainer = document.querySelector('.todo-container');
const completedContainer = document.querySelector('.completed-container');
const pendingItems = document.querySelector('.pendingItems span')
const showCompletedItems = document.querySelector('.completedItems span')
const showHideButton = document.querySelector('.show-hide');
const clearAllButton = document.querySelector('.clear-all');
let todoCounter = 0;
let storageId = 1;

const counterUpdater = (plus) => {
   if (plus) todoCounter += 1;
   else todoCounter -= 1;
   pendingItems.innerHTML = todoCounter;
}

const counterReset = () => {
   todoCounter = 0; 
   pendingItems.innerHTML = todoCounter;
}

const deleteStorage = (id) => {
   document.querySelector(`[data-id="${id}"]`).parentElement.remove();
   localStorage.removeItem(id);
   counterUpdater(false)
}

const addDeleteEventListener = (id) => document.querySelector(`[data-id="${id}"]`)
   .addEventListener('click', () => deleteStorage(id));
const addSetEventListener = (id) => document.querySelector(`[data-setid="${id}"]`)
   .addEventListener('click', () => todoCompleted(id));

const todoCompleted = (id) => {
   let valueString = localStorage.getItem(id);
   valueString = valueString.replace('"state":1}', '"state":2}');
   localStorage.setItem(id, valueString);
   const targetCheckbox = document.querySelector(`[data-setid="${id}"]`);
   const targetTodo = targetCheckbox.parentElement;
   targetCheckbox.disabled = true;
   targetTodo.remove();
   completedContainer.insertBefore(targetTodo, completedContainer.firstChild);
   counterUpdater(false)
}

const createTodo = (text, id, state) => {
   let isChecked = "";
   let parentContainer = todoContainer;
   const todoItem = document.createElement('div');
   todoItem.classList.add('todo-item');
   if (parseInt(state) === 2) {
      parentContainer = completedContainer;
      isChecked = 'checked disabled';
   } else {
      counterUpdater(true)
   }
   todoItem.innerHTML = `<input type="checkbox" ${isChecked} class="set-completed" name="set-completed" data-setid="${id}">${text}
      <button class="delete-button" data-id="${id}"><i class="far fa-trash-alt"></i></button>`;
   parentContainer.insertBefore(todoItem, parentContainer.firstChild);
}

const addTodo = () => {
   if (todoInput.value) {
      createTodo(todoInput.value, storageId, 1);
      localStorage.setItem(storageId.toString(), JSON.stringify(
         {
            todo: todoInput.value,
            state: 1,
         }
      ));
      addDeleteEventListener(storageId);
      addSetEventListener(storageId)
      todoInput.value = '';
      storageId += 1;
   }
}
/* Checking local storage at startup */
Object.keys(localStorage).forEach((key) => {
   const obj = JSON.parse(localStorage.getItem(key));
   createTodo(obj.todo, key, obj.state)
   addDeleteEventListener(key);
   addSetEventListener(key);
   if (parseInt(key) >= storageId) storageId = parseInt(key) + 1;
});

/* show/hide complete button */
const setShowHide = () => {
   const btnContent = showHideButton.textContent;
   const completedItemsHeader = document.querySelector('.completedItems')
   if (btnContent === 'Show complete') {
      completedContainer.classList.remove('hidden')
      completedItemsHeader.classList.remove('hidden')
      showHideButton.textContent = 'Hide complete'
   } else {
      completedContainer.classList.add('hidden');
      completedItemsHeader.classList.add('hidden');
      showHideButton.textContent = 'Show complete'
   }
}

const clearAll = () => {
   Object.keys(localStorage).forEach((key) => {
       const obj = JSON.parse(localStorage.getItem(key));
       if (parseInt(obj.state) === 1) {
           localStorage.removeItem(key);
           document.querySelector(`[data-setid="${key}"]`).parentElement.remove();
           counterReset();
       }
   });
}


const addTodoClickListener = () => addTodoButton.addEventListener('click', addTodo)

const showHideCompletedItems = () => showHideButton.addEventListener('click', setShowHide);

const clearAllClickListener = () => clearAllButton.addEventListener('click', clearAll);

addTodoClickListener()
showHideCompletedItems()
clearAllClickListener()

/* Displaying date */
const date = new Date();
const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
const dayName = days[date.getDay()];
document.querySelector('.date').innerHTML = date.toLocaleDateString('hu', { year: 'numeric', month: 'long', day: 'numeric' });
document.querySelector('.day').innerHTML = days[date.getDay()];;

/* Displaying completed items */

let completedItemsUpdate = () => {
  const completedItems = (1-(todoCounter/localStorage.length));
  showCompletedItems.innerHTML = (`${Math.round(completedItems*100)}%`)
  setTimeout (completedItemsUpdate, 300)
 };

completedItemsUpdate()