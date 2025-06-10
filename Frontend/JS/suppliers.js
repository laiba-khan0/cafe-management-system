const suppliers_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/suppliers";
const postSuppliers_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/suppliers";

let suppliersData = [];

const tbody = document.querySelector("#suppliersTable tbody");
const formSection = document.getElementById("suppliersFormSection");
const form = document.getElementById("suppliersForm");

function renderTable() {
  tbody.innerHTML = "";
  suppliersData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.supplier_id}</td>
      <td>${item.name}</td>
      <td>${item.contact}</td>
      <td>${item.email}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchSuppliers() {
  fetch(suppliers_URL)
    .then(res => res.json())
    .then(data => {
      suppliersData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchSuppliers();

document.querySelector("#showSuppliersFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelSuppliersFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    name: form.name.value.trim(),
    contact: form.contact.value.trim(),
    email: form.email.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postSuppliers_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      suppliersData.push(inserted);
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
