const order_items_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/order_items";
const postOrder_items_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/order_items";

let order_itemsData = [];

const tbody = document.querySelector("#order_itemsTable tbody");
const formSection = document.getElementById("order_itemsFormSection");
const form = document.getElementById("order_itemsForm");

function renderTable() {
  tbody.innerHTML = "";
  order_itemsData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.order_item_id}</td>
      <td>${item.order_id}</td>
      <td>${item.menu_item_id}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchOrderItems() {
  fetch(order_items_URL)
    .then(res => res.json())
    .then(data => {
      order_itemsData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchOrderItems();

document.querySelector("#showOrder_itemsFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelOrder_itemsFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    order_id: form.order_id.value.trim(),
    menu_item_id: form.menu_item_id.value.trim(),
    quantity: form.quantity.value.trim(),
    price: form.price.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postOrder_items_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      order_itemsData.push(inserted);
      renderTable();
      form.reset();
      formSection.classList.add("d-none");
      alert("✅ Inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Insert failed.");
    });
});
