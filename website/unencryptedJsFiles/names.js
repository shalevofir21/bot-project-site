function changes(){
  document.querySelector(".save").style.visibility = "visible";
};

document.querySelector("form").oninput = () => {
  document.querySelector(".save").style.visibility = "visible";
};

$('form input').on('keypress', function(e) {
  return e.which !== 13;
});

// Array.from(document.querySelector("#select").options).forEach(function(option_element) {
//   let option_text = option_element.text;
//   let option_value = option_element.value;
//   let is_option_selected = option_element.selected;

//   console.log('Option Text : ' + option_text);
//   console.log('Option Value : ' + option_value);

//   console.log("\n\r");
// });
function add() {
  var ul = document.getElementById("list");
  var div = document.createElement("div");
  var error = document.createElement("span");
  error.setAttribute('id', "error");
  error.setAttribute('name', "error");
  error.setAttribute('class', "text-danger");
  error.setAttribute('style', "display: none; font-size: 25px;");
  div.appendChild(error);
  var text1 = document.createElement("span"); 
  var text2 = document.createElement("span"); 
  var textNode1 = document.createTextNode("Role: "); 
  var textNode2 = document.createTextNode("Name: "); 
  text1.appendChild(textNode1);
  text1.setAttribute('class', "text-light");
  text1.setAttribute('style', "font-size: larger;");
  div.appendChild(text1);
  var select = document.createElement("select");
  select.setAttribute('id', "select");
  select.setAttribute('class', "select form-control form-control-sm");
  div.appendChild(select);
  div.appendChild(document.createElement("br"));
  div.appendChild(document.createElement("br"));
  text2.appendChild(textNode2);
  text2.setAttribute('class', "text-light");
  text2.setAttribute('style', "font-size: larger;");
  div.appendChild(text2);
  var input = document.createElement("input");
  input.setAttribute('id', "name");
  input.setAttribute('style', "font-size:18pt; height:30px; width:60%;");
  input.setAttribute('placeholder', "Name | {member}");
  input.setAttribute('type', "text");
  div.appendChild(input);
  var button = document.createElement("button");
  button.setAttribute('class', "removebutton mt-4");
  button.onclick = function(){
    $(this).closest('div').remove();
    document.querySelector(".save").style.visibility = "visible";
  };
  var icon = document.createElement("i");
  icon.setAttribute('class', "fas fa-trash-alt");
  button.appendChild(icon);
  var buttonText = document.createTextNode(" Remove"); 
  button.appendChild(buttonText);
  div.appendChild(button);
  div.setAttribute('class', "list text-dark my-5");
  div.setAttribute('style', "max-width: 100%; height: auto; margin: auto;");
  ul.appendChild(div);
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
  document.querySelector(".save").style.visibility = "visible";
}

$('select').select2({
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

$(function(){				
  $('.save').click(function(e){
    document.querySelector(".save").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving';
    document.querySelector(".save").className = 'save btn btn-success mr-2 my-2 float';
    document.querySelector(".save").disabled = true;
    document.getElementsByName("error").forEach(function(ele, idx) {
      ele.style.display = "none";
    });
    function data() {
      let total = [], i = 0;
      $("select").each(function(){
        total.push({role: $(this).val(), name: $("input[id$='name']")[i].value});
        i++
      });
      return total;
    }
    $.ajax({
      url: document.URL,
      type: 'POST', 
      dataType: 'html',
      data: {
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

        data.forEach(d => {
          if(d.success === false){
            $("span[id$='error']").eq(d.number).text(d.message);
            $("span[id$='error']").eq(d.number).css("display", "block");
          }
        });
        // setTimeout(() => {
        //   document.getElementsByName("error").forEach(function(ele, idx) {
        //     ele.style.display = "none";
        //   });
        // }, 30000);
      }
    }).fail(function(){
      document.querySelector(".save").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
      document.querySelector(".save").className = 'save btn btn-danger mr-2 my-2 float';
      document.querySelector(".save").disabled = false;
    });
  });
});