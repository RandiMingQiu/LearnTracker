let currentResourceId = null;

// ===== 鉴权 =====
function checkAuth() {
    if (!localStorage.getItem("user")) {
        alert("请先登录");
        location.href = "login.html";
    }
}

// ===== 标签 CRUD =====
async function loadTags() {
    const tags = await request("/tag");
    tagList.innerHTML = "";

    tags.forEach(t => {
        tagList.innerHTML += `
            <div class="item">
                ${t.name}
                <button onclick="deleteTag(${t.id})">x</button>
            </div>
        `;
    });

    renderTagOptions(tags);
}

async function addTag() {
    await request("/tag", "POST", {name: tagName.value});
    loadTags();
}

async function editTag(id, oldName) {
    const name = prompt("新名字", oldName);
    if (!name) return;
    await request(`/tag/${id}`, "PUT", {name});
    loadTags();
}

async function deleteTag(id) {
    await request(`/tag/${id}`, "DELETE");
    loadTags();
}

// ===== 标签多选 =====
function renderTagOptions(tags) {
    tagSelect.innerHTML = tags.map(t =>
        `<option value="${t.id}">${t.name}</option>`
    ).join("");
}

function getSelectedTagIds() {
    return Array.from(tagSelect.selectedOptions).map(o => Number(o.value));
}

// ===== 资源 CRUD =====
async function loadResources() {
    const page = await request("/resource/page?page=0&size=10");
    resourceList.innerHTML = "";

    page.content.forEach(r => {
        const tags = r.tags.map(t => t.name).join(", ");

        resourceList.innerHTML += `
            <div class="item" onclick="loadNotes(${r.id})">
                <b>${r.title}</b><br>
                <small>${tags}</small><br>
                <button onclick="event.stopPropagation();deleteResource(${r.id})">删除</button>
            </div>
        `;
    });
}

async function addResource() {
    await request("/resource", "POST", {
        title: title.value,
        url: url.value,
        type: type.value,
        status: status.value,
        tagIds: getSelectedTagIds()
    });
    loadResources();
}

async function editResource(id) {
    const newTitle = prompt("新标题");
    if (!newTitle) return;

    await request(`/resource/${id}`, "PUT", {
        title: newTitle,
        url: url.value,
        type: type.value,
        status: status.value
    });

    loadResources();
}

async function deleteResource(id) {
    await request(`/resource/${id}`, "DELETE");
    loadResources();
}

// ===== Note CRUD =====
async function loadNotes(resourceId) {
    currentResourceId = resourceId;

    const notes = await request(`/note/resource/${resourceId}`);
    noteList.innerHTML = "";

    notes.forEach(n => {
        noteList.innerHTML += `
            <li>
                ${n.content}
                <button onclick="editNote(${n.id})">改</button>
                <button onclick="deleteNote(${n.id})">删</button>
            </li>`;
    });
}

async function addNote() {

    if (!currentResourceId) {
        alert("请先点击一个资源再添加笔记 ❗");
        return;
    }

    const content = noteContent.value;

    if (!content) {
        alert("内容不能为空");
        return;
    }

    await request("/note", "POST", {
        resourceId: currentResourceId,
        content
    });

    noteContent.value = "";
    loadNotes(currentResourceId);
}

async function editNote(id) {
    const content = prompt("新内容");
    await request(`/note/${id}`, "PUT", {content});
    loadNotes(currentResourceId);
}

async function deleteNote(id) {
    await request(`/note/${id}`, "DELETE");
    loadNotes(currentResourceId);
}

// ===== 初始化 =====
window.onload = function () {
    checkAuth();
    loadTags();
    loadResources();
};