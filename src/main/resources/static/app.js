const BASE_URL = "http://localhost:8080";

// ================= 请求封装 =================
async function request(url, method = "GET", data = null) {
    const token = localStorage.getItem("token");

    const options = {
        method,
        headers: { "Content-Type": "application/json" }
    };

    if (token) options.headers["Authorization"] = token;
    if (data) options.body = JSON.stringify(data);

    try {
        const res = await fetch(BASE_URL + url, options);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();

        if (result.code !== 200) {
            throw new Error(result.message);
        }

        return result.data;

    } catch (err) {
        alert("错误：" + err.message);
        throw err;
    }
}

// ================= 登录注册 =================
async function login() {
    try {
        const data = await request("/user/login", "POST", {
            username: loginUsername.value,
            password: loginPassword.value
        });

        localStorage.setItem("token", data.token);
        alert("登录成功");
        location.href = "main.html";

    } catch (e) {}
}

async function register() {
    try {
        await request("/user/register", "POST", {
            username: regUsername.value,
            password: regPassword.value,
            email: regEmail.value
        });

        alert("注册成功，请登录");

    } catch (e) {}
}

function logout() {
    localStorage.removeItem("token");
    location.href = "index.html";
}

// ================= 用户 =================
async function getUser() {
    const user = await request("/user/me");
    alert("当前用户：" + user);
}

// ================= 初始化 =================
function init() {
    loadTags().then(() => loadResources());
}

// ================= 标签 =================
let tagList = [];

async function loadTags() {
    tagList = await request("/tag") || [];

    let html = "<h3>标签管理</h3>";

    if (tagList.length === 0) {
        html += "暂无标签<br>";
    }

    tagList.forEach(t => {
        html += `
            <div>
                ${t.name}
                <button onclick="deleteTag(${t.id})">删除</button>
            </div>
        `;
    });

    html += `
        <input id="tagName" placeholder="新标签">
        <button onclick="addTag()">添加</button>
    `;

    document.getElementById("content").innerHTML = html;
}

async function addTag() {
    await request("/tag", "POST", { name: tagName.value });
    loadTags();
}

async function deleteTag(id) {
    await request(`/tag/${id}`, "DELETE");
    loadTags();
}

// ================= 资源 =================
let currentPage = 1;
let currentStatus = "";
let currentTagId = "";

async function loadResources(page = 1) {
    currentPage = page;

    let url = `/resource/page?page=${page}&size=5`;
    if (currentStatus) url += `&status=${currentStatus}`;
    if (currentTagId) url += `&tagId=${currentTagId}`;

    const data = await request(url);

    let html = `
        <h3>资源中心</h3>
        <button onclick="showAddResource()">新增资源</button><br><br>

        状态：
        <select onchange="filterStatus(this.value)">
            <option value="">全部</option>
            <option value="TODO">TODO</option>
            <option value="LEARNING">LEARNING</option>
            <option value="DONE">DONE</option>
        </select>

        标签：
        <select onchange="filterTag(this.value)">
            <option value="">全部</option>
            ${tagList.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
        </select>

        <hr>
    `;

    if (!data.content || data.content.length === 0) {
        html += "暂无资源";
    }

    data.content.forEach(r => {
        html += `
            <div>
                <b>${r.title}</b> [${r.status}]
                <br>${r.description || ""}
                <br><a href="${r.url}" target="_blank">打开</a>                
                <br>标签：${(r.tags || []).map(t => t.name).join(", ")}
                <br>
                <button onclick="deleteResource(${r.id})">删除</button>
                <button onclick="loadNotes(${r.id})">笔记</button>
                <hr>
            </div>
        `;
    });

    html += `
        <button onclick="loadResources(${page - 1})">上一页</button>
        <button onclick="loadResources(${page + 1})">下一页</button>
    `;

    document.getElementById("content").innerHTML = html;
}

function filterStatus(s) {
    currentStatus = s;
    loadResources(1);
}

function filterTag(id) {
    currentTagId = id;
    loadResources(1);
}

async function deleteResource(id) {
    await request(`/resource/${id}`, "DELETE");
    loadResources(currentPage);
}

// ================= 新增资源 =================
function showAddResource() {
    let html = `
        <h3>新增资源</h3>

        <input id="title" placeholder="标题"><br>
        <input id="description" placeholder="描述"><br>
        <input id="type" placeholder="类型"><br>
        <input id="url" placeholder="链接"><br>

        状态：
        <select id="status">
            <option value="TODO">TODO</option>
            <option value="LEARNING">LEARNING</option>
            <option value="DONE">DONE</option>
        </select>

        <br>

        标签：
        ${tagList.map(t => `
            <label>
                <input type="checkbox" value="${t.id}">${t.name}
            </label>
        `).join("")}

        <br><br>

        <button onclick="addResource()">提交</button>
        <button onclick="loadResources()">返回</button>
    `;

    content.innerHTML = html;
}

async function addResource() {
    const tagIds = [...document.querySelectorAll("input[type=checkbox]:checked")]
        .map(c => parseInt(c.value));

    await request("/resource", "POST", {
        title: title.value,
        description: description.value,
        type: type.value,
        url: url.value,
        status: status.value,
        tagIds
    });

    alert("创建成功");
    loadResources();
}

// ================= 笔记 =================
async function loadNotes(resourceId) {
    const notes = await request(`/note/resource/${resourceId}`) || [];

    let html = `<h3>笔记</h3>`;

    if (notes.length === 0) {
        html += "暂无笔记<br>";
    }

    notes.forEach(n => {
        html += `
            <div>
                ${n.content}
                <button onclick="deleteNote(${n.id}, ${resourceId})">删除</button>
            </div>
        `;
    });

    html += `
        <textarea id="noteContent"></textarea><br>
        <button onclick="addNote(${resourceId})">新增</button>
        <button onclick="loadResources()">返回</button>
    `;

    content.innerHTML = html;
}

async function addNote(resourceId) {
    await request("/note", "POST", {
        resourceId,
        content: noteContent.value
    });

    loadNotes(resourceId);
}

async function deleteNote(id, resourceId) {
    await request(`/note/${id}`, "DELETE");
    loadNotes(resourceId);
}

// ================= 关键：挂载到全局 =================
window.login = login;
window.register = register;
window.logout = logout;
window.getUser = getUser;
window.init = init;
window.loadTags = loadTags;
window.loadResources = loadResources;
window.deleteTag = deleteTag;
window.addTag = addTag;
window.filterStatus = filterStatus;
window.filterTag = filterTag;
window.deleteResource = deleteResource;
window.showAddResource = showAddResource;
window.addResource = addResource;
window.loadNotes = loadNotes;
window.addNote = addNote;
window.deleteNote = deleteNote;