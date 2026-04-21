const BASE_URL = "http://localhost:8080";

// ===================== 请求封装 =====================
async function request(url, method = "GET", data = null) {
    const token = localStorage.getItem("token");

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (token) {
        options.headers["Authorization"] = token;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const res = await fetch(BASE_URL + url, options);
    const result = await res.json();

    if (result.code !== 200) {
        alert(result.message);
        throw new Error(result.message);
    }

    return result.data;
}

// ===================== 登录注册 =====================
async function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const data = await request("/user/login", "POST", { username, password });

        localStorage.setItem("token", data.token);

        alert("登录成功");
        location.href = "main.html";
    } catch (e) {}
}

async function register() {
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const email = document.getElementById("regEmail").value;

    try {
        await request("/user/register", "POST", { username, password, email });

        alert("注册成功，请登录");
    } catch (e) {}
}

// ===================== 用户 =====================
async function getUser() {
    const user = await request("/user/me");
    alert("当前用户：" + user);
}

// ===================== 标签 =====================
async function loadTags() {
    const tags = await request("/tag");

    let html = "<h3>标签</h3>";

    tags.forEach(t => {
        html += `
            <div>
                ${t.name}
                <button onclick="deleteTag(${t.id})">删</button>
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
    const name = document.getElementById("tagName").value;
    await request("/tag", "POST", { name });
    loadTags();
}

async function deleteTag(id) {
    await request(`/tag/${id}`, "DELETE");
    loadTags();
}

// ===================== 资源 =====================
async function loadResources(page = 1) {
    const data = await request(`/resource/page?page=${page}&size=5`);

    let html = "<h3>资源</h3>";

    data.content.forEach(r => {
        html += `
            <div>
                <b>${r.title}</b> (${r.status})
                <br>${r.description || ""}
                <br><a href="${r.url}" target="_blank">打开</a>
                <br>
                <button onclick="deleteResource(${r.id})">删除</button>
                <button onclick="loadNotes(${r.id})">笔记</button>
                <hr>
            </div>
        `;
    });

    html += `<button onclick="loadResources(${page + 1})">下一页</button>`;

    document.getElementById("content").innerHTML = html;
}

async function deleteResource(id) {
    await request(`/resource/${id}`, "DELETE");
    loadResources();
}

// ===================== 笔记 =====================
async function loadNotes(resourceId) {
    const notes = await request(`/note/resource/${resourceId}`);

    let html = "<h3>笔记</h3>";

    notes.forEach(n => {
        html += `
            <div>
                ${n.content}
                <button onclick="deleteNote(${n.id}, ${resourceId})">删</button>
            </div>
        `;
    });

    html += `
        <textarea id="noteContent"></textarea>
        <button onclick="addNote(${resourceId})">新增</button>
    `;

    document.getElementById("content").innerHTML = html;
}

async function addNote(resourceId) {
    const content = document.getElementById("noteContent").value;

    await request("/note", "POST", {
        resourceId,
        content
    });

    loadNotes(resourceId);
}

async function deleteNote(id, resourceId) {
    await request(`/note/${id}`, "DELETE");
    loadNotes(resourceId);
}