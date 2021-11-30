import apiClient from "./apiClient.js";

const displayCanapes = async () => {
  //  apiClient.getCanapeList().then((canapes)=>{

  //  });

  const canapes = await apiClient.getCanapeList();
  const productsTemplate = document.querySelector("#productsTemplate");
  const items = document.querySelector("#items");
  canapes.forEach((canape) => {
    
    const clone = document.importNode(productsTemplate.content, true);
    
    clone.querySelector("a").href = `product.html?_id=${canape._id}`;
    clone.querySelector("img").alt = canape.altTxt;
    clone.querySelector("img").src = canape.imageUrl;
    clone.querySelector(".productName").textContent = canape.name;
    clone.querySelector(".productDescription").textContent = canape.description;

    items.appendChild(clone);
  });

};

displayCanapes();


