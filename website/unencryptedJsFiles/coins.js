toastr.options = {"closeButton": false,"debug": false,"newestOnTop": false,"progressBar": true,"positionClass": "toast-top-center","preventDuplicates": true,"onclick": null,"showDuration": "300","hideDuration": "1000","timeOut": "10000","extendedTimeOut": "1000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"}

function changes(){
  document.querySelector(".save").style.display = "inline-block";
};

$("form").on("input", function() {
  document.querySelector(".save").style.display = "inline-block";
});

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
  $("#create").remove();
}

$(`select`).select2({
  width: "60%",
  placeholder: "Select role",
  maximumSelectionLength: 1,
  allowClear: true,
  multiple: true,
  language: {
    noResults: function (params) {
      return "Unknown role";
    },
    maximumSelected: function (params) {
      return "You can select only one role";
    }
  }
});

function dm(id) {
  let button = event.target;
  button.disabled = true

  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    timeout: 5000,
    data: {
      type: "delete",
      id,
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.success === true){
      $("#maxItems").text(data.items.max);
      $("#items").text(data.items.total);
      $(`#item-${id}`).remove();
    }else{
      button.innerHTML = "Error";
    }
  }).fail(function(){
    button.disabled = false;
    button.innerHTML = "Error";
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
    timeout: 5000,
    data: {
      type: "edit",
      id,
      role:  document.getElementById(`role-${id}`).value,
      price: $(`#price-${id}`).val()
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed === true){
      document.querySelector(`.save-${id}`).innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.error || "No permissions"}`;
      document.querySelector(`.save-${id}`).className = `save-${id} btn btn-danger`;
      document.querySelector(`.save-${id}`).disabled = false;
    }else{
      $("#maxItems").text(data.items.max);
      $("#items").text(data.items.total);

      if(data.success === true){
        cm(id);
        document.querySelector(`.save-${id}`).innerHTML = 'Save';
        document.querySelector(`.save-${id}`).className = `save-${id} btn btn-success`;
        document.querySelector(`.save-${id}`).disabled = false;
        document.querySelector(`.rolePreview-${id}`).style.color = data.color;
        document.querySelector(`.rolePreview-${id}`).innerHTML = data.role+"&nbsp;";
        document.querySelector(`.pricePreview-${id}`).innerHTML = `- ${data.price}&nbsp;`;

      }else{
        document.querySelector(`.save-${id}`).innerHTML = 'Save';
        document.querySelector(`.save-${id}`).className = `save-${id} btn btn-success`;
        document.querySelector(`.save-${id}`).disabled = false;

        if(data.role.success === false){
          $(`#error-${id}-role`).text(data.role.message);
          $(`#error-${id}-role`).css("display", "block");
        }
        
        if(data.price.success === false){
          $(`#error-${id}-price`).text(data.price.message);
          $(`#error-${id}-price`).css("display", "block");
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
    timeout: 5000,
    data: {
      type: "create",
      id,
      role:  document.getElementById("role-create").value,
      price: $("#price-create").val()
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed === true){
      document.querySelector(".save-create").innerHTML = '<i class="fas fa-exclamation-triangle"></i> '+ data.error || '<i class="fas fa-exclamation-triangle"></i> No permissions';
      document.querySelector(".save-create").className = 'save-create btn btn-danger';
      document.querySelector(".save-create").disabled = false;
      try{
        $("#maxItems").text(data.items.max);
        $("#items").text(data.items.total);
      }catch{}
    }else{
      if(data.success === true){
        rd();

        function select(){
          let text;

          roles.forEach(role => {
            if(role.id === data.role.id){
              text += `<option value="${role.id}" selected>${role.text}</option>`;
            }else{
              text += `<option value="${role.id}">${role.text}</option>`;
            }
          })
          return text;
        }
        $("#list").append(`
        <div id="item-${data.id}">
          <div class="list text-light my-1" style="width: auto; height: 65px; margin: auto;">
            <span class="rolePreview-${data.id} float-left my-3" style="color: ${data.role.color}; padding-left: 20px; font-size: larger;">${data.role.name || "deleted-role"}&nbsp;</span>
            <span class="pricePreview-${data.id} float-left my-3" style="font-size: larger;">- ${data.price}&nbsp;</span>
            <img src="https://cdn.discordapp.com/emojis/875357452353286174.png?v=1" width="25" height="25" class="float-left my-3" style="font-size: larger;"></img>
            <div class='float-right my-3' style="margin-right: 20px;">
              <button class="btn btn-outline-light" type="button" onclick="om(${data.id})">Edit</button>
            </div>
            <div class='float-right my-3' style="margin-right: 20px;">
              <button class="btn btn-outline-danger" type="button" onclick="dm(${data.id})">Delete</button>
            </div>
          </div>
          <br>

          <div id="${data.id}" class="modal">
            <div class="modal-content">
              <div class="close" onclick="cm(${data.id})">×</div>
              <span id="error-${data.id}-role" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
              <span class="text-light" style="font-size: larger;">Role: </span>
              <select id="role-${data.id}" class="form-control form-control-sm" multiple>
                ${select()}
              </select>
              <br><br>
              <span id="error-${data.id}-price" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
              <span class="text-light" style="font-size: larger;">Price: </span>
              <input type="text" id="price-${data.id}" value="${data.price}" placeholder="Price" style="font-size:18pt; height:30px; width:60%;">
              <br><br>
              <button onclick="cm(${data.id})" class="btn btn-secondary">Cancel</button>
              <button onclick="sm(${data.id})" class="save-${data.id} btn btn-success">Save</button>
            </div>
          </div>
        </div>
        `);

        $(`#role-${data.id}`).select2({
          width: "60%",
          placeholder: "Select role",
          maximumSelectionLength: 1,
          allowClear: true,
          multiple: true,
          language: {
            noResults: function (params) {
              return "Unknown role";
            },
            maximumSelected: function (params) {
              return "You can select only one role";
            }
          }
        });

        $("#maxItems").text(data.items.max);
        $("#items").text(data.items.total);
      }else{
        document.querySelector(".save-create").innerHTML = 'Save';
        document.querySelector(".save-create").className = 'save-create btn btn-success';
        document.querySelector(".save-create").disabled = false;

        if(data.role.success === false){
          $(`#error-role`).text(data.role.message);
          $(`#error-role`).css("display", "block");
        }
        
        if(data.price.success === false){
          $(`#error-price`).text(data.price.message);
          $(`#error-price`).css("display", "block");
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
  $(`#addbutton`).html('<i style="font-size: 25px" class="fa fa-circle-notch fa-spin"></i>');
  $(`#addbutton`).prop('disabled', true);

  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    timeout: 5000,
    data: {
      type: "getItemsLength",
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed === true){
      $(`#addbutton`).html('+');
      $(`#addbutton`).prop('disabled', false);

      toastr.error('<i class="fas fa-exclamation-triangle"></i> '+ data.error || '<i class="fas fa-exclamation-triangle"></i> No permissions', "Error");
    }else{
      $(`#addbutton`).html('+');
      $(`#addbutton`).prop('disabled', false);
      
      $("#maxItems").text(data.items.max);
      $("#items").text(data.items.total);

      if(data.success === true){
        let id = idGen(0, 999999999);
  
        $("#list").append(`
        <div id="create" class="modal">
          <div class="modal-content">
            <div class="close" onclick="rd()">×</div>
            <span id="error-role" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
            <span class="text-light" style="font-size: larger;">Role: </span>
            <select class="select" id="role-create" class="form-control form-control-sm" multiple></select>
            <br><br>
            <span id="error-price" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
            <span class="text-light" style="font-size: larger;">Price: </span>
            <input type="text" id="price-create" placeholder="Price" style="font-size:18pt; height:30px; width:60%;">
            <br><br>
            <button onclick="rd()" class="btn btn-secondary">Cancel</button>
            <button onclick="sd(${id})" class="save-create btn btn-success">Save</button>
          </div>
        </div>
        `);

        $('.select').each(function() {
          $(this).select2({
            width: "60%",
            placeholder: "Select role",
            maximumSelectionLength: 1,
            allowClear: true,
            multiple: true,
            data: roles,
            language: {
              noResults: function (params) {
                return "Unknown role";
              },
              maximumSelected: function (params) {
                return "You can select only one role";
              }
            }
          });
        });
        
        document.getElementById("create").style.display = "block";
      }else{
        toastr.error("You can't add more than 7 items", "Error");
      }
    }
  }).fail(function(){
    toastr.error("Failed to get data", "Error");
    $(`#addbutton`).html('+');
    $(`#addbutton`).prop('disabled', false);
  });
  // if($('#maxItems') !== "unlimited" && parseInt($('#items').text()) >= parseInt($('#maxItems').text())) return toastr.error("You can't add more than 7 items", "Error")
}


$('.save').click(function(e){
  document.querySelector(".save").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
  document.querySelector(".save").className = 'save btn btn-success mr-2 my-2';
  document.querySelector(".save").disabled = true;
  document.getElementsByName("error").forEach(function(ele, idx) {
    ele.style.display = "none";
  });

  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    timeout: 5000,
    data: {
      type: "settings",
      mode: document.getElementById("select-mode").checked,
      coins: document.getElementById("coins-per-message").value,
      daily: {
        min: document.getElementById("daily-coins-min").value,
        max: document.getElementById("daily-coins-max").value
      }
    }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed === true){
      document.querySelector(".save").innerHTML = '<i class="fas fa-exclamation-triangle"></i> '+ data.error || '<i class="fas fa-exclamation-triangle"></i> No permissions';
      document.querySelector(".save").className = 'save btn btn-danger mr-2 my-2';
      document.querySelector(".save").disabled = false;
    }else{
      if(data.coins.success === false){
        document.getElementById("coins-error").innerHTML = data.coins.message;
        document.getElementById("coins-error").style.display = "block";
      }
      if(data.daily.min.success === false){
        document.getElementById("daily-min-error").innerHTML = "Min: "+data.daily.min.message;
        document.getElementById("daily-min-error").style.display = "block";
      }
      if(data.daily.max.success === false){
        document.getElementById("daily-max-error").innerHTML = "Max: "+data.daily.max.message;
        document.getElementById("daily-max-error").style.display = "block";
      }
      document.querySelector(".save").style.display = "none";
      document.querySelector(".save").innerHTML = '<i class="fas fa-save pr-1 text-light"></i> Save all';
      document.querySelector(".save").disabled = false;
    }
  }).fail(function(){
    document.querySelector(".save").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
    document.querySelector(".save").className = 'save btn btn-danger mr-2 my-2';
    document.querySelector(".save").disabled = false;
  });
});