document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const themeToggle = document.getElementById('theme-toggle');

  // Load tasks from localStorage
  loadTasks();

  // Load theme from localStorage
  loadTheme();

  // Add task event
  taskForm.addEventListener('submit', addTask);

  // Task list event
  taskList.addEventListener('click', handleTaskListClick);

  // Theme toggle event
  themeToggle.addEventListener('change', toggleTheme);

  function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === '') {
      alert('Please enter a task');
      return;
    }

    // Create a new task object
    const task = { text: taskText, completed: false };

    // Save task to localStorage
    saveTask(task);

    // Render the task
    renderTask(task);

    // Clear input
    taskInput.value = '';
  }

  function handleTaskListClick(e) {
    const li = e.target.parentElement;
    const taskText = li.querySelector('span').textContent;

    if (e.target.classList.contains('delete')) {
      // Remove task from UI
      taskList.removeChild(li);

      // Delete task from localStorage
      deleteTask(taskText);
    } else if (e.target.classList.contains('rename')) {
      const newTaskText = prompt('Rename task', taskText);
      if (newTaskText && newTaskText.trim() !== '') {
        // Update task in localStorage
        updateTask(taskText, newTaskText.trim());

        // Update task in UI
        li.querySelector('span').textContent = newTaskText.trim();
      }
    } else if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
      const completed = e.target.checked;
      toggleTaskCompletion(taskText, completed);
    }
  }

  function saveTask(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function deleteTask(taskText) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateTask(oldText, newText) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks = tasks.map(task => task.text === oldText ? { ...task, text: newText } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function toggleTaskCompletion(taskText, completed) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks = tasks.map(task => task.text === taskText ? { ...task, completed } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => {
      if (task && task.text !== undefined) { // Check task validity
        renderTask(task);
      }
    });
  }

  function renderTask(task) {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span>${task.text}</span>
      <button class="rename">Rename</button>
      <button class="delete">Delete</button>
    `;
    taskList.appendChild(li);
  }

  function toggleTheme(e) {
    if (e.target.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    }
  }
});
