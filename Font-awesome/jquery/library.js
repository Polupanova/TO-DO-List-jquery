(function($) {

    var tasks = [];
    var tasksIndex = 0;
    var mode = "all";


    //add task
    function addTask(value) {
        if (!value) {
            $('body').append('<h2><b class="Snackbar-error">�Warning&#33;</b> You left the to-do empty</h2>').fadeIn('fast');
            setTimeout(function() {
                $('h2').fadeOut('fast')
            }, 1300);
            return false;
        }
        var newItem = {
            id: ++tasksIndex,
            value: value,
            completed: false,
        };
        tasks.push(newItem);
    }

    function renderTasks() {
        var $div = $("<div />");
        var reversedTasks = Array.prototype.slice.call(tasks);
        reversedTasks.reverse();
        $(".tasks").empty().append($div);
        for (var i = 0; i < reversedTasks.length; i++) {
            var $item = $('<div class="view" data-id="' + reversedTasks[i].id + '"><label class="item" data-id="' + reversedTasks[i].id + '">' + reversedTasks[i].value + "</label><button class='item-close'>&times;</button></div>");
            var $checkbox = $('<input  class="checkboxremove" id="chx' + i + '" type="checkbox" data-id="' + reversedTasks[i].id + '" /><label  for="chx' + i + '" class="checkbox"><span class="tick">&#10003;</span></label>')
            $checkbox
                .attr("checked", reversedTasks[i].completed)
                .on("change", changeTaskStatus);
            $div.append($item.prepend($checkbox));
            countChecked();
            allcheckedcount();
            saveTolocalStorage();
        }
    };

        $("#taskInput").on("keyup", function(e) {
            if (e.which === 13) {
                addTask($(this).val());
                renderTasks();
                var value = $(this).val("");
            }
        });


    function getTaskById(id) {
        for (var k = 0; k < tasks.length; k++) {
            if (tasks[k].id === id) {
                return tasks[k];
            }
        }
    }

    function changeTaskStatus() {
        var curTask = getTaskById($(this).data("id"));
        curTask.completed = $(this).prop("checked");
        if (curTask.completed && mode == "active") {
            $(this).parent().hide(300);
        }
        if (!curTask.completed && mode == "done") {
            $(this).parent().hide(300);
        }
        saveTolocalStorage();

    }
//button-all-checked
    function checkAllComplete(checked) {
        for (var i = 0; i < tasks.length; i++) {
            tasks[i].completed = checked;

        }
    }
//button-close
    function removeTask(id) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === parseInt(id)) {
                tasks.splice(i, 1);
            }
        }
    }
//contenteditable(true)-save
    function saveEdits(value, id) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                tasks[i].value = value;
            }

        }
        saveTolocalStorage();
    }

    //add footer div-active
    function countChecked() {
        var count = $(".tasks input:not(:checked)").length;
        $("#sum").text(count + (count === 1 ? " item" : " items") + " left");
    };

    //button-all-(color change)
    function allcheckedcount() {
        if ($('.tasks input:checkbox').filter(':checked').length == $('.tasks input:checkbox').length) {
            $("#active-btn").addClass("activebutton");
        } else {
            $("#active-btn").removeClass("activebutton");
        }
    }

    //button-all-checked
    $("#active-btn").on("change", function() {
        $('input:checkbox').not(this).prop('checked', this.checked);
        countChecked();
        checkAllComplete(this.checked);
        allcheckedcount();
        saveTolocalStorage();
    });


    $(".tasks")
        .on("click", "input:checkbox", countChecked)
        .on("click", "input:checkbox", allcheckedcount)
        .on("click", "button.item-close", function(event) {
            //Click on X to delete Todo
            $(this).parent().slideUp(300, function() {
                $(this).remove();
                removeTask($(this).data("id"));
                allcheckedcount();
                countChecked();
                saveTolocalStorage();
            });
            event.stopPropagation();
        })

    // edit-tasks
    .on("dblclick", "label.item", function() {
            $(this).attr("contenteditable", "true").focus().addClass("edit");
            $(".checkbox").hide(300);
        })
        .on("blur", ".edit", function() {
            $(".item").removeClass("edit").attr("contenteditable", "false").removeAttr("style");
            $(".checkbox").show(300);
            saveEdits(this.innerHTML, $(this).data("id"));
        });


    //button-clear completed
    $("#clear_all").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is(":checked")) {
                $(this).parent().slideToggle(300, function() {
                    $(this).remove();
                    removeTask($(this).data("id"));
                    saveTolocalStorage();
                });
            }
        });
    });
    //button-completed
    $("#done").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is(":checked")) {
                $(this).parent().show(300);
            } else {
                $(this).parent().hide(300);
            }
        });
        mode = "done";
    });
    //button-active
    $("#active").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is(":not(:checked)")) {
                $(this).parent().show(300);
            } else {
                $(this).parent().hide(300);
            }
        })
        mode = "active";
    });
    //button-all
    $("#all").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is("input:checkbox")) {
                $(this).parent().show(300);
            } else {
                $(this).parent().hide(300);
            }
        })
        mode = "all";
    });

    //remove-active-btn class
    $(".footer-link").on("click", function() {
        $(".footer-link").removeClass("active");
        $(this).addClass("active");
    });


    // local storage
    function saveTolocalStorage() {
        var json = {
            data: tasks,
            tasksIndex: tasksIndex,
        };
        localStorage.setItem("tododata", JSON.stringify(json));
    }

    function loadFromlocalStorage() {
        if (localStorage.getItem("tododata")) {
            var json = JSON.parse(localStorage.getItem("tododata"));
            tasks = json.data;
            tasksIndex = json.tasksIndex;
        }
    }

    function init() {
        loadFromlocalStorage();
        renderTasks();
        countChecked();
        allcheckedcount();
    }

    init();

})(jQuery);
