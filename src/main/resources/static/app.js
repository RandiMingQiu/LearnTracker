//浏览器打开：http://localhost:8080/index.html

const BASE_URL = "http://localhost:8080";

// 页面跳转
function goLogin() {
    window.location.href = "login.html";
}

function goRegister() {
    window.location.href = "register.html";
}

function goHome() {
    window.location.href = "index.html";
}

// 登录
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.code === 200) {
            alert("登录成功 ✅");

            // 👉 保存用户信息（后面你可以用）
            localStorage.setItem("user", JSON.stringify(data.data));

            // 👉 跳转（你说不需要复杂页面，这里先简单展示）
            document.body.innerHTML = `
                <div class="card">
                    <h2>欢迎，${username} 👋</h2>
                    <p>资源 / 笔记 / 标签（后续扩展）</p>
                </div>
            `;
        } else {
            alert(data.message || "登录失败 ❌");
        }

    } catch (err) {
        console.error(err);
        alert("网络错误，请检查后端是否启动 ❌");
    }
}

// 注册
async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (data.code === 200) {
            alert("注册成功 🎉");
            window.location.href = "index.html";
        } else {
            alert(data.message || "注册失败 ❌");
        }

    } catch (err) {
        console.error(err);
        alert("网络错误，请检查后端 ❌");
    }
}

//请求
async function request(url, method = "GET", body = null) {
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    try {
        const res = await fetch("http://localhost:8080" + url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token || ""
            },
            body: body ? JSON.stringify(body) : null
        });

        const data = await res.json();

        if (data.code !== 200) {
            throw new Error(data.message || "请求失败");
        }

        return data.data;

    } catch (err) {
        alert(err.message);
        throw err;
    }
}

//标签模块
async function loadTags() {
    const tags = await request("/tag");

    const list = document.getElementById("tagList");
    list.innerHTML = "";

    tags.forEach(tag => {
        list.innerHTML += `
            <li>
                ${tag.name}
                <button onclick="deleteTag(${tag.id})">删除</button>
            </li>
        `;
    });
}

async function addTag() {
    const name = document.getElementById("tagName").value;

    await request("/tag", "POST", { name });

    alert("添加成功");
    loadTags();
}

async function deleteTag(id) {
    await request(`/tag/${id}`, "DELETE");

    alert("删除成功");
    loadTags();
}

//Resource模块
async function loadResources() {
    const page = await request("/resource/page?page=0&size=10");

    const list = document.getElementById("resourceList");
    list.innerHTML = "";

    page.content.forEach(r => {
        const tagNames = r.tags.map(t => t.name).join(", ");

        list.innerHTML += `
            <li>
                <b>${r.title}</b> (${r.type})<br>
                标签: ${tagNames}<br>
                <a href="${r.url}" target="_blank">访问</a>
                <button onclick="deleteResource(${r.id})">删除</button>
            </li>
        `;
    });
}

async function addResource() {
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;
    const type = document.getElementById("type").value;
    const status = document.getElementById("status").value;

    await request("/resource", "POST", {
        title,
        url,
        type,
        status,
        tagIds: [] // 👉 先空，后面再升级
    });

    alert("添加成功");
    loadResources();
}

async function deleteResource(id) {
    await request(`/resource/${id}`, "DELETE");

    alert("删除成功");
    loadResources();
}

//标签显示
window.onload = function () {
    loadTags();
    loadResources();
};



