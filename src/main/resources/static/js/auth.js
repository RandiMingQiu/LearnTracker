//http://localhost:8080/index.html
async function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const res = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    const data = await res.json();

    if (data.code === 200) {
        localStorage.setItem("user", JSON.stringify(data.data));
        alert("登录成功");
        location.href = "dashboard.html";
    } else {
        alert(data.message);
    }
}

async function register() {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    const email = emailInput.value;
    //const password = passwordInput.value;

    const res = await fetch("http://localhost:8080/user/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password})
    });

    const data = await res.json();

    if (data.code === 200) {
        alert("注册成功");
        location.href = "index.html";
    } else {
        alert(data.message);
    }
}