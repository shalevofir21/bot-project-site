function changes(){
  document.querySelector(".save").style.visibility = "visible";
};

$('form input').on('keypress', function(e) {
  return e.which !== 13;
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if($(event.target).attr('class') == "modal") {
    $(".modal").each(function() {
      if(this.id === "create") return $(this).remove()
      this.style.display = "none";
    })
  }
}

var availableTags = [
  "{user.username}",
  "{user.mention}",
  "{channel.name}",
  "{channel.topic}",
  "{guild.name}",
  "{guild.id}",
  "{user.voiceChannel}",
  "{user.id}",
  "{args1}",
  "{args2}",
  "{args3}",
  "{args4}",
  "{args5}",
  "{helpme.reason}",
  "{helpme.voiceChannel}",
];

function split(val) {
  return val.split(" ");
}

function extractLast(term) {
  return split(term).pop();
}

function idGen(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function cm(id){
  document.getElementById(id).style.display = "none";
}

function om(id){
  document.getElementById(id).style.display = "block";
}

function rd() {
  $("#create").remove()
}

function dm(id) {
  let button = event.target;
  button.disabled = true

  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    data: {
      type: "delete",
      id,
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.success === true){
      $(`#custom-${id}`).remove()
    }
  }).fail(function(){
    button.disabled = false
    button.innerHTML = "Error"
  });
}

function sm(id){
  document.querySelector(`.save-${id}`).innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
  document.querySelector(`.save-${id}`).className = `save-${id} btn btn-success`;
  document.querySelector(`.save-${id}`).disabled = true;
  document.getElementsByName("error").forEach(function(ele, idx) {
    ele.style.display = "none";
  });
  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    data: {
      type: "edit",
      id,
      command: $(`#command-${id}`).val(),
      message: $(`#message-${id}`).val(),
      cooldown: document.getElementById(`cooldown-${id}`).checked,
      hours: document.getElementById(`hours-${id}`).value,
      minutes: document.getElementById(`minutes-${id}`).value,
      seconds: document.getElementById(`seconds-${id}`).value,
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed === true){
      document.querySelector(`.save-${id}`).innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.error || "No permissions"}`;
      document.querySelector(`.save-${id}`).className = `save-${id} btn btn-danger`;
      document.querySelector(`.save-${id}`).disabled = false;
    }else{
      if(data.success === true){
        cm(id)
        document.querySelector(`.save-${id}`).innerHTML = 'Save';
        document.querySelector(`.save-${id}`).className = `save-${id} btn btn-success`;
        document.querySelector(`.save-${id}`).disabled = false;
        document.querySelector(`.commandPreview-${id}`).innerHTML = $(`#command-${id}`).val()
      }else{
        document.querySelector(`.save-${id}`).innerHTML = 'Save';
        document.querySelector(`.save-${id}`).className = `save-${id} btn btn-success`;
        document.querySelector(`.save-${id}`).disabled = false;
        if(data.type === "command"){
          $(`#error-${id}-command`).text(data.message);
          $(`#error-${id}-command`).css("display", "block");
        }else if(data.type === "message"){
          $(`#error-${id}-message`).text(data.message);
          $(`#error-${id}-message`).css("display", "block");
        }else if(data.type === "time"){
          $(`#error-${id}-time`).text(data.message);
          $(`#error-${id}-time`).css("display", "block");
        }
      }
    }
  }).fail(function(){
    document.querySelector(`.save-${id}`).innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
    document.querySelector(`.save-${id}`).className = `save-${id} btn btn-danger`;
    document.querySelector(`.save-${id}`).disabled = false;
  });
}


function sd(id){
  document.querySelector(".save-create").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
  document.querySelector(".save-create").className = 'save-create btn btn-success';
  document.querySelector(".save-create").disabled = true;
  document.getElementsByName("error").forEach(function(ele, idx) {
    ele.style.display = "none";
  });
  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    data: {
      type: "create",
      id,
      command: $("#command-create").val(),
      message: $("#message-create").val(),
      cooldown: document.getElementById('cooldown-create').checked,
      hours: document.getElementById("hours-create").value,
      minutes: document.getElementById("minutes-create").value,
      seconds: document.getElementById("seconds-create").value,
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed === true){
      document.querySelector(".save-create").innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.error || "No permissions"}`;
      document.querySelector(".save-create").className = 'save-create btn btn-danger';
      document.querySelector(".save-create").disabled = false;
    }else{
      if(data.success === true){
        rd()
        function checked(){
          if(data.cooldown === "true") return checked
        }
        function seconds(){
          let text;
          for (i = 0; i < 61; i++) {
            if(i === parseInt(data.time.seconds)){
              text+=`<option value=${i} selected>${i}</option>`
            }else{
              text+=`<option value=${i}>${i}</option>`
            }
          }
          return text
        }
        function minutes(){
          let text;
          for (i = 0; i < 61; i++) {
            if(i === parseInt(data.time.minutes)){
              text+=`<option value=${i} selected>${i}</option>`
            }else{
              text+=`<option value=${i}>${i}</option>`
            }
          }
          return text
        }
        function hours(){
          let text;
          for (i = 0; i < 25; i++) {
            if(i === parseInt(data.time.hours)){
              text+=`<option value=${i} selected>${i}</option>`
            }else{
              text+=`<option value=${i}>${i}</option>`
            }
          }
          return text
        }
        $("#list").append(`
        <div id="custom-${data.id}">
          <div class="list text-light my-1" style="width: auto; height: 65px; margin: auto;">
            <span class="commandPreview-${data.id} float-left my-3" style="padding-left: 20px; font-size: larger;">${data.command}</span>
            <div class='switch float-right my-3' onchange="changes()" style="margin-right: 20px;">
              <label>
                <input class="enable" name="${data.id}" type="checkbox" checked>
                <span class="slider round"></span>
              </label>
            </div>
            <div class='float-right my-3' style="margin-right: 20px;">
              <button class="btn btn-outline-light" type="button" onClick="om(${data.id})">Edit</button>
            </div>
            <div class='float-right my-3' style="margin-right: 20px;">
              <button class="btn btn-outline-danger" type="button" onclick="dm(${data.id})">Delete</button>
            </div>
          </div>
          <br>
          <div id=${data.id} class="modal">
            <div class="modal-content">
              <div class="close" onclick="cm(${data.id})">×</div>
              <span id="error-${data.id}-command" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
              <span class="text-light" style="font-size: larger;">Command: </span>
              <input type="text" id="command-${data.id}" placeholder="Command" value=${data.command} style="font-size:18pt; height:30px; width:60%;">
              <br><br>
              <span id="error-${data.id}-message" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
              <span class="text-light" style="font-size: larger;">Message: </span>
              <br>
              <textarea id="message-${data.id}" class="message" placeholder="Message" rows="5" cols="90" maxlength="1000">${data.message}</textarea>
              <br><br>
              <span id="error-${data.id}-time" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
              <div style="display: inline-block;">
                <span class="text-light" style="font-size: larger;">Cooldown: </span>
                <div class='switch' style="top:-20px;">
                  <label>
                    <input type="checkbox" id="cooldown-${data.id}" ${checked()}>
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              <br>
              <span class="text-light" style="font-size: larger;">Cooldown time: </span>
              <select class="form-select" id="hours-${data.id}">
                ${hours()}
              </select> Hours&nbsp;&nbsp;
              <select class="form-select" id="minutes-${data.id}">
                ${minutes()}
              </select> Minutes&nbsp;&nbsp;
              <select class="form-select" id="seconds-${data.id}">
                ${seconds()}
              </select> Seconds
              <br><br>
              <button onclick="cm(${data.id})" class="btn btn-secondary">Cancel</button>
              <button onclick="sm(${data.id})" class="save-${data.id} btn btn-success">Save</button>
            </div>
          </div>
        </div>
        `);
      }else{
        document.querySelector(".save-create").innerHTML = 'Save';
        document.querySelector(".save-create").className = 'save-create btn btn-success';
        document.querySelector(".save-create").disabled = false;
        if(data.type === "command"){
          $(`#error-${data.id}-command`).text(data.message);
          $(`#error-${data.id}-command`).css("display", "block");
        }else if(data.type === "message"){
          $(`#error-${data.id}-message`).text(data.message);
          $(`#error-${data.id}-message`).css("display", "block");
        }else if(data.type === "time"){
          $(`#error-${data.id}-time`).text(data.message);
          $(`#error-${data.id}-time`).css("display", "block");
        }
      }
    }
  }).fail(function(){
    document.querySelector(".save-create").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
    document.querySelector(".save-create").className = 'save-create btn btn-danger';
    document.querySelector(".save-create").disabled = false;
  });
}

function add() {
  let id = idGen(0, 999999999)
  function options(number){
    let text;
    for (i = 0; i < number; i++) {
      text+=`<option value=${i}>${i}</option>`
    }
    return text
  }
  $("#list").append(`
  <div id="create" class="modal">
    <div class="modal-content">
      <div class="close" onclick="rd()">×</div>
      <span id="error-create-command" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
      <span class="text-light" style="font-size: larger;">Command: </span>
      <input type="text" id="command-create" placeholder="Command" value="!" style="font-size:18pt; height:30px; width:60%;">
      <br><br>
      <span id="error-create-message" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
      <span class="text-light" style="font-size: larger;">Message: </span>
      <br>
      <textarea id="message-create" class="message" placeholder="Message" rows="5" cols="90" maxlength="1000"></textarea>
      <br><br>
      <div style="display: inline-block;">
        <span class="text-light" style="font-size: larger;">Cooldown: </span>
        <div class='switch' style="top:-20px;">
          <label>
            <input type="checkbox" id="cooldown-create">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <br>
      <span id="error-create-time" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
      <span class="text-light" style="font-size: larger;">Cooldown time: </span>
      <select id="hours-create">
        ${options(25)}
      </select> Hours&nbsp;&nbsp;
      <select id="minutes-create">
        ${options(61)}
      </select> Minutes&nbsp;&nbsp;
      <select id="seconds-create">
        ${options(61)}
      </select> Seconds
      <br><br>
      <button onclick="rd()" class="btn btn-secondary">Cancel</button>
      <button onclick="sd(${id})" class="save-create btn btn-success">Save</button>
    </div>
  </div>
  `);
  document.getElementById("create").style.display = "block";
  
  // document.querySelector(".save").style.visibility = "visible";

  $(".message")
  .bind("keydown", function(event) {
    if (event.keyCode === $.ui.keyCode.TAB) {
      event.preventDefault();
    }
  }).autocomplete({
    minLength: 0,
    source: function(request, response) {
        var term = request.term,
        results = [];
        if (term.indexOf("{") >= 0) {
          term = extractLast(request.term.split("{").pop());
          if (term.length > 0) {
            results = $.ui.autocomplete.filter(availableTags, term);
          }
        }
        response(results);
    },
    focus: function() {
        // prevent value inserted on focus
        return false;
    },
    select: function(event, ui) {
      var terms = split(this.value.replace(/{([^{]*)$/, " {").replace(/\n/g, " \n"));

      terms.pop();

      terms.push(ui.item.value);

      for(i = 0; i < terms.length; i++){
        if(terms[i] === ""){
          terms.splice(i, 1);
        }
        if(terms[i - 1] === "\n"){
          terms[i] = "noSpace"+terms[i];
        }
      }

      terms = terms.join(" ");
      this.value = terms.replace(/ noSpace/g, "");
      return false;
    }
  });
}

$('.save').click(function(e){
  document.querySelector(".save").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
  document.querySelector(".save").className = 'save btn btn-success mr-2 my-2 float';
  document.querySelector(".save").disabled = true;
  if(!$('.enable').length){
    document.querySelector(".save").style.visibility = "hidden";
    document.querySelector(".save").innerHTML = '<i class="fas fa-save pr-1 text-light"></i> Save all';
    document.querySelector(".save").disabled = false;
  }else{
    function data() {
      let total = [];
      for(i = 0; i < $('.enable').length; i++){
        total.push({id: $(".enable")[i].name, enabled: $(".enable")[i].checked});
      }
      return total;
    }
    $.ajax({
      url: document.URL,
      type: 'POST', 
      dataType: 'html',
      data: {
        type: "update",
        data: data()
      }
    }).done(function(data){
      data = JSON.parse(data);
      if(data.failed === true){
        document.querySelector(".save").innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.error || "No permissions"}`;
        document.querySelector(".save").className = 'save btn btn-danger mr-2 my-2 float';
        document.querySelector(".save").disabled = false;
      }else{
        document.querySelector(".save").style.visibility = "hidden";
        document.querySelector(".save").innerHTML = '<i class="fas fa-save pr-1 text-light"></i> Save all';
        document.querySelector(".save").disabled = false;
      }
    }).fail(function(){
      document.querySelector(".save").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
      document.querySelector(".save").className = 'save btn btn-danger mr-2 my-2 float';
      document.querySelector(".save").disabled = false;
    });
  }
});

// $(function(){
//   $('.save').click(function(e){
//     document.querySelector(".save").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
//     document.querySelector(".save").className = 'save btn btn-success mr-2 my-2 float';
//     document.querySelector(".save").disabled = true;
//     document.getElementsByName("error").forEach(function(ele, idx) {
//       ele.style.display = "none";
//     });
//     function data() {
//       let total = [];
//       for(i = 0; i < $('.list').length; i++){
//         total.push({command: $("input[id$='command']")[i].value, message: $("textarea[id$='message']")[i].value});
//       }
//       return total;
//     }
//     $.ajax({
//       url: document.URL,
//       type: 'POST', 
//       dataType: 'html',
//       data: {
//         prefix: $("#prefix").val(),
//         muteRole: document.getElementById("select-muteRole").value,
//         verificationChannel: document.getElementById("select-verificationChannel").value,
//         verificationRole: document.getElementById("select-verificationRole").value,
//       }
//     }).done(function(data){
//       data = JSON.parse(data);
//       if(data.failed === true){
//         document.querySelector(".save").innerHTML = '<i class="fas fa-exclamation-triangle"></i> '+data.error || '<i class="fas fa-exclamation-triangle"></i> No permissions';
//         document.querySelector(".save").className = 'save btn btn-danger mr-2 my-2 float';
//         document.querySelector(".save").disabled = false;
//       }else{
//         document.querySelector(".save").style.visibility = "hidden";
//         document.querySelector(".save").innerHTML = '<i class="fas fa-save pr-1 text-light"></i> Save all';
//         document.querySelector(".save").disabled = false;

//         data.forEach(d => {
//           if(d.success === false){
//             $("span[id$='error']").eq(d.number).text(d.message);
//             $("span[id$='error']").eq(d.number).css("display", "block");
//           }
//         });
//       }
//     }).fail(function(){
//       document.querySelector(".save").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
//       document.querySelector(".save").className = 'save btn btn-danger mr-2 my-2 float';
//       document.querySelector(".save").disabled = false;
//     });
//   });
// });


$(".message")
  .bind("keydown", function(event) {
    if (event.keyCode === $.ui.keyCode.TAB) {
      event.preventDefault();
    }
  }).autocomplete({
    minLength: 0,
    source: function(request, response) {
        var term = request.term,
        results = [];
        if (term.indexOf("{") >= 0) {
          term = extractLast(request.term.split("{").pop());
          if (term.length > 0) {
            results = $.ui.autocomplete.filter(availableTags, term);
          }
        }
        response(results);
    },
    focus: function() {
        // prevent value inserted on focus
        return false;
    },
    select: function(event, ui) {
      var terms = split(this.value.replace(/{([^{]*)$/, " {").replace(/\n/g, " \n"));

      terms.pop();

      terms.push(ui.item.value);

      for(i = 0; i < terms.length; i++){
        if(terms[i] === ""){
          terms.splice(i, 1);
        }
        if(terms[i - 1] === "\n"){
          terms[i] = "noSpace"+terms[i];
        }
      }

      terms = terms.join(" ");
      this.value = terms.replace(/ noSpace/g, "");
      return false;
    }
  });
