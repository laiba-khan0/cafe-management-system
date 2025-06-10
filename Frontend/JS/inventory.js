const inventory_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/inventory";
const postInventory_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/inventory";

let inventoryData = [];

const tbody = document.querySelector("#inventoryTable tbody");
const formSection = document.getElementById("inventoryFormSection");
const form = document.getElementById("inventoryForm");

function renderTable() {
  tbody.innerHTML = "";
  inventoryData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.item_id}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.unit_price}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchInventory() {
  fetch(inventory_URL)
    .then(res => res.json())
    .then(data => {
      inventoryData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchInventory();

document.querySelector("#showInventoryFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelInventoryFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    name: form.name.value.trim(),
    quantity: form.quantity.value.trim(),
    unit_price: form.unit_price.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postInventory_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      inventoryData.push(inserted);
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
