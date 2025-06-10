const menu_items_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/menu_items";
const postMenu_items_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/menu_items";

let menu_itemsData = [];

const tbody = document.querySelector("#menu_itemsTable tbody");
const formSection = document.getElementById("menu_itemsFormSection");
const form = document.getElementById("menu_itemsForm");

function renderTable() {
  tbody.innerHTML = "";
  menu_itemsData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.menu_item_id}</td>
      <td>${item.name}</td>
      <td>${item.category_id}</td>
      <td>${item.price}</td>
      <td>${item.description}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchMenu_items() {
  fetch(menu_items_URL)
    .then(res => res.json())
    .then(data => {
      menu_itemsData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchMenu_items();

document.querySelector("#showMenu_itemsFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelMenu_itemsFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    name: form.name.value.trim(),
    category_id: form.category_id.value.trim(),
    price: form.price.value.trim(),
    description: form.description.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postMenu_items_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      menu_itemsData.push(inserted);
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
