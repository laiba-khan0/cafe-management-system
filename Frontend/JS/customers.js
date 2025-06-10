const customers_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/customers";
const postCustomers_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/customers";

let customersData = [];

const tbody = document.querySelector("#customersTable tbody");
const formSection = document.getElementById("customersFormSection");
const form = document.getElementById("customersForm");

function renderTable() {
  tbody.innerHTML = "";
  customersData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.customer_id}</td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.phone}</td>
      <td>${item.address}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchCustomers() {
  fetch(customers_URL)
    .then(res => res.json())
    .then(data => {
      customersData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchCustomers();

document.querySelector("#showCustomersFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelCustomersFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postCustomers_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      customersData.push(inserted);
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
