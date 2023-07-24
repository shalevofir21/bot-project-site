$('form input').on('keypress', function(e) {
  return e.which !== 13;
});

function changes(){
  document.querySelector(".btn").style.visibility = "visible";
};


window.onclick = function(event) {
  if($(event.target).attr('class') == "modal") {
    $(".modal").each(function() {
      this.style.display = "none";
    })
  }
}

$(function(){
  if(!selectedOption){
    $("#option-1").click();
    document.querySelector(".btn").style.visibility = "hidden";
    selectedOption = "1";
  }else if(selectedOption === "1"){
    $("#option-1").click();
    document.querySelector(".btn").style.visibility = "hidden";
    selectedOption = "1";
  }else if(selectedOption === "2"){
    $("#option-2").click();
    document.querySelector(".btn").style.visibility = "hidden";
    selectedOption = "2";
    if(!selectedColor) return;
    $(`[value=${selectedColor}]`).attr('selected','selected');
  }
})

$('.select-role').each(function() {
  $(this).select2({
    width: "60%",
    placeholder: "Select role",
    maximumSelectionLength: 1,
    allowClear: true,
    multiple: true,
    language: {
      noResults: function () {
        return "Unknown role";
      },
      maximumSelected: function () {
        return "You can select only one role";
      }
    }
  });
});

$('.select-channel').each(function() {
  $(this).select2({
    width: "60%",
    placeholder: "Select channel",
    maximumSelectionLength: 1,
    allowClear: true,
    multiple: true,
    language: {
      noResults: function () {
        return "Unknown channel";
      },
      maximumSelected: function () {
        return "You can select only one channel";
      }
    }
  });
});

$("#option-1").click(() => {
  if(selectedOption === "1") return;
  selectedOption = "1";
  $("#modal").empty();
  $("#modal").append(`
  <br>
  <b class="text-light">Enabled: </b>
  <div class='switch' style="top: -20px;">
    <label>
      <input id="enabledCommand" type="checkbox" checked>
      <span class="slider round"></span>
    </label>
  </div>
  <br>
  <span id="verificationChannelCommand-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Select verification channel: </b>
  <select id="verificationChannelCommand" class="form-control form-control-sm select-channel" style="margin-bottom: 5px;" multiple>
  </select>
  <br><br>
  <span id="verificationRoleCommand-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Select verification role: </b>
  <select id="verificationRoleCommand" class="form-control form-control-sm select-role" style="margin-bottom: 5px;" multiple>
  </select>
  <br><br>
  <span id="verificationMessageCommand-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Enter verification message text: </b>
  <textarea id="verificationMessageCommand" placeholder="Message text" rows="5" cols="90" maxlength="1000">**Welcome To ${guildName}!\nTo Verify Write - \`${guildPrefix}verify\`**</textarea>
  <br>
  <br>`);

  $('.select-role').each(function() {
    $(this).select2({
      width: "60%",
      placeholder: "Select role",
      maximumSelectionLength: 1,
      allowClear: true,
      multiple: true,
      data: roles,
      language: {
        noResults: function () {
          return "Unknown role";
        },
        maximumSelected: function () {
          return "You can select only one role";
        }
      }
    });
  });

  $('.select-channel').each(function() {
    $(this).select2({
      width: "60%",
      placeholder: "Select channel",
      maximumSelectionLength: 1,
      allowClear: true,
      multiple: true,
      data: channels,
      language: {
        noResults: function () {
          return "Unknown channel";
        },
        maximumSelected: function () {
          return "You can select only one channel";
        }
      }
    });
  });
})

$("#option-2").click(() => {
  if(selectedOption === "2") return;
  selectedOption = "2";
  $("#modal").empty();
  $("#modal").append(`
  <br>
  <b class="text-light">Enabled: </b>
  <div class='switch' style="top: -20px;">
    <label>
      <input id="enabledButton" type="checkbox" checked>
      <span class="slider round"></span>
    </label>
  </div>
  <br>
  <span id="verificationChannelButton-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Select verification channel: </b>
  <select id="verificationChannelButton" class="form-control form-control-sm select-channel" style="margin-bottom: 5px;" multiple>
  </select>
  <br><br>
  <span id="verificationRoleButton-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Select verification role: </b>
  <select id="verificationRoleButton" class="form-control form-control-sm select-role" style="margin-bottom: 5px;" multiple>
  </select>
  <br><br>
  <span id="verificationMessageButton-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Enter verification message text: </b>
  <textarea id="verificationMessageButton" class="message" placeholder="Message text" rows="5" cols="90" maxlength="1000">**Welcome To ${guildName}!\nTo Verify Click On The Button Below**</textarea>
  <br><br>
  <span id="verificationButtonText-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Enter verification button text: </b>
  <input type="text" id="verificationButtonText" placeholder="Button text" value="✅" style="font-size:12pt; height:30px; width:60%;">
  <br><br>
  <span id="verificationButtonColor-error" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
  <b class="text-light">Enter verification button color: </b>
  <select id="verificationButtonColor" class="form-control-sm" style="margin-bottom: 5px;">
    <option value="DANGER">Red</option>
    <option value="SUCCESS">Green</option>
    <option value="PRIMARY">Blue</option>
    <option value="SECONDARY" selected>Gray</option>
  </select>
  <br>
  <br>`)
  

  $('.select-role').each(function() {
    $(this).select2({
      width: "60%",
      placeholder: "Select role",
      maximumSelectionLength: 1,
      allowClear: true,
      multiple: true,
      data: roles,
      language: {
        noResults: function () {
          return "Unknown role";
        },
        maximumSelected: function () {
          return "You can select only one role";
        }
      }
    });
  });

  $('.select-channel').each(function() {
    $(this).select2({
      width: "60%",
      placeholder: "Select channel",
      maximumSelectionLength: 1,
      allowClear: true,
      multiple: true,
      data: channels,
      language: {
        noResults: function () {
          return "Unknown channel";
        },
        maximumSelected: function () {
          return "You can select only one channel";
        }
      }
    });
  });
})


$('.btn').click(function(){
  document.querySelector(".btn").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
  document.querySelector(".btn").className = 'btn btn-success mr-2 my-2 float';
  document.querySelector(".btn").disabled = true;
  document.getElementsByName("error").forEach(function(ele, idx) {
    ele.style.display = "none";
  });

  if(selectedOption === "1"){
    var Data = {
      option: "1",
      enabled: document.getElementById("enabledCommand").checked,
      channel: document.getElementById("verificationChannelCommand").value,
      role: document.getElementById("verificationRoleCommand").value,
      message: $("#verificationMessageCommand").val(),
    }
  }else if(selectedOption === "2"){
    var Data = {
      option: "2",
      enabled: document.getElementById("enabledButton").checked,
      channel: document.getElementById("verificationChannelButton").value,
      role: document.getElementById("verificationRoleButton").value,
      message: $("#verificationMessageButton").val(),
      buttonText: $("#verificationButtonText").val(),
      buttonColor: document.getElementById("verificationButtonColor").value
    }
  }
  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    data: Data
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed){
      document.querySelector(".btn").innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.error || "No permissions"}`;
      document.querySelector(".btn").className = 'btn btn-danger mr-2 my-2 float';
      document.querySelector(".btn").disabled = false;
    }else{
      document.querySelector(".btn").innerHTML = '<i class="fas fa-save pr-1 text-light"></i> Save all';
      document.querySelector(".btn").style.visibility = "hidden";
      document.querySelector(".btn").disabled = false;
  
      if(data.option === "1"){
        if(data.channel.success === false){
          $("#verificationChannelCommand-error").text(data.channel.message);
          $("#verificationChannelCommand-error").css("display", "block");
        }
        if(data.role.success === false){
          $("#verificationRoleCommand-error").text(data.role.message);
          $("#verificationRoleCommand-error").css("display", "block");
        }
        if(data.message.success === false){
          $("#verificationMessageCommand-error").text(data.message.message);
          $("#verificationMessageCommand-error").css("display", "block");
        }
      }else if(data.option === "2"){
        if(data.channel.success === false){
          $("#verificationChannelButton-error").text(data.channel.message);
          $("#verificationChannelButton-error").css("display", "block");
        }
        if(data.role.success === false){
          $("#verificationRoleButton-error").text(data.role.message);
          $("#verificationRoleButton-error").css("display", "block");
        }
        if(data.message.success === false){
          $("#verificationMessageButton-error").text(data.message.message);
          $("#verificationMessageButton-error").css("display", "block");
        }
        if(data.buttonText.success === false){
          $("#verificationButtonText-error").text(data.buttonText.message);
          $("#verificationButtonText-error").css("display", "block");
        }
        if(data.buttonColor.success === false){
          $("#verificationButtonColor-error").text(data.buttonColor.message);
          $("#verificationButtonColor-error").css("display", "block");
        }
      }
    }
  }).fail(function(){
    document.querySelector(".btn").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
    document.querySelector(".btn").className = 'btn btn-danger mr-2 my-2 float';
    document.querySelector(".btn").disabled = false;
  });
});