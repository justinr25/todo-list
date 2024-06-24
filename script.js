// get DOM elements
const newTodoForm = document.querySelector('[data-new-todo-form]')
const newTodoInput = document.querySelector('[name=todo]')
const todosContainer = document.querySelector('[data-todos]')
const tasksRemainingElement = document.querySelector('[data-tasks-remaining]')
const clearButton = document.querySelector('[data-clear-button]')

// define globals
const LOCAL_STORAGE_LIST_KEY = 'task.list'
const priorityFlags = {
    'No Priority': 'assets/no-priority-flag.png',
    'Low Priority': 'assets/low-priority-flag.png',
    'Medium Priority': 'assets/medium-priority-flag.png',
    'High Priority': 'assets/high-priority-flag.png'
}

// define utility functions
const clearElement = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

// load and store todos from local storage
const todoData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

// define function to save
const save = () => {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(todoData))
}

// define function that renders a todo
const renderTodo = (todo) => {
    // <div class="todo">
    //     <input type="checkbox" id="task-1">
    //     <label for="task-1">
    //         <span class="custom-checkbox"></span>
    //         <p>Task 1</p>
    //     </label>
    // </div>

    const todoDiv = document.createElement('div')
    todoDiv.className = 'todo'

    const tempCheckbox = document.createElement('input')
    tempCheckbox.type = 'checkbox'
    tempCheckbox.id = todo.id
    tempCheckbox.checked = todo.complete

    const todoLabel = document.createElement('label')
    todoLabel.setAttribute('for', todo.id)

    const customCheckbox = document.createElement('span')
    customCheckbox.className = 'custom-checkbox'

    const todoName = document.createElement('p')
    todoName.innerHTML = todo.name

    todoLabel.appendChild(customCheckbox)
    todoLabel.appendChild(todoName)
    todoDiv.appendChild(tempCheckbox)
    todoDiv.appendChild(todoLabel)
    todosContainer.appendChild(todoDiv)
}

// define function that renders the count of remaining tasks
const renderRemainingTasksCount = () => {
    const incompleteTaskCount = todoData.filter(todo => !todo.complete).length
    const taskString = incompleteTaskCount === 1 ? 'Task' : 'Tasks'
    tasksRemainingElement.innerHTML = `${incompleteTaskCount} ${taskString} Remaining`
}

// define function to render
const render = () => {
    clearElement(todosContainer)
    todoData.forEach(todo => {
        renderTodo(todo)
    })
    renderRemainingTasksCount()
}

// define function to save and render
const saveAndRender = () => {
    save()
    render()
}

// define function that creates a todo
const createTodo = (name) => {
    return {id: Date.now().toString(), name: name, complete: false}
}
// const createTodo = (name, priority) => {
//     return {id: Date.now().toString(), name: name, priority: priority, complete: false}
// }

// define function that adds todos to the todo list array
const addTodo = (name) => {
    newTodo = createTodo(name)
    todoData.push(newTodo)
}

// handle new task event
newTodoForm.addEventListener('submit', e => {
    e.preventDefault()
    newTodoName = newTodoInput.value
    if (newTodoName == null || newTodoName == '') return
    addTodo(newTodoName)
    newTodoInput.value = null
    saveAndRender()
})

// handle checking off task event
todosContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedTask = todoData.find(todo => todo.id === e.target.id)
        selectedTask.complete = e.target.checked
        saveAndRender()
    }
})

// handle clear tasks event
clearButton.addEventListener('click', e => {
    clearElement(todosContainer)
    todoData.length = 0
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify([]))
    saveAndRender()
})

// render existing todos
render()