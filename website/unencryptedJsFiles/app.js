let authWindow;
let inviteWindow;

window.addEventListener('authed', authComplete);
window.addEventListener('invited', inviteComplete);

$("button#login").click(function() {

  let h = 800;
  let w = 500;
  let left = (screen.width / 2) - ( w / 2);
  let top = (screen.height / 2) - (h / 2);
  if(authWindow){
    authWindow.close()
  }
  authWindow = window.open(loginUrl,'_blank','modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)

});

if(window.location.pathname.toLowerCase() !== "/login"){
  document.cookie = "previousPage=;path=/";
}

function authComplete(e) {
  if(!e) return;
  if (e.detail.data !== 'auth_complete') return;

  window.removeEventListener('authed', authComplete);

  location.href = e.detail.url;
  if(authWindow){
    authWindow.close();
  }
}


function invite(id){
  if(!event) return;
  if(id) inviteUrl += `&guild_id=${id}`;

  let h = 800;
  let w = 500;
  let left = (screen.width / 2) - ( w / 2);
  let top = (screen.height / 2) - (h / 2);
  if(inviteWindow){
    inviteWindow.close();
  }
  inviteWindow = window.open(inviteUrl,'_blank','modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)

};

if(window.location.pathname.toLowerCase() !== "/login"){
  document.cookie = "previousPage=;path=/";
}

function inviteComplete(e) {
  if(!e) return;
  if (e.detail.data !== 'invite_complete') return;
  
  window.removeEventListener('invited', inviteComplete);

  if(e.detail.guild){
    window.location.href = `/server/${e.detail.guild}`
  }
  if(inviteWindow){
    inviteWindow.close();
  }
}