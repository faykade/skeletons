function start(){
  var button = document.getElementById("button");
  button.addEventListener("click",function(e){
    helloWorld(e);
  });
}

function helloWorld(e){
  var newElement = document.createElement("h3");
  newElement.innerHTML = "Hello World";
  document.body.appendChild(newElement);
}
