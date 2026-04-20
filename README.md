# LearnTracker - 学习资源跟踪系统

## 项目介绍
LearnTracker 是一款轻量级的学习资源管理系统，旨在帮助用户跟踪、管理各类学习资源（如教程、文档、视频、书籍等），支持资源分类、状态标记、标签管理、笔记记录等核心功能，同时提供用户登录鉴权机制，保障数据安全。

## 技术栈
| 技术 | 版本/说明 |
|------|-----------|
| 后端框架 | Spring Boot 3.x |
| 持久层 | Spring Data JPA |
| 数据库 | PostgreSQL |
| 鉴权 | JWT (JJWT) |
| 接口文档 | SpringDoc OpenAPI (Swagger UI) |
| 工具类 | Lombok、Jakarta Validation |
| 跨域 | Spring MVC CORS 配置 |

## 环境要求
1. JDK 17+（Spring Boot 3.x 最低要求）
2. MySQL 8.0+
3. Maven 3.6+ / Gradle 7.0+（可选）
4. IDE（IntelliJ IDEA/Eclipse）

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/learntracker.git
cd learntracker
