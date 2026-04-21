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
            throw new Error(`HTTP ${res.status}：${res.statusText}`);
        }

        const result = await res.json();

        if (result.code !== 200) {
            throw new Error(result.message || "操作失败");
        }

        return result.data;

    } catch (err) {
        alert("错误：" + err.message);
        throw err;
    }
}

// ================= 登录注册 =================
async function login() {
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");

    // 空值校验
    if (!loginUsername.value || !loginPassword.value) {
        alert("请输入用户名和密码");
        return;
    }

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
    const regUsername = document.getElementById("regUsername");
    const regPassword = document.getElementById("regPassword");
    const regEmail = document.getElementById("regEmail");

    // 空值校验
    if (!regUsername.value || !regPassword.value || !regEmail.value) {
        alert("请填写完整注册信息");
        return;
    }

    try {
        await request("/user/register", "POST", {
            username: regUsername.value,
            password: regPassword.value,
            email: regEmail.value
        });

        alert("注册成功，请登录");
        // 清空注册表单
        regUsername.value = "";
        regPassword.value = "";
        regEmail.value = "";

    } catch (e) {}
}

function logout() {
    localStorage.removeItem("token");
    location.href = "index.html";
}

// ================= 用户 =================
async function getUser() {
    try {
        const user = await request("/user/me");
        alert(`当前用户：\n用户名：${user.username}\n邮箱：${user.email}`);
    } catch (e) {}
}

// ================= 初始化 =================
function init() {
    loadTags().then(() => loadResources());
}

// ================= 标签 =================
let tagList = [];

async function loadTags() {
    try {
        tagList = await request("/tag") || [];

        let html = "<h3>标签管理</h3>";

        if (tagList.length === 0) {
            html += "暂无标签<br>";
        } else {
            tagList.forEach(t => {
                html += `
                    <div style="margin: 5px 0;">
                        ${t.name || "未命名标签"}
                        <button onclick="deleteTag(${t.id})" style="margin-left: 10px;">删除</button>
                    </div>
                `;
            });
        }

        html += `
            <div style="margin-top: 10px;">
                <input id="tagName" placeholder="新标签名称" style="padding: 5px;">
                <button onclick="addTag()" style="padding: 5px 10px;">添加</button>
            </div>
        `;

        document.getElementById("content").innerHTML = html;
    } catch (e) {}
}

async function addTag() {
    const tagName = document.getElementById("tagName");
    if (!tagName.value.trim()) {
        alert("请输入标签名称");
        return;
    }

    try {
        await request("/tag", "POST", { name: tagName.value.trim() });
        loadTags();
        tagName.value = ""; // 清空输入框
    } catch (e) {}
}

async function deleteTag(id) {
    if (!confirm("确定要删除这个标签吗？")) {
        return;
    }
    try {
        await request(`/tag/${id}`, "DELETE");
        loadTags();
    } catch (e) {}
}

// ================= 资源 =================
let currentPage = 1;
let currentStatus = "";
let currentTagId = "";

async function loadResources(page = 1) {
    // 边界判断：页码不能小于1
    if (page < 1) {
        alert("已经是第一页了");
        return;
    }
    currentPage = page;

    let url = `/resource/page?page=${page}&size=5`;
    if (currentStatus) url += `&status=${currentStatus}`;
    if (currentTagId) url += `&tagId=${currentTagId}`;

    try {
        const data = await request(url);

        let html = `
            <h3>资源中心</h3>
            <button onclick="showAddResource()" style="padding: 5px 10px;">新增资源</button><br><br>

            状态：
            <select onchange="filterStatus(this.value)" style="padding: 5px;">
                <option value="">全部</option>
                <option value="TODO" ${currentStatus === "TODO" ? "selected" : ""}>TODO</option>
                <option value="LEARNING" ${currentStatus === "LEARNING" ? "selected" : ""}>LEARNING</option>
                <option value="DONE" ${currentStatus === "DONE" ? "selected" : ""}>DONE</option>
            </select>

            标签：
            <select onchange="filterTag(this.value)" style="padding: 5px;">
                <option value="">全部</option>
                ${tagList.map(t => `<option value="${t.id}" ${currentTagId === t.id.toString() ? "selected" : ""}>${t.name || "未命名"}</option>`).join("")}
            </select>

            <hr>
        `;

        if (!data || !data.content || data.content.length === 0) {
            html += "暂无资源";
        } else {
            data.content.forEach(r => {
                html += `
                    <div style="margin: 10px 0; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                        <b>${r.title || "无标题"}</b> [${r.status || "未知"}]
                        <br>${r.description || "无描述"}
                        <br><a href="${r.url}" target="_blank" style="color: #0066cc;">打开链接</a>                
                        <br>标签：${(r.tags || []).map(t => t.name).join(", ") || "无"}
                        <br>
                        <button onclick="deleteResource(${r.id})" style="margin-top: 5px; margin-right: 5px;">删除</button>
                        <button onclick="loadNotes(${r.id})" style="margin-top: 5px;">笔记</button>
                    </div>
                `;
            });

            // 分页按钮
            html += `
                <div style="margin-top: 10px;">
                    <button onclick="loadResources(${page - 1})" ${page === 1 ? "disabled" : ""}>上一页</button>
                    <button onclick="loadResources(${page + 1})" ${!data.last ? "" : "disabled"}>下一页</button>
                    <span style="margin-left: 10px;">当前第${page}页</span>
                </div>
            `;
        }

        document.getElementById("content").innerHTML = html;
    } catch (e) {}
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
    if (!confirm("确定要删除这个资源吗？")) {
        return;
    }
    try {
        await request(`/resource/${id}`, "DELETE");
        loadResources(currentPage);
    } catch (e) {}
}

// ================= 新增资源 =================
function showAddResource() {
    let html = `
        <h3>新增资源</h3>

        <div style="margin: 5px 0;">
            <input id="title" placeholder="资源标题" style="padding: 5px; width: 300px;" required>
        </div>
        <div style="margin: 5px 0;">
            <input id="description" placeholder="资源描述" style="padding: 5px; width: 300px;">
        </div>
        <div style="margin: 5px 0;">
            <input id="type" placeholder="资源类型（如：文档/视频/课程）" style="padding: 5px; width: 300px;">
        </div>
        <div style="margin: 5px 0;">
            <input id="url" placeholder="资源链接" style="padding: 5px; width: 300px;" required>
        </div>

        <div style="margin: 10px 0;">
            状态：
            <select id="status" style="padding: 5px;">
                <option value="TODO">TODO</option>
                <option value="LEARNING">LEARNING</option>
                <option value="DONE">DONE</option>
            </select>
        </div>

        <div style="margin: 10px 0;">
            标签：<br>
            ${tagList.length === 0 ?
        "暂无可用标签，请先添加标签" :
        tagList.map(t => `
                    <label style="margin-right: 10px;">
                        <input type="checkbox" value="${t.id}">${t.name}
                    </label>
                `).join("")
    }
        </div>

        <div style="margin-top: 10px;">
            <button onclick="addResource()" style="padding: 5px 10px;">提交</button>
            <button onclick="loadResources()" style="padding: 5px 10px; margin-left: 10px;">返回</button>
        </div>
    `;

    document.getElementById("content").innerHTML = html;
}

async function addResource() {
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const type = document.getElementById("type");
    const url = document.getElementById("url");
    const status = document.getElementById("status");

    // 空值校验
    if (!title.value.trim() || !url.value.trim()) {
        alert("标题和链接不能为空");
        return;
    }

    const tagIds = [...document.querySelectorAll("input[type=checkbox]:checked")]
        .map(c => parseInt(c.value));

    try {
        await request("/resource", "POST", {
            title: title.value.trim(),
            description: description.value.trim(),
            type: type.value.trim(),
            url: url.value.trim(),
            status: status.value,
            tagIds
        });

        alert("创建成功");
        loadResources();
    } catch (e) {}
}

// ================= 笔记 =================
async function loadNotes(resourceId) {
    try {
        const notes = await request(`/note/resource/${resourceId}`) || [];

        let html = `<h3>资源笔记</h3>`;

        if (notes.length === 0) {
            html += "暂无笔记，点击下方输入框添加<br><br>";
        } else {
            notes.forEach(n => {
                html += `
                    <div style="margin: 5px 0; padding: 8px; border: 1px solid #eee;">
                        ${n.content || "空笔记"}
                        <button onclick="deleteNote(${n.id}, ${resourceId})" style="margin-left: 10px;">删除</button>
                    </div>
                `;
            });
            html += "<br>";
        }

        html += `
            <textarea id="noteContent" placeholder="输入笔记内容" style="width: 400px; height: 100px; padding: 5px;"></textarea><br>
            <button onclick="addNote(${resourceId})" style="padding: 5px 10px;">新增笔记</button>
            <button onclick="loadResources()" style="padding: 5px 10px; margin-left: 10px;">返回</button>
        `;

        document.getElementById("content").innerHTML = html;
    } catch (e) {}
}

async function addNote(resourceId) {
    const noteContent = document.getElementById("noteContent");
    if (!noteContent.value.trim()) {
        alert("笔记内容不能为空");
        return;
    }

    try {
        await request("/note", "POST", {
            resourceId,
            content: noteContent.value.trim()
        });

        loadNotes(resourceId);
        noteContent.value = ""; // 清空输入框
    } catch (e) {}
}

async function deleteNote(id, resourceId) {
    if (!confirm("确定要删除这条笔记吗？")) {
        return;
    }
    try {
        await request(`/note/${id}`, "DELETE");
        loadNotes(resourceId);
    } catch (e) {}
}

// ================= 全局挂载 =================
(function() {
    const exposedFunctions = [
        "login", "register", "logout", "getUser", "init",
        "loadTags", "loadResources", "deleteTag", "addTag",
        "filterStatus", "filterTag", "deleteResource",
        "showAddResource", "addResource", "loadNotes",
        "addNote", "deleteNote"
    ];

    exposedFunctions.forEach(fnName => {
        window[fnName] = window[fnName] || eval(fnName);
    });
})();

