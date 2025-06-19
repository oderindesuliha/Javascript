const URL = 'http://localhost:8080/api';
const currentUser = null;

const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('currentUser')) || {};
};

const showLogin = () => {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('todoPage').style.display = 'none';
};

const showRegister = () => {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('todoPage').style.display = 'none';
};

const register = async () => {
    const firstName = document.getElementById('registerFirstName').value.trim();
    const lastName = document.getElementById('registerLastName').value.trim();
    const userName = document.getElementById('registerUserName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    // const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (firstName && lastName && userName && email && password) {
        if (password) {
            try {
                const response = await fetch(`${URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ firstName: firstName, lastName: lastName, userName: userName, email: email, password: password }),
                    body: JSON.stringify({ firstName: firstName, lastName: lastName, userName: userName, email: email, password: password }),
                });

                const data = await response.json();
                console.log(data);
                if (response.ok && data.success) {
                    alert('Registration successful! Please login.');
                    showLogin();
                } else {
                    alert(data.message || 'Registration failed. Username may already exist.');
                }
            } catch (error) {
                alert('Error connecting to the server. Please try again later.');
                console.error('Registration error:', error);
            }
        } else {
            alert('Passwords do not match.');
        }
    } else {
        alert('Please fill in all fields.');
    }
};

const login = async () => {
    const userName = document.getElementById('loginUserName').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (userName && password) {
        try {
            const response = await fetch(`${URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('currentUser', JSON.stringify({ userName, firstName: data.firstName, email: data.email, userId: data.userId }));
                document.getElementById('loginForm').classList.remove('active');
                document.getElementById('registerForm').classList.remove('active');
                document.getElementById('todoPage').style.display = 'block';
                document.getElementById('welcomeMessage').textContent = `CoPlanr, ${data.firstName}!`;
            } else {
                alert(data.message || 'Invalid username or password.');
            }
        } catch (error) {
            alert('Error connecting to the server. Please try again later.');
            console.error('Login error:', error);
        }
    } else {
        alert('Please fill in all fields.');
    }
};

const logout = async () => {
    const user = getCurrentUser();
    const email = user.email || '';
    const password = document.getElementById('loginPassword').value || '';

    try {
        const response = await fetch(`${URL}/users/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            alert('Logged out successfully.');
            showLogin();
        } else {
            alert(data.message || 'Logout failed.');
        }
    } catch (error) {
        alert('Error connecting to the server. Please try again later.');
        console.error('Logout error:', error);
    }
};

const addTask = async () => {
    const taskInput = document.getElementById('taskInput').value.trim();
    if (taskInput) {
        try {
            const user = getCurrentUser();
            const response = await fetch(`${URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({ task: taskInput, status: 'To Start', userId: user.userId }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                const task = data.data;
                const taskRows = document.getElementById('taskRows');
                const rowDiv = document.createElement('div');
                rowDiv.className = 'task-row';
                rowDiv.dataset.task = task.task;
                rowDiv.dataset.taskId = task.id;

                const taskCell = document.createElement('div');
                taskCell.className = 'task-cell task-name';
                taskCell.textContent = task.task;
                taskCell.onclick = () => editTask(taskCell, task.id);
                rowDiv.appendChild(taskCell);

                for (let i = 0; i < 4; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'task-cell';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.status === ['To Start', 'In Progress', 'Blocked', 'Done'][i];
                    checkbox.onclick = () => updateTaskStatus(rowDiv, checkbox, task.id);
                    cell.appendChild(checkbox);
                    rowDiv.appendChild(cell);
                }

                taskRows.appendChild(rowDiv);
                document.getElementById('taskInput').value = '';
            } else {
                alert(data.message || 'Failed to add task.');
            }
        } catch (error) {
            alert('Error connecting to the server. Please try again later.');
            console.error('Add task error:', error);
        }
    } else {
        alert('Please enter a task.');
    }
};

const editTask = async (taskCell, taskId) => {
    const currentTask = taskCell.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTask;
    input.className = 'input';
    taskCell.textContent = '';
    taskCell.appendChild(input);
    input.focus();

    const saveTask = async () => {
        const newTask = input.value.trim();
        if (newTask) {
            try {
                const response = await fetch(`${URL}/tasks/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify({ id: taskId, task: newTask }),
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    taskCell.textContent = newTask;
                    taskCell.parentElement.dataset.task = newTask;
                } else {
                    alert(data.message || 'Failed to update task.');
                    taskCell.textContent = currentTask;
                }
            } catch (error) {
                alert('Error connecting to the server. Please try again later.');
                console.error('Edit task error:', error);
                taskCell.textContent = currentTask;
            }
        } else {
            taskCell.textContent = currentTask;
        }
    };

    input.onblur = saveTask;
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    };
};

const updateTaskStatus = async (rowDiv, selectedCheckbox, taskId) => {
    const checkboxes = rowDiv.querySelectorAll('input[type="checkbox"]');
    const statuses = ['To Start', 'In Progress', 'Blocked', 'Done'];
    const selectedIndex = Array.from(checkboxes).indexOf(selectedCheckbox);
    const newStatus = statuses[selectedIndex];

    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = checkbox === selectedCheckbox;
    });

    try {
        const response = await fetch(`${url}/tasks/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({ id: taskId, status: newStatus }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            alert(data.message || 'Failed to update task status.');
            checkboxes.forEach((checkbox, index) => {
                checkbox.checked = index === 0;
            });
        }
    } catch (error) {
        alert('Error connecting to the server. Please try again later.');
        console.error('Update task status error:', error);
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = index === 0;
        });
    }
};

const viewAllTasks = async () => {
    try {
        const user = getCurrentUser();
        const response = await fetch(`${URL}/tasks?userId=${user.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });

        const data = await response.json();
        if (response.ok && data.success) {
            const tasks = data.data;
            const taskRows = document.getElementById('taskRows');
            taskRows.innerHTML = '';
            tasks.forEach(task => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'task-row';
                rowDiv.dataset.task = task.task;
                rowDiv.dataset.taskId = task.id;

                const taskCell = document.createElement('div');
                taskCell.className = 'task-cell task-name';
                taskCell.textContent = task.task;
                taskCell.onclick = () => editTask(taskCell, task.id);
                rowDiv.appendChild(taskCell);

                const statuses = ['To Start', 'In Progress', 'Blocked', 'Done'];
                for (let i = 0; i < 4; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'task-cell';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.status === statuses[i];
                    checkbox.onclick = () => updateTaskStatus(rowDiv, checkbox, task.id);
                    cell.appendChild(checkbox);
                    rowDiv.appendChild(cell);
                }

                taskRows.appendChild(rowDiv);
            });

            alert('Tasks:\n' + tasks.map(t => `${t.task}: ${t.status || 'No Status'}`).join('\n'));
        } else {
            alert(data.message || 'Failed to fetch tasks.');
        }
    } catch (error) {
        alert('Error connecting to the server. Please try again later.');
        console.error('View tasks error:', error);
    }
};

showLogin();