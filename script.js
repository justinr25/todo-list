// get DOM elements
const form = document.querySelector("form")
const input = document.querySelector("[name='todo']")
const todoList = document.getElementById("todoList")

// load todos from local storage
const existingTodos = JSON.parse(localStorage.getItem('todos'))

// store todos from local storage
const todoData = existingTodos || []

// define function that adds todo to todo list without saving to local storage
const renderTodo = (todo) => {
    const li = document.createElement("li")
    li.innerHTML = todo
    todoList.appendChild(li)
}

// define function that adds todo and saves it to local storage
const addTodo = (todo) => {
	// render todo list element
	renderTodo(todo)

	// store todo in array and save to local storage
	todoData.push(todo)
	localStorage.setItem('todos', JSON.stringify(todoData))
}

// add todo to todo list
form.onsubmit = (event) => {
	event.preventDefault()
	
	// add inputted todo to todo list
	addTodo(input.value)

	// reset input field
	input.value = ''
}

form.onreset = (event) => {
	event.preventDefault()
	
	// clear todo list in DOM
	todoList.innerHTML = ''

	// clear todo list in local storage
	localStorage.setItem('todos', JSON.stringify([]))

	// clear todo list from array
	todoData.length = 0
}

// render todos from local storage
todoData.forEach(todo => {
	renderTodo(todo)
})