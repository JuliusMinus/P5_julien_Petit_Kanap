import apiClient from "./apiClient.js";
import tools from "./functions.js";

//vérifier le contenu du panier
//si le panier est vide, on affiche un message pour dire que le panier est vide
//afficher un message pour dire que c'est vide

//sinon
//on récupere le panier
//on boucle sur les articles
//pour chaque article on fetch l'api
//on clone la template avec les données
//créer fonction de calcul du prix
let cart = tools.getItem();
//si le panier est vide on affiche un message pour dire que le panier est vide
if (!cart || Object.keys(cart).length === 0) {
  document.querySelector("#cartAndFormContainer").innerHTML =
    "<p>votre panier est vide</p>";
  //calculer le prix total
} else {
  let cartObj = JSON.parse(cart);
  
  const cartTemplate = document.querySelector("#cartTemplate");
  const items = document.querySelector("#cart__items");
  //affichage du contenu du panier
  for (const canapeId in cartObj) {
    for (const color in cartObj[canapeId]) {
      const nbProduct = cartObj[canapeId][color][0];
      

      //on récupère les informations concernant le canape

      apiClient.getOneCanape(canapeId).then((canape) => {
        // ajout du canape avec ses données
        const clone = document.importNode(cartTemplate.content, true);

        clone.querySelector(".cart__item").setAttribute("data-id", canape._id);
        clone.querySelector(".cart__item").setAttribute("data-color", color);
        clone.querySelector(".cart__item__img img").alt = canape.altTxt;
        clone.querySelector(".cart__item__img img").src = canape.imageUrl;
        clone.querySelector(".cart__item__content__titlePrice h2").textContent =
          canape.name + " " + color;
        clone.querySelector(".cart__item__content__titlePrice p").textContent =
          tools.formatPrice(canape.price * nbProduct);
        clone.querySelector(
          ".cart__item__content__settings__quantity input"
        ).value = nbProduct;
        //ajout d'un listener qui va ecouter le changement du nombre de produit et calculer le nouveau prix en consequence
        clone
          .querySelector(`input.itemQuantity`)
          .addEventListener("change", (e) => {
            const newNbProduct = e.currentTarget.value;

            e.currentTarget.parentElement.parentElement.parentElement.querySelector(
              ".cart__item__content__titlePrice p"
            ).textContent = tools.formatPrice(canape.price * newNbProduct);
            // /modification de la quantité dans le panier
     
              const canapeElement = e.currentTarget.parentElement.parentElement.parentElement
                .parentElement
        
            cart = tools.modifyQuantity(cartObj, canapeElement.dataset.id, canapeElement.dataset.color, newNbProduct);
            tools.afficherPrixTotalEtNbCanape(cart);
          });
        //ajout d'un listener sur le bouton de suppression du canape du panier
        clone.querySelector(".deleteItem").addEventListener("click", (e) => {
          const articleToDelete =
            e.currentTarget.parentElement.parentElement.parentElement
              .parentElement;
          const idToDelete = articleToDelete.dataset.id;
          const colorToDelete = articleToDelete.dataset.color;
          
          //suppression du produit du panier//
          cart = tools.deleteCanape(cartObj, idToDelete, colorToDelete);

          //suppression physique du produit dans le dom//
          items.removeChild(articleToDelete);
          tools.afficherPrixTotalEtNbCanape(cart);
        });

        items.appendChild(clone);
      });
    }
  }
  //calculer le prix total
  tools.afficherPrixTotalEtNbCanape(cart);

  //suppression des éléments dans le localstorage

  //----------------------------------------------------------------------------------
  //formulaire

  //sélection du bouton commander

  const btnCommand = document.querySelector("#order");
  //addEventlistener

  btnCommand.addEventListener("click", (e) => {
    e.preventDefault();

    //recupération des valeurs du formulaire

    const contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };
    //--------------gestion validation du formulaire---------------
    //regex commun a firstname lastname et city
    const communRegEx = (value) => {
      return /^[A-Za-z ,-]{2,50}$/.test(value);
    };

    //regex addresse

    const regExAddress = (value) => {
      return /^([a-zA-Z0-9 ,-]+)$/.test(value);
    };

    //regex email

    const regExEmail = (value) => {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
    };

    //controle de la validité du formulaire
    function firstNameControl() {
      const validFirstname = contact.firstName;
      if (communRegEx(validFirstname)) {
        document.querySelector("#firstNameErrorMsg").innerHTML = "";
        return true;
      } else {
        document.querySelector("#firstNameErrorMsg").innerHTML =
          "Votre prénom n'est pas au bon format";
        return false;
      }
    }

    function lastNameControl() {
      const validLastname = contact.lastName;
      if (communRegEx(validLastname)) {
        document.querySelector("#lastNameErrorMsg").innerHTML = "";
        return true;
      } else {
        document.querySelector("#lastNameErrorMsg").innerHTML =
          "Votre nom n'est pas au bon format";
        return false;
      }
    }

    function addressControl() {
      const validAddress = contact.address;
      if (regExAddress(validAddress)) {
        document.querySelector("#addressErrorMsg").innerHTML = "";
        return true;
      } else {
        document.querySelector("#addressErrorMsg").innerHTML =
          "Votre adresse n'est pas au bon format";
        return false;
      }
    }

    function cityControl() {
      const validCity = contact.city;
      if (communRegEx(validCity)) {
        document.querySelector("#cityErrorMsg").innerHTML = "";
        return true;
      } else {
        document.querySelector("#cityErrorMsg").innerHTML =
          "Votre ville n'est pas au bon format";
        return false;
      }
    }

    function eMailControl() {
      const validEmail = contact.email;
      if (regExEmail(validEmail)) {
        document.querySelector("#emailErrorMsg").innerHTML = "";
        return true;
      } else {
        document.querySelector("#emailErrorMsg").innerHTML =
          "Votre email n'est pas au bon format";
        return false;
      }
    }
    //--------------------fin  de la gestion de validation du formulaire
    //controle validité formulaire avant de confirmer la commande
    if (
      firstNameControl() &&
      lastNameControl() &&
      addressControl() &&
      cityControl() &&
      eMailControl()
    ) {
      const products = tools.getIdsCanapeInCart();
      const body = {
        contact,
        products,
      };
      
      //mettre l'objet "contact" dans le localstorage
      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          
          // on efface le panier à la clé "cart"
          tools.clearStorage();
          //on redirige vers la apge de confirmation
          document.location.href = `./confirmation.html?orderId=${data.orderId}`;
        });
    } //il y a erreur dans le formulaire
    else {
      return false;
    }
  });
}
