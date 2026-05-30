import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChapterData, SceneData, DialogueData, ChoiceData } from '@/types/story'
import { useGameStore } from './game'
import { useBgmStore } from './bgm'

export enum TextSpeed {
  FAST = 30,
  NORMAL = 50,
  SLOW = 80
}

interface StoryUiState {
  isLoading: boolean
  error: string | null
  chapterData: ChapterData | null
  currentChapterId: string | null
  currentChapterTitle: string
  currentScene: SceneData | null
  currentSceneIndex: number
  currentDialogue: DialogueData | null
  currentDialogueIndex: number
  displayedText: string
  isTextComplete: boolean
  historyDialogues: DialogueData[]
  choices: ChoiceData[]
  bondChanges: Record<string, number>
  showBondIncrease: boolean
  isAutoPlay: boolean
  autoPlayInterval: number
  textSpeed: TextSpeed
  isChapterComplete: boolean
  nextChapterId: string | null
  lastIncreasedCharacter: string | null
  lastIncreasedPoints: number
}

export const useStoryStore = defineStore('story', () => {
  const gameStore = useGameStore()
  const bgmStore = useBgmStore()

  const state = ref<StoryUiState>({
    isLoading: false,
    error: null,
    chapterData: null,
    currentChapterId: null,
    currentChapterTitle: '',
    currentScene: null,
    currentSceneIndex: 0,
    currentDialogue: null,
    currentDialogueIndex: 0,
    displayedText: '',
    isTextComplete: true,
    historyDialogues: [],
    choices: [],
    bondChanges: {},
    showBondIncrease: false,
    isAutoPlay: false,
    autoPlayInterval: 3000,
    textSpeed: TextSpeed.NORMAL,
    isChapterComplete: false,
    nextChapterId: null,
    lastIncreasedCharacter: null,
    lastIncreasedPoints: 0
  })

  let typewriterInterval: number | null = null
  let autoPlayTimeout: number | null = null

  const currentBackground = computed(() => {
    return state.value.currentScene?.background || ''
  })

  const currentCharacters = computed(() => {
    return state.value.currentScene?.characters || []
  })

  const currentSpeaker = computed(() => {
    return state.value.currentDialogue?.speaker || ''
  })

  async function loadChapter(chapterId: string) {
    state.value.isLoading = true
    state.value.error = null

    try {
      const chapter = await loadChapterData(chapterId)
      if (chapter) {
        state.value = {
          ...state.value,
          isLoading: false,
          chapterData: chapter,
          currentChapterId: chapter.chapterId,
          currentChapterTitle: chapter.title,
          currentScene: chapter.scenes[0] || null,
          currentSceneIndex: 0,
          currentDialogue: null,
          currentDialogueIndex: 0,
          historyDialogues: [],
          choices: [],
          isChapterComplete: false,
          nextChapterId: null
        }

        gameStore.unlockChapter(chapterId)

        // 触发场景 BGM
        if (chapter.scenes[0]?.background) {
          bgmStore.playForScene(chapter.scenes[0].background)
          // 预加载背景图片
          preloadBackgroundImage(chapter.scenes[0].background)
        }

        // 预加载下一章
        preloadNextChapter(chapter.chapterId)

        nextDialogue()
      } else {
        state.value.isLoading = false
        state.value.error = '加载章节失败'
      }
    } catch (e) {
      state.value.isLoading = false
      state.value.error = (e as Error).message || '加载章节失败'
    }
  }

  function nextDialogue() {
    const scene = state.value.currentScene
    if (!scene) return

    if (!state.value.isTextComplete) {
      completeText()
      return
    }

    if (state.value.choices.length > 0) {
      return
    }

    const dialogueIndex = state.value.currentDialogueIndex
    const nextIndex = dialogueIndex + 1

    if (nextIndex < scene.dialogues.length) {
      updateDialogue(scene.dialogues[nextIndex], nextIndex)
    } else if (scene.choices && scene.choices.length > 0) {
      const changes = scene.bondChanges || {}
      const hasChanges = Object.keys(changes).length > 0
      state.value.choices = scene.choices
      state.value.bondChanges = changes
      state.value.showBondIncrease = hasChanges
      if (hasChanges) {
        applyBondChanges(changes)
      }
    } else {
      moveToNextScene()
    }
  }

  function makeChoice(choiceId: string) {
    const choice = state.value.choices.find(c => c.choiceId === choiceId)
    if (!choice) return

    state.value.choices = []
    state.value.showBondIncrease = false

    const chapter = state.value.chapterData
    if (!chapter) return

    const nextScene = chapter.scenes.find(s => s.sceneId === choice.nextSceneId)
    if (nextScene) {
      state.value.currentScene = nextScene
      state.value.currentSceneIndex = chapter.scenes.indexOf(nextScene)
      state.value.currentDialogue = null
      state.value.currentDialogueIndex = 0
      state.value.historyDialogues = []
      state.value.bondChanges = choice.bondChanges || {}

      if (choice.bondChanges) {
        applyBondChanges(choice.bondChanges)
      }

      // 触发场景 BGM
      if (nextScene.background) {
        bgmStore.playForScene(nextScene.background)
      }

      nextDialogue()
    } else {
      handleChapterComplete()
    }
  }

  function completeText() {
    if (typewriterInterval) {
      clearInterval(typewriterInterval)
      typewriterInterval = null
    }
    const dialogue = state.value.currentDialogue
    if (dialogue) {
      state.value.displayedText = dialogue.text
      state.value.isTextComplete = true
    }
  }

  function updateDialogue(dialogue: DialogueData, index: number) {
    const currentDialogue = state.value.currentDialogue

    if (currentDialogue) {
      state.value.historyDialogues = [...state.value.historyDialogues, currentDialogue]
      if (state.value.historyDialogues.length > 20) {
        state.value.historyDialogues = state.value.historyDialogues.slice(-20)
      }
    }

    state.value.currentDialogue = dialogue
    state.value.currentDialogueIndex = index
    state.value.displayedText = ''
    state.value.isTextComplete = false

    startTypewriter(dialogue.text)
  }

  function startTypewriter(text: string) {
    if (typewriterInterval) {
      clearInterval(typewriterInterval)
    }

    let index = 0
    typewriterInterval = window.setInterval(() => {
      if (index < text.length && !state.value.isTextComplete) {
        state.value.displayedText = text.substring(0, index + 1)
        index++
      } else {
        if (typewriterInterval) {
          clearInterval(typewriterInterval)
          typewriterInterval = null
        }
        state.value.displayedText = text
        state.value.isTextComplete = true
      }
    }, state.value.textSpeed)
  }

  function moveToNextScene() {
    const chapter = state.value.chapterData
    if (!chapter) return

    const nextSceneIndex = state.value.currentSceneIndex + 1
    if (nextSceneIndex < chapter.scenes.length) {
      const nextScene = chapter.scenes[nextSceneIndex]
      state.value.currentScene = nextScene
      state.value.currentSceneIndex = nextSceneIndex
      state.value.currentDialogue = null
      state.value.currentDialogueIndex = 0
      state.value.historyDialogues = []
      state.value.choices = []

      // 触发场景 BGM
      if (nextScene.background) {
        bgmStore.playForScene(nextScene.background)
        // 预加载背景图片
        preloadBackgroundImage(nextScene.background)
      }

      nextDialogue()
    } else {
      handleChapterComplete()
    }
  }

  function handleChapterComplete() {
    const chapter = state.value.chapterData
    if (!chapter) return

    const chapterNumber = chapter.number
    const nextChapterId = `chapter_${String(chapterNumber + 1).padStart(2, '0')}`

    gameStore.unlockChapter(nextChapterId)

    state.value.isChapterComplete = true
    state.value.nextChapterId = nextChapterId
    console.log(`Chapter ${chapter.chapterId} complete, next: ${nextChapterId}`)
  }

  function applyBondChanges(changes: Record<string, number>) {
    Object.entries(changes).forEach(([characterId, points]) => {
      gameStore.addBondPoints(characterId, points)
      state.value.lastIncreasedCharacter = characterId
      state.value.lastIncreasedPoints = points
    })
  }

  function toggleAutoPlay() {
    state.value.isAutoPlay = !state.value.isAutoPlay
    if (state.value.isAutoPlay) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }
  }

  function startAutoPlay() {
    autoPlayTimeout = window.setTimeout(function tick() {
      if (state.value.isAutoPlay) {
        nextDialogue()
        autoPlayTimeout = window.setTimeout(tick, state.value.autoPlayInterval)
      }
    }, state.value.autoPlayInterval)
  }

  function stopAutoPlay() {
    if (autoPlayTimeout) {
      clearTimeout(autoPlayTimeout)
      autoPlayTimeout = null
    }
  }

  function setTextSpeed(speed: TextSpeed) {
    state.value.textSpeed = speed
  }

  function setAutoPlayInterval(interval: number) {
    state.value.autoPlayInterval = interval
  }

  function saveProgress() {
    const scene = state.value.currentScene
    if (scene && state.value.currentChapterId) {
      gameStore.autoSave(
        state.value.currentChapterId,
        scene.sceneId,
        state.value.currentDialogueIndex
      )
    }
  }

  return {
    state,
    currentBackground,
    currentCharacters,
    currentSpeaker,
    loadChapter,
    nextDialogue,
    makeChoice,
    completeText,
    toggleAutoPlay,
    setTextSpeed,
    setAutoPlayInterval,
    saveProgress,
    preloadNextChapter,
    preloadBackgroundImage
  }
})

// 动态加载章节数据
async function loadChapterData(chapterId: string): Promise<ChapterData | null> {
  // 检查预加载缓存
  if (preloadCache.has(chapterId)) {
    console.log(`Loading chapter ${chapterId} from preload cache`)
    const cached = preloadCache.get(chapterId)!
    preloadCache.delete(chapterId)
    return cached
  }

  const maxRetries = 3
  const retryDelay = 1000

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 优先从 public 目录加载
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

      const response = await fetch(`${import.meta.env.BASE_URL}data/chapters/${chapterId}.json`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log(`Loaded chapter ${chapterId} from external file`, data)
        return data
      } else {
        console.warn(`Failed to load chapter ${chapterId}: HTTP ${response.status} (attempt ${attempt}/${maxRetries})`)
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.warn(`Timeout loading chapter ${chapterId} (attempt ${attempt}/${maxRetries})`)
      } else {
        console.warn(`Failed to load chapter ${chapterId} from public/data (attempt ${attempt}/${maxRetries}):`, e)
      }
    }

    // 等待后重试
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
    }
  }

  // 所有重试都失败，回退到内嵌数据
  console.log(`Falling back to embedded data for ${chapterId}`)
  return getEmbeddedChapter(chapterId)
}

function getEmbeddedChapter(_chapterId: string): ChapterData | null {
  // 目前所有章节都从 public/data/chapters 目录加载
  return null
}

// 预加载缓存
const preloadCache = new Map<string, ChapterData>()

// 预加载下一章
async function preloadNextChapter(chapterId: string): Promise<void> {
  const chapterNum = parseInt(chapterId.replace('chapter_', ''))
  const nextChapterId = `chapter_${String(chapterNum + 1).padStart(2, '0')}`

  if (preloadCache.has(nextChapterId)) {
    console.log(`Chapter ${nextChapterId} already preloaded`)
    return
  }

  try {
    console.log(`Preloading chapter ${nextChapterId}...`)
    const response = await fetch(`${import.meta.env.BASE_URL}data/chapters/${nextChapterId}.json`)
    if (response.ok) {
      const data = await response.json()
      preloadCache.set(nextChapterId, data)
      console.log(`Chapter ${nextChapterId} preloaded successfully`)
    }
  } catch (e) {
    console.warn(`Failed to preload chapter ${nextChapterId}:`, e)
  }
}

// 预加载背景图片
function preloadBackgroundImage(background: string): void {
  const baseUrl = import.meta.env.BASE_URL
  const bgImages: Record<string, string> = {
    office: `${baseUrl}data/images/city_1.jpg`,
    home_night: `${baseUrl}data/images/night_1.jpg`,
    chongqing_night: `${baseUrl}data/images/night_2.jpg`,
    chongqing_station: `${baseUrl}data/images/night_2.jpg`,
    station: `${baseUrl}data/images/night_2.jpg`,
    metro_station: `${baseUrl}data/images/night_2.jpg`,
    cafe_interior: `${baseUrl}data/images/cafe_1.jpg`,
    cafe: `${baseUrl}data/images/cafe_1.jpg`,
    restaurant: `${baseUrl}data/images/cafe_1.jpg`,
    hotpot_restaurant: `${baseUrl}data/images/cafe_1.jpg`,
    night_market: `${baseUrl}data/images/night_2.jpg`,
    night_street: `${baseUrl}data/images/night_2.jpg`,
    jinyun_mountain_trail: `${baseUrl}data/images/mountain_1.jpg`,
    jinyun_summit: `${baseUrl}data/images/mountain_2.jpg`,
    mountain_trail: `${baseUrl}data/images/mountain_1.jpg`,
    mountain_path: `${baseUrl}data/images/mountain_1.jpg`,
    mountain_viewpoint: `${baseUrl}data/images/mountain_2.jpg`,
    mountain_night: `${baseUrl}data/images/night_1.jpg`,
    mountain_rain: `${baseUrl}data/images/night_1.jpg`,
    dai_lake_picnic: `${baseUrl}data/images/mountain_1.jpg`,
    minsu: `${baseUrl}data/images/night_1.jpg`,
    romantic: `${baseUrl}data/images/romantic_1.jpg`,
    desert: `${baseUrl}data/images/night_2.jpg`,
    desert_night: `${baseUrl}data/images/night_1.jpg`,
    school_entrance: `${baseUrl}data/images/city_1.jpg`,
    meeting_hall: `${baseUrl}data/images/city_1.jpg`,
    school_office: `${baseUrl}data/images/city_1.jpg`,
    classroom: `${baseUrl}data/images/city_1.jpg`,
  }

  const url = bgImages[background]
  if (url) {
    const img = new Image()
    img.src = url
  }
}