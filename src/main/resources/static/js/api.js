const BASE_URL = "http://localhost:8080";

function getToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
}

async function request(url, method="GET", body=null) {

    const res = await fetch(BASE_URL + url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken() || ""
        },
        body: body ? JSON.stringify(body) : null
    });

    const data = await res.json();

    if (data.code !== 200) {
        alert(data.message || "请求失败");
        throw new Error(data.message);
    }

    return data.data;
}



