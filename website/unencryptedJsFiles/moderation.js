$('form input').on('keypress', function(e) {
  return e.which !== 13;
});
function changes(){
  document.querySelector(".btn").style.visibility = "visible";
};

document.querySelector("form").oninput = () => {
  document.querySelector(".btn").style.visibility = "visible";
};

$(function(){				
  $('.btn').click(function(e){
    document.querySelector(".btn").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
    document.querySelector(".btn").className = 'btn btn-success mr-2 my-2 float';
    document.querySelector(".btn").disabled = true;
    document.getElementsByName("error").forEach(function(ele, idx) {
      ele.style.display = "none";
    });
    if(!$("#prefix").val()){
      document.getElementById("prefix").value = "!"
    };
    $.ajax({
      url: document.URL,
      type: 'POST', 
      dataType: 'html',
      data: {
        prefix: $("#prefix").val(),
        muteRole: document.getElementById("select-muteRole").value,
        welcomeChannel: document.getElementById("select-welcomeChannel").value,
        modlogchannel: document.getElementById("select-modlogchannel").value,
        anitbadwords: $("#select-anitbadwords").val()
      }
    }).done(function(data){
      data = JSON.parse(data)
      if(data.failed === true){
        document.querySelector(".btn").innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.error || "No permissions"}`;
        document.querySelector(".btn").className = 'btn btn-danger mr-2 my-2 float';
        document.querySelector(".btn").disabled = false;
      }else{
        document.querySelector(".btn").style.visibility = "hidden";
        document.querySelector(".btn").innerHTML = '<i class="fas fa-save pr-1 text-light"></i> Save all';
        document.querySelector(".btn").disabled = false;
        if(data.mute.success === false){// mute role
          document.getElementById("muteRole-error").innerHTML = data.mute.message;
          document.getElementById("muteRole-error").style.display = "block";
        };
        if(data.welcomeChannel.success === false){// welcome channel
          document.getElementById("welcomeChannel-error").innerHTML = data.welcomeChannel.message;
          document.getElementById("welcomeChannel-error").style.display = "block";
        };
        if(data.modlogchannel.success === false){// mod log channel
          document.getElementById("modlogchannel-error").innerHTML = data.modlogchannel.message;
          document.getElementById("modlogchannel-error").style.display = "block";
        };
        // setTimeout(() => {
        //   document.getElementsByName("error").forEach(function(ele, idx) {
        //     ele.style.display = "none";
        //   });
        // }, 30000);
      }
    }).fail(function(){
      document.querySelector(".btn").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
      document.querySelector(".btn").className = 'btn btn-danger mr-2 my-2 float';
      document.querySelector(".btn").disabled = false;
    });
  });
});

$('#select-muteRole').select2({
  width: "40%",
  placeholder: "Select mute role",
  maximumSelectionLength: 1,
  allowClear: true,
  language: {
    noResults: function (params) {
      return "Unknown role";
    },
    maximumSelected: function (params) {
      return "You can select only one role";
    }
  }
});

$('#select-welcomeChannel').select2({
  width: "40%",
  placeholder: "Select welcome channel",
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
$('#select-modlogchannel').select2({
  width: "40%",
  placeholder: "Select mod log channel",
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
$('#select-anitbadwords').select2({
  width: "40%",
  placeholder: "Write bad words",
  allowClear: false,
  tags: true,
  multiple: true,
  language: {
    noResults: function (params) {
      return null;
    }
  },
  createTag: function (params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }
    return {
      id: term,
      text: term,
      newTag: true
    }
  }
});