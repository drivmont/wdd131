const params = new URLSearchParams(window.location.search);

const productId = params.get("product");
const matchedProduct = products.find((product) => product.id === productId);
const productName = matchedProduct ? matchedProduct.name : "an unknown product";

const rating = Number(params.get("rating")) || 0;
const starDisplay = "★".repeat(rating) + "☆".repeat(5 - rating);

const installDate = params.get("installDate") || "not provided";
const features = params.getAll("features");
const featuresText = features.length ? features.join(", ") : "none selected";
const review = params.get("review");
const username = params.get("username") || "Anonymous";

const summaryHTML = `
  <p><strong>Product:</strong> ${productName}</p>
  <p><strong>Rating:</strong> ${starDisplay}</p>
  <p><strong>Date of Installation:</strong> ${installDate}</p>
  <p><strong>Useful Features:</strong> ${featuresText}</p>
  ${review ? `<p><strong>Review:</strong> ${review}</p>` : ""}
  <p><strong>Submitted by:</strong> ${username}</p>
`;

document.getElementById("summary").innerHTML = summaryHTML;

const reviewCount = (parseInt(localStorage.getItem("reviewCount"), 10) || 0) + 1;
localStorage.setItem("reviewCount", reviewCount);
document.getElementById("reviewCount").textContent = reviewCount;
