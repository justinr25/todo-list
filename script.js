// get DOM elements
const newTodoForm = document.querySelector('[data-new-todo-form]')
const newTodoInput = document.querySelector('[name=todo]')
const todosContainer = document.querySelector('[data-todos]')
const tasksRemainingElement = document.querySelector('[data-tasks-remaining]')
const clearButton = document.querySelector('[data-clear-button]')
const dropdown = document.querySelector('[data-dropdown]')
const dropdownBtn = document.querySelector('[data-dropdown-btn]')
const dropdownContent = document.querySelector('[data-dropdown-content]')
const optionBtns = document.querySelectorAll('[data-option-btn]')
const dueDateCalendar = document.querySelector('[data-due-date-calendar]')
const dueDateText = document.querySelector('[due-date-text]')

// define globals
const LOCAL_STORAGE_LIST_KEY = 'task.list'
const priorityFlags = {
    'No Priority': './assets/no-priority-flag.png',
    'Low Priority': './assets/low-priority-flag.png',
    'Medium Priority': './assets/medium-priority-flag.png',
    'High Priority': './assets/high-priority-flag.png'
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
    //         <p>Due Date</p>
    //     </label>
    // </div>

    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo')

    const tempCheckbox = document.createElement('input')
    tempCheckbox.type = 'checkbox'
    tempCheckbox.id = todo.id
    tempCheckbox.checked = todo.complete

    const todoLabel = document.createElement('label')
    todoLabel.setAttribute('for', todo.id)

    const customCheckbox = document.createElement('span')
    customCheckbox.classList.add('custom-checkbox')
    customCheckbox.classList.add(todo.priority.split(' ').join('-').toLowerCase())

    const todoName = document.createElement('p')
    todoName.innerHTML = todo.name

    const dueDate = document.createElement('p')
    dueDate.innerHTML = todo.dueDate
    dueDate.classList.add('due-date-text')

    todoLabel.appendChild(customCheckbox)
    todoLabel.appendChild(todoName)
    todoLabel.appendChild(dueDate)
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
const createTodo = (name, priority, dueDate) => {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false,
        priority: priority,
        dueDate: dueDate
    }
}

// define function that adds todos to the todo list array
const addTodo = (name, priority, dueDate) => {
    newTodo = createTodo(name, priority, dueDate)
    todoData.push(newTodo)
}

// define function to toggle dropdown menu
const toggleDropdown = () => {
    if (dropdown.hasAttribute('data-active')) {
        delete dropdown.dataset.active
    } else {
        dropdown.dataset.active = ''
    }
}

// define function that formats date
const formatDate = (date) => {
    if (date.indexOf('-') >= 0) {
        // input date format to locale date string
        const dateArr = date.split('-')
        const year = dateArr[0]
        const month = dateArr[1].replace(/^0+/, '')
        const day = dateArr[2].replace(/^0+/, '')
        const formattedDate = `${month}/${day}/${year}`
        return formattedDate
    } else {
        // locale date string to required input date format
        const dateArr = date.split('/')
        const year = dateArr[2]
        const month = dateArr[0].padStart(2, '0')
        const day = dateArr[1].padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }
}

// define function that handles date being changed
const dueDateHandler = (dueDateValue) => {
    const today = new Date()
    const todayFormattedDate = today.toLocaleDateString('en-US')
    const tomorrow = new Date(today.getTime() + 24 * 3600 * 1000)
    const tomorrowFormattedDate = tomorrow.toLocaleDateString('en-US')

    if (dueDateValue === todayFormattedDate) {
        return 'Today'
    } else if (dueDateValue === tomorrowFormattedDate) {
        return 'Tomorrow'
    } else {
        return dueDateValue
    }
}

// handle due date value being changed
dueDateCalendar.addEventListener('change', (e) => {
    const dueDateValue = formatDate(dueDateCalendar.value)
    dueDateText.innerHTML = dueDateHandler(dueDateValue)
})

// handle setting default due date to today on page load
document.addEventListener('DOMContentLoaded', (e) => {
    const dueDateValue = formatDate(new Date().toLocaleDateString('en-US'))
    dueDateCalendar.value = formatDate(new Date().toLocaleDateString('en-US'))
})

// handle dropdown button being clicked
dropdownBtn.addEventListener('click', (e) => {
    e.preventDefault()
    toggleDropdown()
})

// handle dropdown menu being clicked off of
addEventListener('click', (e) => {
    if (!e.target.closest('[data-dropdown-btn]')) {
        delete dropdown.dataset.active
    }
})

// handle option buttons being clicked
optionBtns.forEach((optionBtn) => {
    optionBtn.addEventListener('click', (e) => {
        e.preventDefault()

        // change dropdown button based on priority selected
        const priority = optionBtn.dataset.priority
        const priorityFlag = priorityFlags[priority]

        dropdownBtn.querySelector('img').setAttribute('src', priorityFlag)
        dropdownBtn.querySelector('img').setAttribute('alt', priority + ' Flag')
        dropdownBtn.querySelector('p').innerHTML = priority
        dropdownBtn.dataset.priority = priority

        delete dropdown.dataset.active
    })
})

// handle new task event
newTodoForm.addEventListener('submit', e => {
    e.preventDefault()

    const newTodoName = newTodoInput.value
    const priority = dropdownBtn.dataset.priority
    const dueDate = dueDateHandler(formatDate(dueDateCalendar.value))

    if (newTodoName == null || newTodoName == '') return
    addTodo(newTodoName, priority, dueDate)
    newTodoInput.value = null
    saveAndRender()
})

// handle checking on/off task event
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