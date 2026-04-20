const BASE_URL = "http://localhost:8080";

// 获取Token（添加Bearer前缀，与auth.js统一）
function getToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token ? `Bearer ${user.token}` : "";
}

/**
 * 通用请求函数
 * @param {string} url 接口路径
 * @param {string} method 请求方法
 * @param {object} body 请求体
 * @returns {Promise<any>} 响应数据
 */
async function request(url, method = "GET", body = null) {
    try {
        const options = {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
            // 处理跨域凭证（可选，根据后端配置）
            credentials: "same-origin"
        };

        // 非GET请求添加body
        if (method.toUpperCase() !== "GET" && body) {
            options.body = JSON.stringify(body);
        }

        // 处理GET请求的参数拼接
        if (method.toUpperCase() === "GET" && body) {
            const params = new URLSearchParams(body);
            url = `${url}?${params.toString()}`;
        }

        const res = await fetch(BASE_URL + url, options);

        // 处理非200状态码
        if (!res.ok) {
            throw new Error(`HTTP错误：${res.status}`);
        }

        const data = await res.json();

        if (data.code !== 200) {
            alert(data.message || "请求失败");
            throw new Error(data.message || "请求失败");
        }

        return data.data;
    } catch (error) {
        alert(`请求异常：${error.message}`);
        throw error; // 抛出错误让上层处理
    }
}


