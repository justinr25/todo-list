// get DOM elements
const form = document.querySelector("form")
const input = document.querySelector("[name='todo']")
const todoList = document.getElementById("todoList")

// load todos from local storage
const existingTodos = JSON.parse(localStorage.getItem('todos'))
const todoData = existingTodos || []

// define function that adds todo to todo list
const addTodo = (todo) => {
	// add todo list element
	const li = document.createElement("li")
	li.innerHTML = todo
	todoList.appendChild(li)

	// store todo in array and save to local storage
	todoData.push(todo)
	localStorage.setItem('todos', JSON.stringify(todoData))
}

// add todo to todo list
form.onsubmit = (event) => {
	event.preventDefault()
	addTodo(input.value)
	form.reset()
}
