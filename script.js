document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('new-task').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    loadTasks();
});

function addTask() {
    var taskInput = document.getElementById('new-task');
    var taskText = taskInput.value.trim();

    if (taskText !== '') {
        var taskList = document.getElementById('task-list');
        var newTaskItem = document.createElement('li');
        newTaskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="edit-button" onclick="editTask(this)">Edit</button>
            <button class="delete-button" onclick="deleteTask(this)">Delete</button>
            <button class="complete-button" onclick="completeTask(this)">Complete</button>
        `;
        taskList.appendChild(newTaskItem);

        saveTask(taskText);

        taskInput.value = '';
    }
}

function editTask(button) {
    var taskItem = button.parentElement;
    var taskTextElement = taskItem.querySelector('span');
    var taskText = taskTextElement.innerText;

    var newText = prompt('Edit task:', taskText);

    if (newText !== null) {
        taskTextElement.innerText = newText;
        updateTask(taskText, newText);
    }
}

function deleteTask(button) {
    var taskItem = button.parentElement;
    var taskText = taskItem.firstChild.innerText;

    taskItem.remove();

    removeTask(taskText);
}

function completeTask(button) {
    var taskItem = button.parentElement;
    var taskTextElement = taskItem.querySelector('span');
    var taskText = taskTextElement.innerText;

    // Display alert message
    alert('Task completed: ' + taskText);

    // Remove the task item from the list
    taskItem.remove();

    // Update the task status in localStorage
    updateTaskStatus(taskText, true);
}

function saveTask(taskText) {
    var tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskText) {
    var tasks = getTasks();
    var index = tasks.findIndex(task => task.text === taskText);

    if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTask(oldText, newText) {
    var tasks = getTasks();
    var index = tasks.findIndex(task => task.text === oldText);

    if (index !== -1) {
        tasks[index].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTaskStatus(taskText, completed) {
    var tasks = getTasks();
    var index = tasks.findIndex(task => task.text === taskText);

    if (index !== -1) {
        tasks[index].completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function loadTasks() {
    var tasks = getTasks();
    var taskList = document.getElementById('task-list');

    // Clear existing tasks before loading
    taskList.innerHTML = '';

    tasks.forEach(function (task) {
        if (!task.completed) {
            var newTaskItem = document.createElement('li');
            newTaskItem.innerHTML = `
                <span>${task.text}</span>
                <button class="edit-button" onclick="editTask(this)">Edit</button>
                <button class="delete-button" onclick="deleteTask(this)">Delete</button>
                <button class="complete-button" onclick="completeTask(this)">Complete</button>
            `;
            if (task.completed) {
                newTaskItem.classList.add('completed');
            }
            taskList.appendChild(newTaskItem);
        }
    });
}

function getTasks() {
    var tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}
