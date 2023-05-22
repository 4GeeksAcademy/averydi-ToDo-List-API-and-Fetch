import React, {useEffect, useState} from "react";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState([]);
	const apiURL = "https://assets.breatheco.de/apis/fake/todos/user/";
	const username = "averydi"


	useEffect(() => {
		getItems()
	}, [])

	async function getItems() {
		const requestOptions = { method: 'GET' };
		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok) {
			// response passed
			let data = await response.json()
			setTodoList(data)
			return data
		
		} else {
			// response failed
			await response.json()
			setTodoList([])
			return []
		}
	}

	async function addItem(e) {
		if(e.code == "Enter") {
			if (todoList.length == 0) {
				// there are not items into the ToDo List
				await createFirstItem()
				let newTodoList = [...todoList, {label: task, done: false}]
				await updateItem(newTodoList)
				setTodoList(newTodoList)
				setTask("")
			} else {
				// there are items into the ToDo List
				let newTodoList = [...todoList, {label: task, done: false}]
				await updateItem(newTodoList)
				setTodoList(newTodoList)
				setTask("")
			}
		}
	}
	
	async function removeItem(index) {
		const newTodoList = [
			...todoList.slice(0, index),
			...todoList.slice(index + 1, todoList.length)
		];
		const raw = "";
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const requestOptions = { method: 'DELETE', body: raw }
		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok) {
			await response.json()
			if(todoList.length > 1) {
				await createFirstItem()
				await updateItem(newTodoList)
			}
			return setTodoList(newTodoList)
		} else {
			// response failed
			await response.json()
			console.log(response.status + ": " + response.statusText)

		}
	}

	async function checkTodo(index) {
		let newTodoList = [...todoList]
		newTodoList[index].done = !newTodoList[index].done
		if(await updateItem(newTodoList) != -1) {
			setTodoList(newTodoList)
		}
	}

	async function updateItem(todoList) {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify(todoList);
		const requestOptions = { method: 'PUT', headers: myHeaders, body: raw };

		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok) {
			await response.json()
			return response
		} else {
			// response failed
			await response.json()
			console.log(response.status + ": " + response.statusText)
			return -1
		}
	}

	async function createFirstItem() {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify([]);
		const requestOptions = { method: 'POST', headers: myHeaders, body: raw };
		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok) {
			await response.json()
			return []
		} else {
			// response failed
			await response.json()
			console.log(response.status + ": " + response.statusText)
			return []
		}				
	}

	return (
		<div className="container">
			<h1>Honey Do List</h1>
			<ul>
				<li>
					<input type="text"
						onChange={(e) => setInputValue(e.target.value)}
						value={inputValue}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setTodos(todos.concat([inputValue]));
								setInputValue("");
							}
						}}
						placeholder="What was I supposed to do?"
					></input>
				</li>
				{todos.map((item, index) => (
					<li>
						{item}{" "} 
						<i 
							className="far fa-clock" 
							onClick={() => 
								setTodos(
									todos.filter(
										(t, currentIndex) => 
											index != currentIndex
									)
								)			 
							}></i>
					</li>
				))}
			</ul>
			<div>{todos.length}</div>
		</div>
	);
};

export default Home;

