const socket = io();

/////////-----UTILITY FUNCTIONS-----/////////////
const render = function(outputElement, dataList) {
  dataList.forEach(e => {
    if (!e.done) {
      $(outputElement).append(`
      <div id='item-${
        e._id
      }' class="toDoItem"><a href="#"><span id="deleteBtn-${
        e._id
      }" class="finish far fa-circle fa-xs" value='${e._id}'></span></a>
      <span class='todo'>${e.task}</span><hr>
      </div>`);
    } else {
      $(outputElement).append(`
      <div id='item-${
        e._id
      }' class="toDoItem opacity"><a href="#"><span id="deleteBtn-${
        e._id
      }" class="delete far fa-dot-circle fa-xs" value='${e._id}'></span></a>
      <span class='todo'>${e.task}</span><hr>
      </div>`);
    }
  });
};

const getTodoList = function() {
  $.ajax({ url: "/api/todolist", method: "GET" }).then(function(data) {
    render("#content", data);
  });
};
/////////-----END UTILITY FUNCTIONS-----/////////////

getTodoList();

/////////-----EVENT LISTENERS-----/////////////
$("#submit-form").on("submit", function(event) {
  event.preventDefault();
  //display in front-end make an array of 1 element
  const newInput = {
    task: $("#newInput")
      .val()
      .trim(),
    done: false
  };
  const newInputList = [newInput];
  $.ajax({ url: "/api/todolist", method: "POST", data: newInput }).then(
    function(data) {
      if (data) {
        $("#newInput").val("");
        //send to all sockets
        const dataList = [data];
        socket.emit("add-todo", dataList);
      } else {
        alert("Enter a unique input");
      }
    }
  );
});

$(document).ready(function() {
  $(document).on("click", ".finish", function(event) {
    event.preventDefault();
    const finishID = $(this).attr("value");
    $.ajax({ url: `/api/todolist/${finishID}`, method: "PUT" });
    socket.emit("finish-todo", finishID);
  });
});

$(document).ready(function() {
  $(document).on("click", ".delete", function(event) {
    //extract from value property of clicked button
    const deleteID = $(this).attr("value");
    $.ajax({ url: `/api/todolist/${deleteID}`, method: "DELETE" });
    socket.emit("delete-todo", deleteID);
  });
});
/////////-----END EVENT LISTENERS-----/////////////

/////////-----SOCKET.IO LISTENERS-----/////////////
socket.on("emit-add", function(data) {
  render("#content", data);
});

socket.on("emit-finish", function(data) {
  $(`#item-${data}`).toggleClass("opacity");
  $(`#deleteBtn-${data}`)
    .toggleClass("fa-circle")
    .toggleClass("fa-dot-circle")
    .toggleClass("finish")
    .toggleClass("delete");
});

socket.on("emit-delete", function(data) {
  $(`#item-${data}`).remove();
});
/////////-----END SOCKET.IO LISTENERS-----/////////////
