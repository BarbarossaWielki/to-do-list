var dataController = (function () {
    var Task = function (value, id) {
        this.value = value;
        this.id = id;
    }

    var data = {
        totalTasks: {
            toDo: [],
            done: []
        },

        percentage: -1
    }
    return {
        addTask: function (newTask) {
            var ID;

            ID = data.totalTasks.toDo.length;
            var newItem = new Task(newTask, ID);
            data.totalTasks.toDo.push(newItem);
            return newItem

        },

        updateData: function (action, ID) {
            var ids, index, type, newType, displayType;

            if (action === 'ok' || action === 'delete') { type = data.totalTasks.toDo; newType = data.totalTasks.done }
            else if (action === 'return' || action === 'deleteDone') { type = data.totalTasks.done; newType = data.totalTasks.toDo }

            if (action === 'return') displayType = 'toDo';
            else if (action === 'ok') displayType = 'done';

            if (action === 'ok' || action === 'return') {
                function findItem(item) {
                    return item.id === ID;
                };
                var newItem = type.find(findItem);
                console.log(newItem);

                var doneItem = new Task(newItem.value, newType.length);

                newType.push(doneItem);

            }


            ids = type.map(function (cur) {

                return cur.id;

            });

            index = ids.indexOf(ID);

            if (index !== -1) {
                type.splice(index, 1);
                console.log(data);
            }

            if (action === 'ok' || action === 'return') {
                return {
                    doneItem,
                    displayType
                }
            }

        },

        tasksProgressCalculating: function () {
            var toDoLength = data.totalTasks.toDo.length;
            var doneLength = data.totalTasks.done.length;
            var totalLength = toDoLength + doneLength;
            var progress = Math.round((doneLength / totalLength) * 100);
            data.percentage = progress;
            return {
                toDoLength,
                doneLength,
                totalLength,
                progress
            }
        },

        test: function () {
            console.log(data);
        }


    }

})();

var UIController = (function () {
    var DOMStrings = {
        addButton: '.add-button',
        doneBtn: '.ok-',
        doneItems: '.done-items',
        allItems: '.all-items',
        percentage: '.percentage',
        input: '.operator-input',
        bottom: '.bottom',
        toDo: '.to-do',
        done: '.done',
        dateLabel: '.day',
        hourLabel: '.operator-hour',
        howManyToDo: '.how-many-to-do',
        howManyDone: '.how-many-done'
    };

    return {
        getInput: function () {

            return {
                value: document.querySelector(DOMStrings.input).value
            }
        },

        displayToDoTasks: function (obj) {
            var html = '<li id="to-do-$id$" class="li">$task$<i class="demo-icon icon-ok done-button" id="ok-$id$"></i><i class="demo-icon icon-cancel remove-button" id="delete-$id$"></i></li>';
            var newHtml;
            newHtml = html.replace('$task$', obj.value);
            newHtml = newHtml.replace('$id$', obj.id);
            newHtml = newHtml.replace('$id$', obj.id);
            newHtml = newHtml.replace('$id$', obj.id);
            document.querySelector(DOMStrings.toDo).insertAdjacentHTML('beforeend', newHtml);

        },

        displayDoneItem: function (obj) {
            var html = '<li id="done-$id$" class="li"><i class="demo-icon icon-left return-button" id="return-$id$"></i>$task$<i class="demo-icon icon-cancel remove-button" id="deleteDone-$id$"></i></li>';
            var newHtml;
            newHtml = html.replace('$task$', obj.value);
            newHtml = newHtml.replace('$id$', obj.id);
            newHtml = newHtml.replace('$id$', obj.id);
            newHtml = newHtml.replace('$id$', obj.id);
            document.querySelector(DOMStrings.done).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (action, selectorID) {
            if (action === 'ok' || action === 'delete') var name = 'to-do-' + selectorID;
            else if (action === 'return' || action === 'deleteDone') var name = 'done-' + selectorID;

            var el = document.getElementById(name);
            el.parentNode.removeChild(el);
        },

        displayProgress: function (progress) {
            if (!isNaN(progress.progress) === false) progress.progress = 100;
            document.querySelector(DOMStrings.doneItems).textContent = progress.doneLength;
            document.querySelector(DOMStrings.allItems).textContent = progress.totalLength;
            document.querySelector(DOMStrings.percentage).textContent = progress.progress + '%';
            document.querySelector(DOMStrings.howManyToDo).textContent = progress.toDoLength;
            document.querySelector(DOMStrings.howManyDone).textContent = progress.doneLength;
        },

        displayDate: function () {
            var now, month, year, day, hour, minute, second;

            now = new Date();

            day = now.getDate();
            month = now.getMonth() + 1;
            year = now.getFullYear();
            hour = now.getHours();
            minute = now.getMinutes();
            // second = now.getSeconds();


            document.querySelector(DOMStrings.dateLabel).textContent = ((day < 10) ? '0' : '') + day + '-' + ((month < 10) ? '0' : '') + month + '-' + year;
            document.querySelector(DOMStrings.hourLabel).textContent = ((hour < 10) ? '0' : '') + hour + '.' + ((minute < 10) ? '0' : '') + minute /* + '.' + second */;

        },

        getDOMStrings: function () {
            return DOMStrings;
        }


    }

})();

var globalController = (function (dataCtrl, UICtrl) {
    var DOMStrings = UICtrl.getDOMStrings();
    var eventsController = function () {

        document.querySelector(DOMStrings.addButton).addEventListener('click', addTask);

        document.addEventListener('keydown', function (event) {
            //This function arised to add tasks when someone click 'enter' insted of add button
            if (event.keyCode === 13 || event.which === 13) {
                addTask();
            }
        });

        document.querySelector(DOMStrings.bottom).addEventListener('click', buttonController);
    };

    var addTask = function () {
        var input, newItem;
        // 1. get input value
        input = UICtrl.getInput();
        // 2. check if input is empty
        if (input.value !== '') {
            // 1. Update data structur
            newItem = dataCtrl.addTask(input.value);


            // 2. Display in UI
            UICtrl.displayToDoTasks(newItem);

            //3. Calculate progress
            var progress = dataController.tasksProgressCalculating();
            UICtrl.displayProgress(progress);


        }
        document.querySelector(DOMStrings.input).value = null;
    };

    var buttonController = function (event) {
        var itemID, splitID, ID, action;
        itemID = event.target.id;
        //console.log(itemID) //ok-0 delete-0;

        if (itemID) {
            splitID = itemID.split('-');

            ID = parseInt(splitID[1]); //0
            console.log(ID);
            action = splitID[0]; //ok/return/delete/deleteDone

            var item = dataCtrl.updateData(action, ID);
            console.log(item);
            // 1. display done item if user click ok btn

            if (item) {
                if (item.displayType === 'toDo')
                    UICtrl.displayToDoTasks(item.doneItem);
                else if (item.displayType === 'done')
                    UICtrl.displayDoneItem(item.doneItem);

                UICtrl.deleteListItem(action, ID);
            } else UICtrl.deleteListItem(action, ID);

            var progress = dataController.tasksProgressCalculating();
            UICtrl.displayProgress(progress);

        }

    }

    return {
        init: function () {
            console.log('Application has started.');
            eventsController();
            UICtrl.displayProgress({
                toDoLength: 0,
                doneLength: 0,
                totalLength: 0,
                progress: 100
            });
            window.setInterval(UICtrl.displayDate, 0);
        }
    }

})(dataController, UIController);

globalController.init();
