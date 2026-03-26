const ADMIN_PASSWORD = "workspace2026";

const loginPanel = document.getElementById("loginPanel");
const adminPanel = document.getElementById("adminPanel");
const loginForm = document.getElementById("loginForm");
const adminPassword = document.getElementById("adminPassword");
const loginStatus = document.getElementById("loginStatus");
const logoutBtn = document.getElementById("logoutBtn");

const entryForm = document.getElementById("entryForm");
const entryId = document.getElementById("entryId");
const entryType = document.getElementById("entryType");
const entryCategory = document.getElementById("entryCategory");
const entryProjectType = document.getElementById("entryProjectType");
const entrySlug = document.getElementById("entrySlug");
const entryTitle = document.getElementById("entryTitle");
const entrySummary = document.getElementById("entrySummary");
const entryBody = document.getElementById("entryBody");
const entryCoverImage = document.getElementById("entryCoverImage");
const entrySourceLink = document.getElementById("entrySourceLink");
const entryGallery = document.getElementById("entryGallery");
const formStatus = document.getElementById("formStatus");
const entriesList = document.getElementById("entriesList");
const adminSearch = document.getElementById("adminSearch");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");

function setAdminView() {
    const loggedIn = window.WorkspaceCMS.isAdminLoggedIn();
    loginPanel.classList.toggle("hidden", loggedIn);
    adminPanel.classList.toggle("hidden", !loggedIn);
    if (loggedIn) renderEntries();
}

function clearForm() {
    entryForm.reset();
    entryId.value = "";
    entryProjectType.value = "Corporate";
    formStatus.textContent = "";
}

function fillForm(entry) {
    entryId.value = entry.id;
    entryType.value = entry.type;
    entryCategory.value = entry.category || "";
    entryProjectType.value = entry.projectType || "Corporate";
    entrySlug.value = entry.slug || "";
    entryTitle.value = entry.title || "";
    entrySummary.value = entry.summary || "";
    entryBody.value = entry.body || "";
    entryCoverImage.value = entry.coverImage || "";
    entrySourceLink.value = entry.sourceLink || entry.itemLink || "";
    entryGallery.value = (entry.gallery || []).join("\n");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderEntries() {
    const query = (adminSearch.value || "").trim().toLowerCase();
    const entries = window.WorkspaceCMS.loadEntries().filter(entry => {
        const haystack = `${entry.type} ${entry.title} ${entry.category} ${entry.summary}`.toLowerCase();
        return haystack.includes(query);
    });

    if (!entries.length) {
        entriesList.innerHTML = `<div class="entry-item"><p>No custom entries yet. Add your first one from the form.</p></div>`;
        return;
    }

    entriesList.innerHTML = entries.map(entry => `
        <article class="entry-item">
            <div class="entry-item-meta">
                <span class="entry-chip">${entry.type}</span>
                <span class="entry-chip">${entry.category || "Uncategorised"}</span>
            </div>
            <h4>${entry.title}</h4>
            <p>${entry.summary || "No short description yet."}</p>
            <div class="entry-item-actions">
                <button type="button" class="admin-btn" data-edit="${entry.id}">Edit</button>
                <button type="button" class="admin-btn" data-delete="${entry.id}">Delete</button>
            </div>
        </article>
    `).join("");
}

loginForm.addEventListener("submit", event => {
    event.preventDefault();
    if (adminPassword.value === ADMIN_PASSWORD) {
        window.WorkspaceCMS.setAdminSession(true);
        loginStatus.textContent = "";
        adminPassword.value = "";
        setAdminView();
    } else {
        loginStatus.textContent = "Wrong password. Change it later in admin.js before handoff.";
    }
});

logoutBtn?.addEventListener("click", () => {
    window.WorkspaceCMS.setAdminSession(false);
    setAdminView();
});

entryForm?.addEventListener("submit", event => {
    event.preventDefault();

    const entry = window.WorkspaceCMS.upsertEntry({
        id: entryId.value || undefined,
        type: entryType.value,
        category: entryCategory.value.trim(),
        projectType: entryProjectType.value,
        slug: entrySlug.value.trim(),
        title: entryTitle.value.trim(),
        summary: entrySummary.value.trim(),
        body: entryBody.value.trim(),
        coverImage: entryCoverImage.value.trim(),
        sourceLink: entrySourceLink.value.trim(),
        itemLink: entrySourceLink.value.trim(),
        gallery: entryGallery.value
    });

    formStatus.textContent = `${entry.type} saved. Refresh the relevant page to see it rendered on the site.`;
    clearForm();
    renderEntries();
});

entriesList?.addEventListener("click", event => {
    const editId = event.target.getAttribute("data-edit");
    const deleteId = event.target.getAttribute("data-delete");

    if (editId) {
        const entry = window.WorkspaceCMS.loadEntries().find(item => item.id === editId);
        if (entry) fillForm(entry);
    }

    if (deleteId) {
        window.WorkspaceCMS.deleteEntry(deleteId);
        renderEntries();
    }
});

adminSearch?.addEventListener("input", renderEntries);
resetBtn?.addEventListener("click", clearForm);

exportBtn?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(window.WorkspaceCMS.loadEntries(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workspace-studio-cms-export.json";
    link.click();
    URL.revokeObjectURL(url);
});

importInput?.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
        window.WorkspaceCMS.saveEntries(parsed);
        renderEntries();
        formStatus.textContent = "JSON import complete.";
    }
});

setAdminView();
