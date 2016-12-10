(function($) {
    var tasks = [];
		//createtask(taskData)
		//removetask(id){
		//cleartasks(){
		//.each removetask
		//savedata
		//}
    var tasksIndex = 0;

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
    }
     function removetask(){
       var removeTask = getTaskById($(this).data("id"));
        removeTask.remove();
     }
     
    function renderTasks() {
        var $div = $("<div />");
        var reversedTasks = Array.prototype.slice.call(tasks);
        reversedTasks.reverse();
        $(".tasks").empty().append($div);
        for (var i = 0; i < reversedTasks.length; i++) {
            var $item = $("<div class='view' ><label class='item'>" + reversedTasks[i].value + "</label><button class='item-close'>&times;</button></div>").fadeIn('fast');
            var $checkbox = $('<input  class="checkboxremove" id="chx' + i + '" type="checkbox" data-id="' + reversedTasks[i].id + '" /><label  for="chx' + i + '" class="checkbox"><span class="tick">&#10003;</span></label>')
            $checkbox
                .attr("checked", reversedTasks[i].completed)
                .on("change", changeTaskStatus);
            $div.append($item.prepend($checkbox));
            countChecked();
        }
    };

    //button-all-checked
    $("#active-btn").on("change", function() {
        $("input:checkbox").prop("checked", $(this).is(":checked"));
        countChecked();
    });

    //Click on X to delete Todo
    $("div").on("click", "button.item-close", function(event) {
        $(this).parent().slideToggle("slow", function() {
            $(this).remove();
            countChecked();
            removetask();
        });
        event.stopPropagation();
    });

    // edit-tasks
    var cssValues = {
        "color": "black",
        "text-decoration": "none"
    };
    $(".tasks").on("dblclick", "label.item", function() {
        $(this).attr("contenteditable", "true").focus().addClass("edit").css(cssValues);
        $($(".view").find(".checkbox")).hide(1000);
    });
    $(document).click(function() {
        if (!$(event.target).is(".edit")) {
            $(".item").removeClass("edit", 1000).attr("contenteditable", "false").removeAttr("style");
            $(".view").find(".checkbox").show(1000);
        }
    });

    //add footer div-active
    var countChecked = function() {
        var count = $(".tasks input:not(:checked)").length;
        $("#sum").text(count + (count === 1 ? " item" : " items") + " left");
    };
    countChecked();
    $(".tasks").on("click", "input:checkbox", countChecked);


    //button-clear completed
    $("#clear_all").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is(":checked")) {
                $(this).parent().slideToggle(900, function() {
                    $(this).remove();
                });
            }
        });
    });
    //button-completed
    $("#done").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is(":checked")) {
                $(this).parent().show(2000);
            } else {
                $(this).parent().hide("fast");
            }
        })
    });
    //button-active
    $("#active").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is(":not(:checked)")) {
                $(this).parent().show(2000);
            } else {
                $(this).parent().hide("fast");
            }
        })
    });
    //button-all
    $("#all").on("click", function() {
        $(".tasks input:checkbox").each(function() {
            if ($(this).is("input:checkbox")) {
                $(this).parent().show(2000);
            } else {
                $(this).parent().hide("fast");
            }
        })
    });

    //remove-active-btn class
    $(".footer-link").on("click", function() {
        $(".footer-link").removeClass("active");
        $(this).addClass("active");
    });

    function addTask(value) {
        if (!value) {
            $('body').append('<h2>Type the text...</h2>').fadeIn('fast');
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

    $("#taskInput").on("keyup", function(e) {
        if (e.which === 13) {
            addTask($(this).val());
            renderTasks();
            var value = $(this).val("");
        }
    });

    // Saving element in local storage
    localStorage.setItem("todoData", JSON.stringify(task));

})(jQuery);
