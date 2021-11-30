
import tools from "./functions.js";

const orderId = tools.getOrderIdFromUrl()

//on insere la valeur de l'orderId dans l'élément attendu
if(orderId == null || orderId == ""){
  alert("vous n'avez pas le droit d'acceder à cette page");
  document.location.href = `./index.html`;
}

document.querySelector("#orderId").innerHTML = orderId
