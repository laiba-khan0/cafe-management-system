const categories_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/categories";
const postCategories_URL = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev/categories";

let categoriesData = [];

const tbody = document.querySelector("#categoriesTable tbody");
const formSection = document.getElementById("categoriesFormSection");
const form = document.getElementById("categoriesForm");

function renderTable() {
  tbody.innerHTML = "";
  categoriesData.forEach(cat => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cat.category_id}</td>
      <td>${cat.name}</td>
      <td>${cat.description}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fetchCategories() {
  fetch(categories_URL)
    .then(res => res.json())
    .then(data => {
      categoriesData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch failed:", err));
}
fetchCategories();

document.querySelector("#showCategoriesFormBtn")?.addEventListener("click", () => {
  formSection.classList.remove("d-none");
  form.reset();
});
document.querySelector("#cancelCategoriesFormBtn")?.addEventListener("click", () => {
  form.reset();
  formSection.classList.add("d-none");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const description = form.description.value.trim();

  if (!name || !description) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newCategory = { name, description };

  fetch(postCategories_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCategory),
  })
    .then(res => res.json())
    .then(inserted => {
      categoriesData.push(inserted);
      renderTable();
      form.reset();
      formSection.classList.add("d-none");
      alert("✅ Category added!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Insert failed.");
    });
});
