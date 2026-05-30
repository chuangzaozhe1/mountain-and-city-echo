# 山与城的回响 - Web 版本迁移计划

## 技术栈
- **框架**: Vue 3 + Composition API
- **构建**: Vite
- **类型**: TypeScript
- **状态**: Pinia (替代 ViewModel)
- **路由**: Vue Router
- **样式**: CSS (复用 Android 设计资源)

## 项目结构
```
web/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── game.ts         # 游戏状态 (替代 HomeViewModel)
│   │   ├── story.ts        # 故事引擎 (替代 StoryViewModel)
│   │   └── chapter.ts      # 章节管理 (替代 ChapterSelectViewModel)
│   ├── views/
│   │   ├── SplashView.vue
│   │   ├── HomeView.vue
│   │   ├── StoryView.vue   # 核心 - 打字机效果
│   │   ├── ChapterSelectView.vue
│   │   ├── AlbumView.vue
│   │   ├── SettingsView.vue
│   │   ├── CharacterGalleryView.vue
│   │   └── HikingMapView.vue
│   ├── components/
│   │   ├── ChoicePanel.vue
│   │   ├── CharacterDisplay.vue
│   │   ├── DialogueBox.vue
│   │   └── ChapterComplete.vue
│   ├── data/
│   │   └── (复用 Android 的 JSON 故事数据)
│   ├── assets/
│   │   └── (复用 Android 的资源文件)
│   └── styles/
│       └── variables.css
```

## 实现步骤

### Phase 1: 基础框架
1. 初始化 Vite + Vue 3 + TypeScript 项目
2. 配置路由
3. 创建基础布局和样式变量

### Phase 2: 核心功能
4. 实现故事数据加载 (复用 JSON)
5. 实现 StoryView (打字机效果、对话切换、选择分支)
6. 实现 HomeView (继续游戏、章节选择等)

### Phase 3: 扩展功能
7. 章节选择
8. 相册系统
9. 角色图鉴
10. 存档/读档 (localStorage)
11. 设置 (音量、文本速度等)

### Phase 4: 完善
12. 徒步地图
13. 动画效果
14. 响应式适配

## 关键实现细节

### StoryView (核心)
```vue
<template>
  <div class="story-screen" @click="handleClick">
    <img :src="currentBackground" class="background" />
    <CharacterDisplay :characters="currentCharacters" />
    <DialogueBox
      :speaker="currentSpeaker"
      :text="displayedText"
      :isComplete="isTextComplete"
      :showChoices="choices.length > 0"
    />
    <ChoicePanel v-if="choices.length > 0" :choices="choices" @select="makeChoice" />
  </div>
</template>
```

### 打字机效果
```typescript
function startTypewriter(text: string) {
  displayedText.value = ''
  let index = 0
  const interval = setInterval(() => {
    if (index < text.length) {
      displayedText.value += text[index]
      index++
    } else {
      clearInterval(interval)
      isTextComplete.value = true
    }
  }, textSpeed.value)
}
```

### 存档系统
- 使用 localStorage 存储游戏进度
- 存储结构: `{ chapterId, sceneId, dialogueIndex, bondPoints, unlockedChapters }`

## 资源复用
- 故事 JSON 数据文件直接复用
- 图片资源通过 import 或 public 目录访问
- 字体、颜色变量在 CSS 中定义

## 预估工作量
- Phase 1: 1-2 小时
- Phase 2: 3-4 小时
- Phase 3: 2-3 小时
- Phase 4: 2-3 小时
- **总计: ~10-12 小时**