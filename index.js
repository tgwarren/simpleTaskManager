import { readFile, writeFile } from 'fs';
import * as readline from 'node:readline';

const tasksFile = 'tasks.json';

function getAllTasks(callback) {
    readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            const tasks = JSON.parse(data);
            callback(null, tasks);
        }
    });
}

function listTasks() {
    getAllTasks((err, tasks) => {
        if (err) {
            console.error('Error reading tasks:', err);
        } else {
            console.log('Tasks:');
            tasks.forEach((task, index) => {
                console.log(`${index + 1}. ${task.title} - ${task.description} [${task.status}]`);
            });
        }
    });
}

function addTask(title, description) {
    getAllTasks((err, tasks) => {
        if (err) {
            console.error('Error reading tasks:', err);
        } else {
            const newTask = {
                title,
                description,
                status: 'not completed'
            };
            tasks.push(newTask);
            writeFile(tasksFile, JSON.stringify(tasks), 'utf8', (err) => {
                if (err) {
                    console.error('Error adding task:', err);
                } else {
                    console.log('Task added successfully.');
                }
            });
        }
    });
}

function completeTask(title) {
    getAllTasks((err, tasks) => {
        if (err) {
            console.error('Error reading tasks:', err);
        } else {
            const taskIndex = tasks.findIndex((task) => task.title === title);
            if (taskIndex !== -1) {
                tasks[taskIndex].status = 'completed';
                writeFile(tasksFile, JSON.stringify(tasks), 'utf8', (err) => {
                    if (err) {
                        console.error('Error completing task:', err);
                    } else {
                        console.log('Task marked as completed.');
                    }
                });
            } else {
                console.error('Task not found.');
            }
        }
    });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function user() {
  rl.question('Enter a command (list/add/complete/exit): ', (command) => {
    switch (command) {
      case 'list':
        listTasks();
        break;
      case 'add':
        rl.question('Enter task title: ', (title) => {
          rl.question('Enter task description: ', (description) => {
            addTask(title, description);
            user();
          });
        });
        break;
      case 'complete':
        rl.question('Enter task title to mark as completed: ', (title) => {
          completeTask(title);
          user();
        });
        break;
      case 'exit':
        rl.close();
        break;
      default:
        console.log('Invalid command');
        user();
        break;
    }
  });
}

user();