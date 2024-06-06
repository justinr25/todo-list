const form = document.querySelector("form")
const input = document.querySelector("[name='todo']")
const todoList = document.getElementById("todoList")

const addTodo = (todo) => {
	const li = document.createElement("li")
	li.innerHTML = todo
	todoList.appendChild(li)
}

form.onsubmit = () => {
	event.preventDefault()
	addTodo(input.value)
	form.reset()
}
