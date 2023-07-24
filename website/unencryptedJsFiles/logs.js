$('form input').on('keypress', function(e) {
  return e.which !== 13;
});

window.onclick = function(event) {
  if($(event.target).attr('class') == "modal") {
    $(".modal").each(function() {
      this.style.display = "none";
    })
  }
}

function changes(){
  document.querySelector(".btn").style.visibility = "visible";
}

function getId(id){
  if(id == 1) return {name: "Message deleted", db: "messageDeleted", type: "deleted", id: "messages-deleted"};
  else if(id == 2) return {name: "Message edited", db: "messageEdited", type: "updated", id: "messages-edited"};
  else if(id == 3) return {name: "Member joined", db: "memberJoined", type: "created", id: "member-joined"};
  else if(id == 4) return {name: "Member left", db: "memberLeft", type: "deleted", id: "member-left"};
  else if(id == 5) return {name: "Member roles updated", db: "memberRolesUpdated", type: "updated", id: "member-roles-updated"};
  else if(id == 6) return {name: "Member joined voice channel", db: "memberJoinedVoiceChannel", type: "created", id: "member-joined-voice-channel"};
  else if(id == 7) return {name: "Member left voice channel", db: "memberLeftVoiceChannel", type: "deleted", id: "member-left-voice-channel"};
  else if(id == 8) return {name: "Member server muted/deafened", db: "memberMuted", type: "deleted", id: "member-muted"};
  else if(id == 9) return {name: "Member server unmuted/undeafened", db: "memberUnmuted", type: "created", id: "member-unmuted"};
  else if(id == 10) return {name: "Member switched voice channel", db: "memberSwitchedVoiceChannel", type: "updated", id: "member-switched-voice-channel"};
  else if(id == 11) return {name: "Channel created", db: "channelCreated", type: "created", id: "channel-created"};
  else if(id == 12) return {name: "Channel deleted", db: "channelDeleted", type: "deleted", id: "channel-deleted"};
  else if(id == 13) return {name: "Role created", db: "roleCreated", type: "created", id: "role-created"};
  else if(id == 14) return {name: "Role deleted", db: "roleDeleted", type: "deleted", id: "role-deleted"};
}

function om(id){
  document.getElementById(id).style.display = "block";
  $(`.${id}-content`).empty();
  let dataS = $(`.${id}-content`).data()
  let data = [];
  for(let d in dataS){
    data.push(getId(dataS[d]))
  }
  $(`.${id}-content`).append(`<div class="lds-dual-ring"></div>`);
  $.ajax({
    url: "/get"+document.location.pathname,
    type: 'POST', 
    dataType: 'html',
    data: { data }
  }).done(function(data){
    if(!data) return cm(id);
    $(`.${id}-content`).empty();
    $(`.${id}-content`).append(data+`<br><button onclick="cm('${id}')" class="btn btn-secondary">Cancel</button>
    <button onclick="sm('${id}')" class="save-${id} btn btn-success">Save</button>`);

    $('select').select2({
      width: "40%",
      placeholder: "select channel",
      maximumSelectionLength: 1,
      allowClear: true,
      language: {
        noResults: function (params) {
          return "Unknown channel";
        },
        maximumSelected: function (params) {
          return "You can select only one channel";
        }
      }
    });
    
    $($('.select').data('select2').$container).addClass('test')
  }).fail(function(){
    $(`.${id}-content`).empty();
    $(`.${id}-content`).append(`<span class="text-danger" style="font-size: 30px;">Failed to load</span><br><button onclick="cm('${id}')" class="btn btn-secondary">Cancel</button> <button onclick="om('${id}')" class="btn btn-primary">Try again</button>`);
  });
}

function cm(id){
  document.getElementById(id).style.display = "none";
}

function sm(id){
  document.querySelector(`.save-${id}`).innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
  document.querySelector(`.save-${id}`).className = `save-${id} btn btn-success`;
  document.querySelector(`.save-${id}`).disabled = true;
  document.getElementsByName("error").forEach(function(ele, idx) {
    ele.style.display = "none";
  });
  if(id === "messages"){
    var sData = {
      category: "messages",
      deleted: {
        channel: document.getElementById("messages-deleted-channel").value,
        color: document.getElementById("messages-deleted-color").value,
        enabled: document.getElementById("messages-deleted-enabled").checked
      },
      edited: {
        channel: document.getElementById("messages-edited-channel").value,
        color: document.getElementById("messages-edited-color").value,
        enabled: document.getElementById("messages-edited-enabled").checked
      }
    }
  }else if(id === "members"){
    var sData = {
      category: "members",
      joined: {
        channel: document.getElementById("member-joined-channel").value,
        color: document.getElementById("member-joined-color").value,
        enabled: document.getElementById("member-joined-enabled").checked
      },
      left: {
        channel: document.getElementById("member-left-channel").value,
        color: document.getElementById("member-left-color").value,
        enabled: document.getElementById("member-left-enabled").checked
      },
      updated: {
        channel: document.getElementById("member-roles-updated-channel").value,
        color: document.getElementById("member-roles-updated-color").value,
        enabled: document.getElementById("member-roles-updated-enabled").checked
      }
    }
  }else if(id === "voice"){
    var sData = {
      category: "voice",
      joined: {
        channel: document.getElementById("member-joined-voice-channel-channel").value,
        color: document.getElementById("member-joined-voice-channel-color").value,
        enabled: document.getElementById("member-joined-voice-channel-enabled").checked
      },
      left: {
        channel: document.getElementById("member-left-voice-channel-channel").value,
        color: document.getElementById("member-left-voice-channel-color").value,
        enabled: document.getElementById("member-left-voice-channel-enabled").checked
      },
      muted: {
        channel: document.getElementById("member-muted-channel").value,
        color: document.getElementById("member-muted-color").value,
        enabled: document.getElementById("member-muted-enabled").checked
      },
      unmuted: {
        channel: document.getElementById("member-unmuted-channel").value,
        color: document.getElementById("member-unmuted-color").value,
        enabled: document.getElementById("member-unmuted-enabled").checked
      },
      switched: {
        channel: document.getElementById("member-switched-voice-channel-channel").value,
        color: document.getElementById("member-switched-voice-channel-color").value,
        enabled: document.getElementById("member-switched-voice-channel-enabled").checked
      }
    }
  }else if(id === "server"){
    var sData = {
      category: "server",
      channelCreated: {
        channel: document.getElementById("channel-created-channel").value,
        color: document.getElementById("channel-created-color").value,
        enabled: document.getElementById("channel-created-enabled").checked
      },
      channelDeleted: {
        channel: document.getElementById("channel-deleted-channel").value,
        color: document.getElementById("channel-deleted-color").value,
        enabled: document.getElementById("channel-deleted-enabled").checked
      },
      roleCreated: {
        channel: document.getElementById("role-created-channel").value,
        color: document.getElementById("role-created-color").value,
        enabled: document.getElementById("role-created-enabled").checked
      },
      roleDeleted: {
        channel: document.getElementById("role-deleted-channel").value,
        color: document.getElementById("role-deleted-color").value,
        enabled: document.getElementById("role-deleted-enabled").checked
      }
    }
  }
  $.ajax({
    url: document.URL,
    type: 'POST', 
    dataType: 'html',
    data: { sData }
  }).done(function(data){
    data = JSON.parse(data);
    if(data.failed === true){
      document.querySelector(`.save-${id}`).innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.error || "No permissions"}`;
      document.querySelector(`.save-${id}`).className = `save-${id} btn btn-danger`;
      document.querySelector(`.save-${id}`).disabled = false;
    }else{
      data.forEach(t => {
        if(t.success === false){
          $(`#error-${t.id}`).text(t.message);
          $(`#error-${t.id}`).css("display", "block");
        }
      })
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