var dataController = (function(){
    var Task = function(value, id){
        this.value = value;
        this.id = id;
    }

    var data = {
        totalTask: {
            toDo: [],
            done: []
        },

        percentage: -1
    }
    return {
        addTask: function(newTask) {
            var ID;

            if (data.totalTask.toDo.length === 0) ID = 0;
            else ID = data.totalTask.toDo.length;
            var newItem = new Task(newTask, ID);
            data.totalTask.toDo.push(newItem);
            return newItem

        },

        updateData: function(action, ID) {
            var ids, index;
            if(action === 'ok') {
                console.log(data.totalTask.toDo.indexOf(Task.id = ID));
                var doneItem = new Task(data.totalTask.toDo[ID].value, data.totalTask.done.length);
                
                data.totalTask.done.push(doneItem);
                
            } 
            
            ids = data.totalTask.toDo.map(function(cur){
                
                return cur.id;
               
            });
                
            index = ids.indexOf(ID);
            
            if (index !== -1) {
                data.totalTask.toDo.splice(index, 1);
             console.log(data);
            }
           
            
            if(action === 'ok') {
                return doneItem; 
            }
                
        
        },

        test: function() {
            console.log(data);
        }
        

    }
   
})();

var UIController = (function(){
    var DOMStrings = {
        input: '.to-do-input',
        addButton: '.plus-icon',
        doneBtn: '.ok-'     
    };

    return {
       getInput: function() {
           return {
                value: document.querySelector(DOMStrings.input).value
           }
       }, 

       displayToDoTasks: function(obj) {
            var html = '<li id="$id$">$task$<i class="demo-icon icon-ok ok" id="ok-$id$"></i><i class="demo-icon icon-cancel cancel" id="delete-$id$"></i></li>';
            var newHtml;
            newHtml = html.replace('$task$', obj.value);
            newHtml = newHtml.replace('$id$', obj.id);
            newHtml = newHtml.replace('$id$', obj.id);
            newHtml = newHtml.replace('$id$', obj.id);
            document.querySelector('.to-do').insertAdjacentHTML('beforeend', newHtml);
           
       },

       displayDoneItem: function(obj) {
        var html = '<li><i class="demo-icon icon-left left" id="return-$id$"></i>$task$<i class="demo-icon icon-cancel cancel" id="deleteDone-$id$"></i></li>';
        var newHtml;
        newHtml = html.replace('$task$', obj.value);
        newHtml = newHtml.replace('$id$', obj.id);
        newHtml = newHtml.replace('$id$', obj.id);
        document.querySelector('.done').insertAdjacentHTML('beforeend', newHtml);
       },

       deleteListItem: function(selectorID) {
            
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
        
        },

       getDOMStrings: function() {
           return DOMStrings;
       }
       
    }

})();

var globalController = (function(dataCtrl, UICtrl){
    
    var eventsController = function() {
        var DOMStrings = UICtrl.getDOMStrings();
        document.querySelector(DOMStrings.addButton).addEventListener('click', addTask);

        document.addEventListener('keypress', function(event) {
            //This function arised to add tasks when someone click 'enter' insted of add button
            if (event.keyCode === 13 || event.which === 13) {
                addTask();
            }
        });

        document.querySelector('body').addEventListener('click', buttonController);
    };
  
    var addTask = function() {
        var input, newItem;
        // 1. get input value
        input = UICtrl.getInput();
        // 2. check if input is empty
        if (input.value !== ''){
            // 1. Update data structur
            newItem = dataCtrl.addTask(input.value);
            

            // 2. Display in UI
            UICtrl.displayToDoTasks(newItem);
            
        }
    };

    var buttonController = function(event) {
        var itemID, splitID, ID, action;
        itemID = event.target.id;
        //console.log(itemID) //ok-0 delete-0;

        if (itemID) {
            splitID = itemID.split('-');

            ID = parseInt(splitID[1]); //0
            console.log(ID);
            action = splitID[0]; //ok/delete

            var item = dataCtrl.updateData(action,ID);
            console.log(item);
            // 1. display done item if user click ok btn

            if (item) {
                UICtrl.displayDoneItem(item);
                UICtrl.deleteListItem(ID);
            } else UICtrl.deleteListItem(ID);
            
            
        }

    }
  
    return {
        init: function(){
            console.log('Application has started.');
            eventsController();
        }
    }

})(dataController, UIController);

globalController.init();
