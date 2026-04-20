// 基础请求工具封装（整合auth和api的通用逻辑，避免冗余）
const BASE_URL = "http://localhost:8080";

// 获取Token（添加Bearer前缀）
function getToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token ? `Bearer ${user.token}` : "";
}

// 登录函数
async function login() {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    // 空值校验
    if (!username || !password) {
        alert("用户名和密码不能为空！");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });

        const data = await res.json();

        if (data.code === 200) {
            localStorage.setItem("user", JSON.stringify(data.data));
            alert("登录成功！");
            location.href = "dashboard.html";
        } else {
            alert(`登录失败：${data.message || "未知错误"}`);
        }
    } catch (error) {
        alert(`网络异常：${error.message}`);
    }
}

// 注册函数（修正DOM ID匹配问题）
async function register() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // 空值校验
    if (!username || !email || !password) {
        alert("用户名、邮箱、密码不能为空！");
        return;
    }

    // 简单邮箱格式校验
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
        alert("请输入合法的邮箱地址！");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password})
        });

        const data = await res.json();

        if (data.code === 200) {
            alert("注册成功！请登录");
            location.href = "login.html";
        } else {
            alert(`注册失败：${data.message || "未知错误"}`);
        }
    } catch (error) {
        alert(`网络异常：${error.message}`);
    }
}

// 退出登录（新增）
function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}