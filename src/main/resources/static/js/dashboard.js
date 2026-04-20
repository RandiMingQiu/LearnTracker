let currentResourceId = null;
let currentResource = null; // 存储当前选中的资源信息

// ===== 鉴权校验 =====
function checkAuth() {
    if (!localStorage.getItem("user")) {
        alert("请先登录！");
        location.href = "login.html";
    }
}

// ===== 标签 CRUD =====
async function loadTags() {
    try {
        const tags = await request("/tag");
        const tagList = document.getElementById("tagList");
        const tagSelect = document.getElementById("tagSelect");

        // 清空原有内容
        tagList.innerHTML = "";
        tagSelect.innerHTML = "";

        tags.forEach(t => {
            // 渲染标签列表（添加编辑按钮）
            tagList.innerHTML += `
                <div class="item" style="display: flex; justify-content: space-between; align-items: center;">
                    <span onclick="editTag(${t.id}, '${t.name}')">${t.name}</span>
                    <button onclick="deleteTag(${t.id})" style="width: auto; padding: 2px 8px;">×</button>
                </div>
            `;

            // 渲染标签下拉选项
            tagSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    } catch (error) {
        console.error("加载标签失败：", error);
    }
}

// 添加标签
async function addTag() {
    const tagNameInput = document.getElementById("tagName");
    const name = tagNameInput.value.trim();

    if (!name) {
        alert("标签名称不能为空！");
        return;
    }

    try {
        await request("/tag", "POST", {name});
        tagNameInput.value = ""; // 清空输入框
        loadTags(); // 重新加载标签
    } catch (error) {
        console.error("添加标签失败：", error);
    }
}

// 编辑标签（修正参数+回显）
async function editTag(id, oldName) {
    const newName = prompt("修改标签名称", oldName);
    if (!newName || newName.trim() === oldName) return;

    try {
        await request(`/tag/${id}`, "PUT", {name: newName.trim()});
        loadTags();
    } catch (error) {
        console.error("编辑标签失败：", error);
    }
}

// 删除标签
async function deleteTag(id) {
    if (!confirm("确定删除该标签吗？删除后关联资源的标签也会移除！")) return;

    try {
        await request(`/tag/${id}`, "DELETE");
        loadTags();
        loadResources(); // 重新加载资源
    } catch (error) {
        console.error("删除标签失败：", error);
    }
}

// ===== 资源 CRUD =====
// 获取选中的标签ID
function getSelectedTagIds() {
    const tagSelect = document.getElementById("tagSelect");
    return Array.from(tagSelect.selectedOptions).map(o => Number(o.value));
}

// 加载资源列表
async function loadResources(status = "") {
    try {
        // Spring Data JPA 分页从0开始
        const pageParams = {
            page: 0,
            size: 10,
            ...(status ? {status} : {})
        };
        const page = await request("/resource/page", "GET", pageParams);
        const resourceList = document.getElementById("resourceList");
        resourceList.innerHTML = "";

        page.content.forEach(r => {
            const tags = r.tags?.map(t => t.name).join(", ") || "无标签";
            // 渲染资源项（添加编辑按钮，阻止事件冒泡）
            resourceList.innerHTML += `
                <div class="item" onclick="loadNotes(${r.id}, ${JSON.stringify(r).replace(/"/g, '&quot;')})">
                    <b>${r.title}</b><br>
                    <small>类型：${r.type} | 状态：${r.status} | 标签：${tags}</small><br>
                    <div style="margin-top: 8px;">
                        <button onclick="event.stopPropagation();editResource(${r.id})" style="width: auto; padding: 4px 8px; margin-right: 4px;">编辑</button>
                        <button onclick="event.stopPropagation();deleteResource(${r.id})" style="width: auto; padding: 4px 8px;">删除</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("加载资源失败：", error);
    }
}

// 添加资源
async function addResource() {
    const title = document.getElementById("title").value.trim();
    const url = document.getElementById("url").value.trim();
    const type = document.getElementById("type").value.trim();
    const status = document.getElementById("status").value.trim();
    const tagIds = getSelectedTagIds();

    // 空值校验
    if (!title || !type || !url) {
        alert("标题、类型、链接不能为空！");
        return;
    }

    try {
        await request("/resource", "POST", {
            title,
            description: "", // 前端暂未添加描述输入框，可后续补充
            url,
            type,
            status: status || "TODO", // 默认状态
            tagIds
        });
        // 清空输入框
        document.getElementById("title").value = "";
        document.getElementById("url").value = "";
        document.getElementById("type").value = "";
        document.getElementById("status").value = "";
        document.getElementById("tagSelect").selectedIndex = -1;
        loadResources(); // 重新加载资源
    } catch (error) {
        console.error("添加资源失败：", error);
    }
}

// 编辑资源（回显原有数据）
async function editResource(id) {
    try {
        // 先获取资源原有数据
        const resource = await request(`/resource/${id}`, "GET"); // 需后端补充根据ID查询资源的接口
        currentResource = resource;

        const newTitle = prompt("修改资源标题", resource.title);
        const newUrl = prompt("修改资源链接", resource.url);
        const newType = prompt("修改资源类型", resource.type);
        const newStatus = prompt("修改资源状态（TODO/LEARNING/DONE/REVIEWING/ARCHIVED）", resource.status);

        if (!newTitle || !newUrl || !newType) return;

        await request(`/resource/${id}`, "PUT", {
            title: newTitle.trim(),
            url: newUrl.trim(),
            type: newType.trim(),
            status: newStatus?.trim() || resource.status,
            tagIds: getSelectedTagIds() || resource.tags.map(t => t.id)
        });

        loadResources();
    } catch (error) {
        console.error("编辑资源失败：", error);
    }
}

// 删除资源
async function deleteResource(id) {
    if (!confirm("确定删除该资源吗？关联的笔记也会被删除！")) return;

    try {
        await request(`/resource/${id}`, "DELETE");
        loadResources();
        // 清空笔记区域
        document.getElementById("noteList").innerHTML = "";
        currentResourceId = null;
    } catch (error) {
        console.error("删除资源失败：", error);
    }
}

// ===== 笔记 CRUD =====
// 加载资源对应的笔记
async function loadNotes(resourceId, resource) {
    currentResourceId = resourceId;
    currentResource = resource; // 存储当前资源信息

    try {
        const notes = await request(`/note/resource/${resourceId}`);
        const noteList = document.getElementById("noteList");
        noteList.innerHTML = "";

        if (notes.length === 0) {
            noteList.innerHTML = "<li style='color: #999;'>暂无笔记，点击添加按钮创建</li>";
            return;
        }

        notes.forEach(n => {
            noteList.innerHTML += `
                <li style="padding: 8px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <span>${n.content}</span>
                    <div>
                        <button onclick="editNote(${n.id})" style="width: auto; padding: 2px 6px; margin-right: 4px;">改</button>
                        <button onclick="deleteNote(${n.id})" style="width: auto; padding: 2px 6px;">删</button>
                    </div>
                </li>
            `;
        });
    } catch (error) {
        console.error("加载笔记失败：", error);
    }
}

// 添加笔记
async function addNote() {
    if (!currentResourceId) {
        alert("请先点击左侧资源列表中的一个资源！");
        return;
    }

    const noteContent = document.getElementById("noteContent");
    const content = noteContent.value.trim();

    if (!content) {
        alert("笔记内容不能为空！");
        return;
    }

    try {
        await request("/note", "POST", {
            resourceId: currentResourceId,
            content
        });
        noteContent.value = ""; // 清空输入框
        loadNotes(currentResourceId); // 重新加载笔记
    } catch (error) {
        console.error("添加笔记失败：", error);
    }
}

// 编辑笔记
async function editNote(id) {
    try {
        // 先获取原有笔记内容
        const notes = await request(`/note/resource/${currentResourceId}`);
        const note = notes.find(n => n.id === id);
        if (!note) return;

        const newContent = prompt("修改笔记内容", note.content);
        if (!newContent || newContent.trim() === note.content) return;

        await request(`/note/${id}`, "PUT", {
            resourceId: currentResourceId, // 需传递resourceId（后端DTO校验需要）
            content: newContent.trim()
        });
        loadNotes(currentResourceId);
    } catch (error) {
        console.error("编辑笔记失败：", error);
    }
}

// 删除笔记
async function deleteNote(id) {
    if (!confirm("确定删除该笔记吗？")) return;

    try {
        await request(`/note/${id}`, "DELETE");
        loadNotes(currentResourceId);
    } catch (error) {
        console.error("删除笔记失败：", error);
    }
}

// ===== 初始化 =====
window.onload = function () {
    checkAuth();
    loadTags();
    loadResources();

    // 添加退出登录按钮（仪表盘页面右上角，需在dashboard.html添加按钮）
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = logout;
    }
};