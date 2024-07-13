import {generateUniqueId, getDataFromLS, initSortableList, setDataToLS, updateTasksList} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const textareaForm = document.querySelector('.form__textarea');
    const buttonSendForm = document.querySelector('.form__send-btn');
    const buttonCancel = document.querySelector('.form__cancel-btn');
    const output = document.querySelector('.output');
    let editId = null;
    let isEditTask = false;

    updateTasksList();

    form.addEventListener('submit', addTask);
    buttonCancel.addEventListener('click', resetSendForm);
    output.addEventListener('dragover', initSortableList);
    output.addEventListener('dragenter', event => event.preventDefault());
    output.addEventListener('click', (event) => {
        const taskElem = event.target.closest('.task__btns');
        if (!taskElem) return;

        if (event.target.closest('.task__pinned')) {
            pinnedTask(event);
        } else if (event.target.closest('.task__edit')) {
            editTask(event);
        } else if (event.target.closest('.task__del')) {
            delTask(event);
        } else if (event.target.closest('.task__done')) {
            doneTask(event);
        }
    });


    function addTask(event) {
        event.preventDefault();

        const taskText = textareaForm.value.trim().replace(/\s+/g, ' ');
        if (!taskText) {
            return alert('Поле должно быть заполнено');
        }

        if (isEditTask) {
            saveEditTask(taskText);
            return;
        }

        const dataTasksLS = getDataFromLS();
        dataTasksLS.push({
            id: generateUniqueId(),
            task: taskText,
            done: false,
            pinned: false,
            position: 1000,
        });

        setDataToLS(dataTasksLS);
        updateTasksList();
        form.reset();
    }

    function doneTask(event) {
        const task = event.target.closest('.task');
        const id = Number(task.dataset.taskId);

        const dataTasksLS = getDataFromLS();
        const index = dataTasksLS.findIndex(item => item.id === id);

        if (index === -1) {
            return alert('Такая задача не найдена !');
        }

        if (!dataTasksLS[index].done && dataTasksLS[index].pinned) {
            dataTasksLS[index].pinned = false;
        }

        dataTasksLS[index].done = !dataTasksLS[index].done;

        setDataToLS(dataTasksLS);
        updateTasksList();

    }

    function pinnedTask(event) {
        const task = event.target.closest('.task');
        const id = Number(task.dataset.taskId);

        const dataTasksLS = getDataFromLS();
        const index = dataTasksLS.findIndex(item => item.id === id);

        if (index === -1) {
            return alert('Такая задача не найдена !');
        }

        if (dataTasksLS[index].done && !dataTasksLS[index].pinned) {
            return alert('Чтобы закрепить задачу, сначала уберите отметку о выполнение');
        }

        dataTasksLS[index].pinned = !dataTasksLS[index].pinned;

        setDataToLS(dataTasksLS);
        updateTasksList();
    }

    function delTask(event) {
        const task = event.target.closest('.task');
        const id = Number(task.dataset.taskId);

        const dataTasksLS = getDataFromLS();
        const newDataTasks = dataTasksLS.filter(item => item.id !== id);

        setDataToLS(newDataTasks);
        updateTasksList();
    }

    function editTask(event) {
        const task = event.target.closest('.task');
        const taskText = task.querySelector('.task__text');
        editId = Number(task.dataset.taskId);

        textareaForm.value = taskText.textContent;
        isEditTask = true;
        buttonSendForm.textContent = 'Сохранить';
        buttonCancel.classList.remove('none');
        form.scrollIntoView({ behavior: 'smooth' });
    }

    function saveEditTask(taskText) {
        const dataTasksLS = getDataFromLS();
        const index = dataTasksLS.findIndex(item => item.id === editId);

        if (index !== -1) {
            dataTasksLS[index].task = taskText;
            setDataToLS(dataTasksLS);
            updateTasksList();
        } else {
            alert('Такая задача не найдена !');
        }
        resetSendForm();
    }

    function resetSendForm() {
        editId = null;
        isEditTask = false;
        buttonSendForm.textContent = 'Добавить';
        buttonCancel.classList.add('none');
        form.reset();
    }
});


