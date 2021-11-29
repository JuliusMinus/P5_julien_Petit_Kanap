/**
 * fonction qui retourne un tableau de canapes
 * @return array
 */
export default {
  getCanapeList() {
    return fetch("http://localhost:3000/api/products").then((res) =>
      res.json()
    );
  },
  getOneCanape(id) {
    return fetch("http://localhost:3000/api/products/" + id).then((res) =>
      res.json()
    );
  },
};
