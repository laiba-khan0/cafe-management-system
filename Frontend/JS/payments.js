const payments_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/payments";
const postPayments_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/payments";

let paymentsData = [];

const tbody = document.querySelector("#paymentsTable tbody");
const formSection = document.getElementById("paymentsFormSection");
const form = document.getElementById("paymentsForm");

function renderTable() {
  tbody.innerHTML = "";
  paymentsData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.payment_id}</td>
      <td>${item.order_id}</td>
      <td>${item.amount}</td>
      <td>${item.payment_date}</td>
      <td>${item.method}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchPayments() {
  fetch(payments_URL)
    .then(res => res.json())
    .then(data => {
      paymentsData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchPayments();

document.querySelector("#showPaymentsFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelPaymentsFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    order_id: form.order_id.value.trim(),
    amount: form.amount.value.trim(),
    payment_date: form.payment_date.value.trim(),
    method: form.method.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postPayments_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      paymentsData.push(inserted);
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
