(function () {
    const STORAGE_KEY = "workspaceStudioCmsEntriesV1";
    const SESSION_KEY = "workspaceStudioAdminSessionV1";

    function loadEntries() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn("CMS entries could not be loaded.", error);
            return [];
        }
    }

    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function normalizeEntry(entry) {
        const type = entry.type || "publication";
        const title = entry.title || "Untitled";
        const slug = slugify(entry.slug || title);
        const gallery = Array.isArray(entry.gallery)
            ? entry.gallery.filter(Boolean)
            : String(entry.gallery || "")
                .split(/\r?\n|,/)
                .map(item => item.trim())
                .filter(Boolean);

        return {
            id: entry.id || `cms-${Date.now()}`,
            type,
            title,
            slug,
            category: entry.category || "",
            summary: entry.summary || "",
            body: entry.body || "",
            coverImage: entry.coverImage || "",
            gallery,
            sourceLink: entry.sourceLink || "",
            itemLink: entry.itemLink || "",
            projectType: entry.projectType || "Corporate",
            publishedAt: entry.publishedAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    function upsertEntry(entry) {
        const normalized = normalizeEntry(entry);
        const entries = loadEntries();
        const nextEntries = entries.filter(item => item.id !== normalized.id && !(item.type === normalized.type && item.slug === normalized.slug));
        nextEntries.unshift(normalized);
        saveEntries(nextEntries);
        return normalized;
    }

    function deleteEntry(id) {
        const entries = loadEntries().filter(item => item.id !== id);
        saveEntries(entries);
    }

    function getEntriesByType(type) {
        return loadEntries()
            .filter(item => item.type === type)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    function getEntry(type, slug) {
        return loadEntries().find(item => item.type === type && item.slug === slug) || null;
    }

    function isAdminLoggedIn() {
        return localStorage.getItem(SESSION_KEY) === "true";
    }

    function setAdminSession(value) {
        localStorage.setItem(SESSION_KEY, value ? "true" : "false");
    }

    window.WorkspaceCMS = {
        STORAGE_KEY,
        SESSION_KEY,
        loadEntries,
        saveEntries,
        slugify,
        upsertEntry,
        deleteEntry,
        getEntriesByType,
        getEntry,
        isAdminLoggedIn,
        setAdminSession
    };
})();
