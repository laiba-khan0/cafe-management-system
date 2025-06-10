const employees_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/employees";
const postEmployees_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/employees";

let employeesData = [];

const tbody = document.querySelector("#employeesTable tbody");
const formSection = document.getElementById("employeesFormSection");
const form = document.getElementById("employeesForm");

function renderTable() {
  tbody.innerHTML = "";
  employeesData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.employee_id}</td>
      <td>${item.first_name}</td>
      <td>${item.last_name}</td>
      <td>${item.position}</td>
      <td>${item.email}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchEmployees() {
  fetch(employees_URL)
    .then(res => res.json())
    .then(data => {
      employeesData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchEmployees();

document.querySelector("#showEmployeesFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelEmployeesFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    position: form.position.value.trim(),
    email: form.email.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postEmployees_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      employeesData.push(inserted);
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
