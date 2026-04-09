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