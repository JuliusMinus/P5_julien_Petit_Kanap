import apiClient from "./apiClient.js";
import tools from "./functions.js";

//recupérer l'id qui est présent en parametre d'url
//voir URLSearchParams

//récuperer le canapé et remplir la page produit avec les données reçu du produit

const canapeId = tools.getCanapeIdFromUrl();

apiClient.getOneCanape(canapeId).then((canape) => {
  tools.hydrateCanape(canape);
});

/*ecouter panier et envoyer panier*/
document.querySelector("#addToCart").addEventListener("click", (e) => {
  console.log("click");
  e.preventDefault();
  if (document.querySelector("#colors").value == "") {
    alert("Veuillez séléctionner une couleur");
    return false;
  }
  //stocker ces valeurs dans le localstorage
  const nbProduct = parseInt(document.querySelector("#quantity").value);
  const price = parseInt(document.querySelector("#price").innerHTML);
  const color = document.querySelector("#colors").value;
  console.log(price);
  //on recupere le panier
  let cart = tools.getItem();

  // si le panier n'existe pas, on le créé

  if (!cart) {
    tools.setItem({ [canapeId]: { [color]: [nbProduct, price] } });
  } //si il existe on ajoute le produit et sa quantité
  else {
    let cartObj = JSON.parse(cart);
    console.log(cartObj);
    // si canapeid  est déja dans le panier, on l'incremente du nb de quantité
    if (canapeId in cartObj) {
      if (color in cartObj[canapeId]) {
        cartObj[canapeId][color][0] += nbProduct;
      } else {
        console.log(cartObj);
        cartObj[canapeId][color] = [nbProduct, price];
      }

      tools.setItem(cartObj);
    } // créeer une clé avec l'id canapé et la quantité
    else {
      cartObj[canapeId] = { [color]: [nbProduct, price] };
      tools.setItem(cartObj);
    }
  }
  alert("le produit a bien été ajouté au panier.");
});
