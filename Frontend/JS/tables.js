const tables_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/tables";
const postTables_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/tables";

let tablesData = [];

const tbody = document.querySelector("#tablesTable tbody");
const formSection = document.getElementById("tablesFormSection");
const form = document.getElementById("tablesForm");

function renderTable() {
  tbody.innerHTML = "";
  tablesData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.table_id}</td>
      <td>${item.capacity}</td>
      <td>${item.location}</td>
      <td>${item.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchTables() {
  fetch(tables_URL)
    .then(res => res.json())
    .then(data => {
      tablesData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchTables();

document.querySelector("#showTablesFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelTablesFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    capacity: form.capacity.value.trim(),
    location: form.location.value.trim(),
    status: form.status.value.trim()
  };

  if (Object.values(newItem).some(v => v === "")) {
    alert("⚠️ All fields are required.");
    return;
  }

  fetch(postTables_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(inserted => {
      tablesData.push(inserted);
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
