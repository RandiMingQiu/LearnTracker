package com.learntracker.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 学习资源实体类，对应数据库中的resources表
 * 存储学习资源的基础信息，与标签是多对多关联
 */
@Data
@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 资源ID

    private String title; // 资源标题
    private String description; // 资源描述
    private String type; // 资源类型（视频/文档/课程等）
    private String url; // 资源链接

    // ====================== 这里是修复核心 ======================
    // 原来：private String status;
    @Enumerated(EnumType.STRING) // 数据库存储枚举的字符串名字，不是数字下标
    private StatusEnum status; // 资源状态，改为枚举类型
    // ==========================================================

    private LocalDateTime createTime; // 创建时间
    private LocalDateTime updateTime; // 更新时间

    /**
     * 多对多关联标签
     * joinTable：指定中间表（resource_tag）
     * joinColumns：当前实体在中间表的外键（resource_id）
     * inverseJoinColumns：关联实体在中间表的外键（tag_id）
     */
    @ManyToMany
    @JoinTable(
            name = "resource_tag",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags; // 关联的标签列表
}
