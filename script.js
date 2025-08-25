 document.addEventListener('DOMContentLoaded', () => {
            const addTaskForm = document.getElementById('add-task-form');
            const taskInput = document.getElementById('task-input');
            const taskList = document.getElementById('task-list');
            const noTasksMessage = document.getElementById('no-tasks-message');
            
            // Use a consistent key for local storage
            const STORAGE_KEY = 'my-todo-app-tasks';

            // Load tasks from local storage when the app starts
            let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            /**
             * Saves the current tasks array to local storage.
             */
            function saveTasks() {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            }

            /**
             * Renders the tasks to the DOM.
             */
            function renderTasks() {
                // Clear the current list
                taskList.innerHTML = '';

                if (tasks.length === 0) {
                    noTasksMessage.classList.remove('hidden');
                } else {
                    noTasksMessage.classList.add('hidden');
                    tasks.forEach(task => {
                        const taskElement = createTaskElement(task.id, task.text, task.completed);
                        taskList.appendChild(taskElement);
                    });
                }
            }

            /**
             * Creates an HTML element for a single task.
             * @param {string} id - The unique ID of the task.
             * @param {string} text - The text content of the task.
             * @param {boolean} completed - The completion status of the task.
             * @returns {HTMLElement} The created task element.
             */
            function createTaskElement(id, text, completed) {
                const item = document.createElement('div');
                item.className = `task-item flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm transition-all duration-200 ${completed ? 'completed' : ''}`;
                item.dataset.id = id;

                const taskText = document.createElement('span');
                taskText.textContent = text;
                taskText.className = 'flex-grow cursor-pointer';
                taskText.onclick = () => toggleTaskCompletion(id);

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>`;
                deleteButton.className = 'ml-4';
                deleteButton.onclick = () => deleteTask(id);

                item.appendChild(taskText);
                item.appendChild(deleteButton);

                return item;
            }

            /**
             * Adds a new task to the list.
             * @param {Event} e - The form submission event.
             */
            function addTask(e) {
                e.preventDefault();
                const taskText = taskInput.value.trim();
                if (taskText) {
                    const newTask = {
                        id: Date.now().toString(), // Simple unique ID
                        text: taskText,
                        completed: false
                    };
                    tasks.push(newTask);
                    saveTasks();
                    renderTasks();
                    taskInput.value = ''; // Clear input field
                }
            }

            /**
             * Toggles the completion status of a task.
             * @param {string} id - The ID of the task to update.
             */
            function toggleTaskCompletion(id) {
                const task = tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks();
                }
            }

            /**
             * Deletes a task from the list.
             * @param {string} id - The ID of the task to delete.
             */
            function deleteTask(id) {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
            }

            // --- Event Listeners ---
            addTaskForm.addEventListener('submit', addTask);

            // --- Initial Render ---
            renderTasks();
        });