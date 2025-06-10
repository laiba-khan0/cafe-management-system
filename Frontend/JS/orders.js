const orders_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/orders";
const postOrders_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/orders";

let ordersData = [];

const tbody = document.querySelector("#ordersTable tbody");
const formSection = document.getElementById("ordersFormSection");
const form = document.getElementById("ordersForm");

function renderTable() {
  tbody.innerHTML = "";
  ordersData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.order_id}</td>
      <td>${item.customer_id}</td>
      <td>${item.employee_id}</td>
      <td>${item.order_date}</td>
      <td>${item.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchOrders() {
  fetch(orders_URL)
    .then(res => res.json())
    .then(data => {
      ordersData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchOrders();

document.querySelector("#showOrdersFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelOrdersFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    customer_id: form.customer_id.value.trim(),
    employee_id: form.employee_id.value.trim(),
    order_date: form.order_date.value.trim(),
    status: form.status.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postOrders_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      ordersData.push(inserted);
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
