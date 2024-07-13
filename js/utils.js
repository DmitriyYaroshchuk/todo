import { doneSvg, pinnedSvg, delSvg, editSvg } from "./svg.js";

export function getDataFromLS() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
}

export function setDataToLS(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function generateUniqueId() {
    return Date.now();
}

export function updateTasksList() {
    document.querySelector('.output').textContent = '';
    const dataTasks = getDataFromLS();
    renderTasks(dataTasks);
}

function renderTasks(tasks) {
    if(!tasks || !tasks.length) return;

    tasks.sort((a, b) => {
        if (a.done !== b.done) {
            console.log('a.done: ', a.done);
            console.log('b.done: ', b.done);
            return a.done ? 1 : -1;
        }
        if (a.pinned !== b.pinned) {
            console.log('a.pinned: ', a.pinned);
            console.log('b.pinned: ', b.pinned);
            return a.pinned ? -1 : 1;
        }
        return a.position - b.position;
    })
        .forEach((item, index) => {
            const { id, task, pinned, done } = item;
            const elemHTML =
                `
                    <div class="task ${done ? 'done' : ''} ${pinned ? 'pinned' : ''}" data-task-id="${id}" draggable="true">
                        <p class="task__text">${task}</p>
                        <span class="task__index ${done ? 'none' : ''}">${index + 1}</span>
                        <div class="task__btns">
                            <button class="task__done ${done ? 'active' : ''}">${doneSvg}</button>
                            <button class="task__pinned ${pinned ? 'active' : ''}">${pinnedSvg}</button>
                            <button class="task__edit">${editSvg}</button>
                            <button class="task__del">${delSvg}</button>
                        </div>
                    </div>
                `;
            document.querySelector('.output').insertAdjacentHTML('beforeend', elemHTML);
        });
    activationDrag();
}

function activationDrag() {
    const tasks = [...document.querySelectorAll('.task')];
    
    tasks.forEach(item => {
        item.addEventListener('dragstart', () => {
            setTimeout(() => item.classList.add('dragging'), 0);
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            if (tasks.length > 1) {
                savePositionTask();
            }
        });
    });
}

function savePositionTask() {
    const dataTasksLS = getDataFromLS();
    const tasks = [...document.querySelectorAll('.task')];

    tasks.forEach((item, i) => {
        const id = Number(item.dataset.taskId);
        const index = dataTasksLS.findIndex(value => value.id === id);
        if (index !== -1) {
            dataTasksLS[index].position = i;
        }
    });
    setDataToLS(dataTasksLS);
    updateTasksList();
}

export function initSortableList(event) {
    event.preventDefault();

    const output = document.querySelector('.output');
    const draggingItem = output.querySelector('.dragging');

    let siblings = [...output.querySelectorAll('.task:not(.dragging)')];
    let nextSibling = siblings.find(item => {
        return event.clientY <= item.offsetTop + item.offsetHeight / 2;
    });
    output.insertBefore(draggingItem, nextSibling);
}