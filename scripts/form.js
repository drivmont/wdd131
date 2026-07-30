const productSelect = document.getElementById("product");

const optionsHTML = products
  .map((product) => `<option value="${product.id}">${product.name}</option>`)
  .join("");

productSelect.insertAdjacentHTML("beforeend", optionsHTML);
