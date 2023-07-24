
function buy(id){
  if(!id || typeof id !== "string") return;

  $(`#btn-${id}`).html('<i style="font-size: 25px" class="fa fa-circle-notch fa-spin"></i>')
  $(`#btn-${id}`).addClass('btn-success').removeClass('btn-danger');
  $(`#btn-${id}`).prop('disabled', true);

  $.ajax({
    url: document.URL,
    type: 'POST',
    timeout: 5000,
    dataType: 'html',
    data: {
      action: "buy",
      item: id,
    }
  }).done(function(data){
    data = JSON.parse(data);

    if(data.success === true){
      $(`#btn-${id}`).html('Use')
      $(`#btn-${id}`).prop('disabled', false);
      $(`#btn-${id}`).attr('onclick', `use('${id}')`);
      $(`#btn-${id}`).addClass('btn-warning').removeClass('btn-success');
      if(data.coins){
        $("#coins").text("Coins: "+data.coins)
      }
    }else{
      if(data.loggedIn === false){
        document.cookie = `previousPage=${document.location.href};path=/`;
        $(`#btn-${id}`).html('<i class="fab fa-discord"></i> Login');
        $(`#btn-${id}`).prop('disabled', false);
        $(`#btn-${id}`).attr('onclick', "login()");
      }else{
        $(`#btn-${id}`).html('<i class="fas fa-exclamation-triangle"></i> '+data.error);
        $(`#btn-${id}`).addClass('btn-danger').removeClass('btn-success');
        $(`#btn-${id}`).prop('disabled', false);
        if(data.coins){
          $("#coins").text("Coins: "+data.coins)
        }
      }
    }
  }).fail(function(){
    $(`#btn-${id}`).html('<i class="fas fa-exclamation-triangle"></i> Action failed');
    $(`#btn-${id}`).addClass('btn-danger').removeClass('btn-success');
    $(`#btn-${id}`).prop('disabled', false);
  });
}

function use(id){
  if(!id || typeof id !== "string") return;

  $(`#btn-${id}`).html('<i style="font-size: 25px" class="fa fa-circle-notch fa-spin"></i>')
  $(`#btn-${id}`).addClass('btn-warning').removeClass('btn-danger');
  $(`#btn-${id}`).prop('disabled', true);

  $.ajax({
    url: document.URL,
    type: 'POST',
    timeout: 5000,
    dataType: 'html',
    data: {
      action: "use",
      item: id,
    }
  }).done(function(data){
    data = JSON.parse(data);

    if(data.success === true){
      $(`#btn-${id}`).html('Used')
      $(`#btn-${id}`).prop('disabled', true);
      $(`#btn-${id}`).removeAttr('onclick');
      $(`#btn-${id}`).addClass('btn-info').removeClass('btn-warning btn-danger');

    }else{
      if(data.loggedIn === false){
        document.cookie = `previousPage=${document.location.href};path=/`;
        $(`#btn-${id}`).html('<i class="fab fa-discord"></i> Login');
        $(`#btn-${id}`).prop('disabled', false);
        $(`#btn-${id}`).attr('onclick', "login()");
      }else{
        $(`#btn-${id}`).html('<i class="fas fa-exclamation-triangle"></i> '+data.error);
        $(`#btn-${id}`).addClass('btn-danger').removeClass('btn-success');
        $(`#btn-${id}`).prop('disabled', false);
      }
    }
  }).fail(function(){
    $(`#btn-${id}`).html('<i class="fas fa-exclamation-triangle"></i> Action failed');
    $(`#btn-${id}`).addClass('btn-danger').removeClass('btn-success');
    $(`#btn-${id}`).prop('disabled', false);
  });
}

function login(){
  document.location.href = "/login"
}