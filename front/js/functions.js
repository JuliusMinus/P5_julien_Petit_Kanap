const cartName = "cart";

export default {
  /**
   * fonction qui récupère l'id du canapé fournit en parametre d'URL
   * @returns string
   */
  getCanapeIdFromUrl() {
    return new URL(location.href).searchParams.get("_id");
  },
  /**
   * fonction qui récupère l'orderId de la commande fournit en paramètre d'URL
   * @returns string
   */
  getOrderIdFromUrl() {
    return new URL(location.href).searchParams.get("orderId");
  },

  /**
   *
   * @param {Object} canape - objet qui contient les données d'un canapé
   */
  hydrateCanape(canape) {
    const img = document.createElement("img");
    img.src = canape.imageUrl;
    img.alt = canape.altTxt;

    document.querySelector(".item__img").appendChild(img);
    document.querySelector("#title").textContent = canape.name;
    document.querySelector("#price").textContent = canape.price;
    document.querySelector("#description").textContent = canape.description;

    const colorSelector = document.querySelector("#colors");

    const addColorOption = (color) => {
      const colorOption = document.createElement("option");
      colorOption.value = color;
      colorOption.textContent = color;

      colorSelector.appendChild(colorOption);
    };

    canape.colors.forEach(addColorOption);
  },
  /**
   * Fonction qui retourne le contenu du panier ayant pour item cartName
   * @returns string
   */
  getItem() {
    return localStorage.getItem(cartName);
  },
  /**
   * Fonction qui enregistre le panier dans le local storage
   * si l'objet est vide, la clé "cart" sera supprimée du localStorage
   * @param {Object} obj - un objet qui contient les données du panier
   */
  setItem(obj) {
    if (Object.keys(obj).length == 0) {
      this.clearStorage();
    } else {
      localStorage.setItem(cartName, JSON.stringify(obj));
    }
  },
  /**
   * supprime la clé "cart" du localstorage
   */
  clearStorage() {
    localStorage.removeItem(cartName);
  },
  /**
   * fonction qui transforme un nombre entier en un nombre décimal à 2 chiffres après la virgule
   * @param {integer} price
   * @param {boolean} currency
   * @returns float
   */
  formatPrice(price, currency = true) {
    const currencyValue = currency ? " €" : "";
    return Number.parseFloat(price).toFixed(2) + currencyValue;
  },

  /**
   *
   * @param {string} cart - fonction qui affiche le nombre total de canapés dans le panier
   * et calcule le prix total
   */
  afficherPrixTotalEtNbCanape(cart) {
    if (cart) {
      let cartObj = JSON.parse(cart);
      //recalcule le prix total

      let prixtotalCalcul = [];
      let NbCanapeTotal = [];
      //aller chercher les prix dans le panier

      for (const id in cartObj) {
        const prixCanapeDansLePanier = cartObj[id][1];
        const nbCanape = cartObj[id][0];
        console.log(prixCanapeDansLePanier, nbCanape);
        const totalPriceCanape = prixCanapeDansLePanier * nbCanape;
        //mettre les prix du panier dans la variable "prixTotalCalcul"
        prixtotalCalcul.push(totalPriceCanape);
        NbCanapeTotal.push(nbCanape);
      }

      /**
       * additionne les prix du tableau de la variable "prixTotalcalcul" avec la méthode .reduce
       * @param {number} accumulator
       * @param {number} currentValue
       * @returns number
       */
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const prixTotal = this.formatPrice(
        prixtotalCalcul.reduce(reducer, 0),
        false
      );

      //additionne les nombres de canapes total

      const nbTotalCanape = NbCanapeTotal.reduce(reducer, 0);

      // on affiche les valaurs obtenues
      document.querySelector("#totalPrice").innerHTML = prixTotal;
      document.querySelector("#totalQuantity").innerHTML = nbTotalCanape;
    }
  },

  /**
   * fonction qui supprime les canapés du panier
   * @param {Object} cartObj
   * @param {number} idToDelete
   * @returns string
   */
  deleteCanape(cartObj, idToDelete, colorToDelete) {
    delete cartObj[idToDelete][colorToDelete];

    //set item
    this.setItem(cartObj);

    return JSON.stringify(cartObj);
  },

  /**
   * fonction qui retourne la clé Id de chaque canapé présent dans le panier
   * @returns Object
   */
  getIdsCanapeInCart() {
    const cart = JSON.parse(this.getItem());

    return Object.keys(cart);
  },
  modifyQuantity(cartObj, idCanape, color, newQuantity) {
    console.log(idCanape, color, newQuantity);
    cartObj[idCanape][color][0] = parseInt(newQuantity);

    //set item
    this.setItem(cartObj);

    return JSON.stringify(cartObj);
  },
};
