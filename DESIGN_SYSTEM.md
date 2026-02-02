# 冥想应用设计系统

## 概述

这是一套专为冥想应用设计的现代化设计系统，强调**清新、干净、大气**的视觉风格，完美支持亮色和暗色两套主题。

## 设计理念

### 核心价值
- **清新简洁** - 去除不必要的装饰，保持界面清爽
- **优雅大气** - 精致的字体、合理的留白、柔和的配色
- **双主题支持** - 完美适配亮色和暗色模式
- **高可访问性** - 符合 WCAG AA 标准，对比度 4.5:1+

---

## 色彩系统

### 亮色主题 (Light Mode)

| 用途 | 颜色名称 | Hex 值 | 说明 |
|------|---------|--------|------|
| 主色调 | Primary | `#6366F1` | 靛蓝色，专业且平静 |
| 主色调浅 | Primary Light | `#818CF8` | 用于悬停状态 |
| 主色调深 | Primary Dark | `#4F46E5` | 用于按下状态 |
| 次要色 | Secondary | `#8B5CF6` | 紫色，优雅神秘 |
| 次要色浅 | Secondary Light | `#A78BFA` | 用于悬停状态 |
| 强调色 | Accent | `#10B981` | 绿色，积极正面 |
| 强调色浅 | Accent Light | `#34D399` | 用于悬停状态 |
| 主背景 | BG Primary | `#FFFFFF` | 纯白背景 |
| 次背景 | BG Secondary | `#F8FAFC` | 浅灰背景 |
| 三级背景 | BG Tertiary | `#F1F5F9` | 更深的灰色 |
| 主文本 | Text Primary | `#0F172A` | 深色文本，对比度高 |
| 次文本 | Text Secondary | `#475569` | 中等灰色文本 |
| 三级文本 | Text Tertiary | `#64748B` | 浅灰色文本 |
| 边框 | Border | `#E2E8F0` | 浅灰边框 |
| 浅边框 | Border Light | `#F1F5F9` | 更浅的边框 |

### 暗色主题 (Dark Mode)

| 用途 | 颜色名称 | Hex 值 | 说明 |
|------|---------|--------|------|
| 主色调 | Primary | `#818CF8` | 更亮的靛蓝色 |
| 主色调浅 | Primary Light | `#A5B4FC` | 用于悬停状态 |
| 主色调深 | Primary Dark | `#6366F1` | 用于按下状态 |
| 次要色 | Secondary | `#A78BFA` | 更亮的紫色 |
| 次要色浅 | Secondary Light | `#C4B5FD` | 用于悬停状态 |
| 强调色 | Accent | `#34D399` | 更亮的绿色 |
| 强调色浅 | Accent Light | `#6EE7B7` | 用于悬停状态 |
| 主背景 | BG Primary | `#0F172A` | 深蓝黑色 |
| 次背景 | BG Secondary | `#1E293B` | 中等深色 |
| 三级背景 | BG Tertiary | `#334155` | 较浅的深色 |
| 主文本 | Text Primary | `#F1F5F9` | 浅色文本 |
| 次文本 | Text Secondary | `#CBD5E1` | 中等浅色 |
| 三级文本 | Text Tertiary | `#94A3B8` | 灰色文本 |
| 边框 | Border | `#334155` | 深色边框 |
| 浅边框 | Border Light | `#475569` | 较浅边框 |

---

## 字体系统

### 字体家族

```css
--font-display: 'Playfair Display', serif;  /* 标题字体 */
--font-body: 'Inter', sans-serif;           /* 正文字体 */
```

### Google Fonts 引入

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 字体使用规范

| 元素 | 字体 | 字重 | 大小 | 行高 |
|------|------|------|------|------|
| 大标题 | Playfair Display | 600 | 48-56px | 1.2 |
| 中标题 | Playfair Display | 600 | 32-40px | 1.3 |
| 小标题 | Playfair Display | 600 | 24-28px | 1.4 |
| 正文 | Inter | 400 | 16px | 1.7 |
| 小字 | Inter | 400 | 14px | 1.6 |
| 按钮 | Inter | 500 | 15px | 1.5 |

---

## 间距系统

基于 8px 网格系统：

```css
--spacing-unit: 8px;
```

| 名称 | 值 | 用途 |
|------|-----|------|
| xs | 4px | 极小间距 |
| sm | 8px | 小间距 |
| md | 16px | 中等间距 |
| lg | 24px | 大间距 |
| xl | 32px | 超大间距 |
| 2xl | 48px | 区块间距 |
| 3xl | 64px | 大区块间距 |
| 4xl | 80px | 页面区块间距 |

---

## 圆角系统

```css
--border-radius: 12px;      /* 标准圆角 */
--border-radius-lg: 16px;   /* 大圆角 */
--border-radius-xl: 24px;   /* 超大圆角 */
```

---

## 阴影系统

### 亮色主题阴影

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### 暗色主题阴影

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5);
```

---

## 组件规范

### 按钮

#### 主要按钮 (Primary)
- 背景：`var(--color-primary)`
- 文字：白色
- 圆角：`var(--border-radius)`
- 内边距：`12px 24px`
- 悬停：背景变为 `var(--color-primary-dark)`，向上移动 2px，添加阴影

#### 次要按钮 (Secondary)
- 背景：`var(--color-secondary)`
- 文字：白色
- 其他同主要按钮

#### 强调按钮 (Accent)
- 背景：`var(--color-accent)`
- 文字：白色
- 其他同主要按钮

#### 轮廓按钮 (Outline)
- 背景：透明
- 边框：`2px solid var(--color-primary)`
- 文字：`var(--color-primary)`
- 悬停：背景变为 `var(--color-primary)`，文字变白

### 卡片

- 背景：`var(--color-surface)`
- 边框：`1px solid var(--color-border)`
- 圆角：`var(--border-radius-lg)`
- 内边距：`32px`
- 阴影：`var(--shadow-md)`
- 悬停：向上移动 4px，阴影变为 `var(--shadow-xl)`

---

## 动画规范

### 过渡时间

```css
--transition-fast: 150ms;    /* 快速交互 */
--transition-base: 200ms;    /* 标准交互 */
--transition-slow: 300ms;    /* 慢速交互 */
```

### 缓动函数

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### 减少动画偏好

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 响应式断点

```css
/* 移动设备 */
@media (max-width: 640px) { }

/* 平板设备 */
@media (min-width: 641px) and (max-width: 1024px) { }

/* 桌面设备 */
@media (min-width: 1025px) { }
```

---

## 可访问性要求

### 对比度
- 正文文本：最低 4.5:1
- 大文本（18px+ 或 14px+ 粗体）：最低 3:1
- 图标和图形：最低 3:1

### 焦点状态
- 所有可交互元素必须有清晰的焦点指示
- 使用 `outline` 或 `box-shadow` 显示焦点

### 键盘导航
- Tab 顺序必须符合视觉顺序
- 所有功能必须可通过键盘访问

### 语义化 HTML
- 使用正确的 HTML 标签
- 为图片添加 alt 文本
- 为表单元素添加 label

---

## 实现示例

### CSS 变量定义

```css
:root {
    /* 亮色主题变量 */
}

[data-theme="dark"] {
    /* 暗色主题变量 */
}
```

### 主题切换 JavaScript

```javascript
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 页面加载时恢复主题
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

---

## 使用指南

1. **引入字体**：在 HTML `<head>` 中引入 Google Fonts
2. **定义变量**：复制 CSS 变量到你的样式文件
3. **使用变量**：在组件中使用 `var(--variable-name)`
4. **主题切换**：实现主题切换功能
5. **测试**：在两种主题下测试所有组件

---

## 设计文件

- **预览页面**：`design-preview.html`
- **设计系统文档**：`DESIGN_SYSTEM.md`（本文件）

---

## 更新日志

### v1.0.0 (2026-01-31)
- 初始版本发布
- 完整的亮色和暗色主题支持
- 基础组件库
- 完整的设计规范文档
