// 音乐生成器 - 使用更高级的音乐理论创建悦耳的环境音乐

export interface MusicStyle {
  name: string
  scale: number[]
  tempo: number
  mood: string
  progressions: number[][]
  rhythms: number[]
}

// 音乐风格配置
export const MUSIC_STYLES: Record<string, MusicStyle> = {
  mountain: {
    name: '山野清风',
    scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],
    tempo: 72,
    mood: 'peaceful',
    progressions: [[0, 4, 5, 3], [0, 3, 4, 0], [0, 5, 3, 4]],
    rhythms: [1, 0.5, 0.75, 0.25, 1, 0.5, 0.75, 0.25]
  },
  cafe: {
    name: '咖啡时光',
    scale: [220.00, 246.94, 261.63, 329.63, 349.23, 440.00, 493.88, 523.25],
    tempo: 85,
    mood: 'warm',
    progressions: [[0, 3, 4, 0], [0, 5, 3, 4], [0, 4, 5, 3]],
    rhythms: [0.75, 0.25, 1, 0.5, 0.75, 0.25, 1, 0.5]
  },
  city: {
    name: '城市夜景',
    scale: [196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88],
    tempo: 95,
    mood: 'urban',
    progressions: [[0, 3, 4, 3], [0, 5, 3, 4], [0, 4, 5, 3]],
    rhythms: [0.5, 0.5, 0.75, 0.25, 0.5, 0.5, 0.75, 0.25]
  },
  romantic: {
    name: '心动瞬间',
    scale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
    tempo: 68,
    mood: 'romantic',
    progressions: [[0, 3, 4, 0], [0, 5, 3, 4], [0, 4, 3, 5]],
    rhythms: [1, 0.75, 0.5, 0.75, 1, 0.75, 0.5, 0.75]
  },
  healing: {
    name: '治愈时刻',
    scale: [174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 392.00, 440.00],
    tempo: 60,
    mood: 'healing',
    progressions: [[0, 4, 5, 3], [0, 3, 4, 0], [0, 5, 4, 3]],
    rhythms: [1.5, 0.5, 1, 0.5, 1.5, 0.5, 1, 0.5]
  },
  default: {
    name: '轻音乐',
    scale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
    tempo: 80,
    mood: 'neutral',
    progressions: [[0, 4, 5, 3], [0, 3, 4, 0], [0, 5, 3, 4]],
    rhythms: [1, 0.5, 0.75, 0.25, 1, 0.5, 0.75, 0.25]
  }
}

// 场景到音乐风格的映射
export const SCENE_TO_MUSIC: Record<string, string> = {
  // 山野场景
  jinyun_mountain_trail: 'mountain',
  jinyun_summit: 'mountain',
  mountain_trail: 'mountain',
  mountain_path: 'mountain',
  mountain_viewpoint: 'mountain',
  wugongshan: 'mountain',
  geluoshan: 'mountain',
  changbaishan: 'mountain',
  jinfoshan: 'mountain',
  nanshan: 'mountain',
  desert: 'mountain',
  desert_night: 'mountain',

  // 咖啡店场景
  cafe: 'cafe',
  coffee_shop: 'cafe',
  restaurant: 'cafe',
  hotpot_restaurant: 'cafe',

  // 城市/夜市场景
  chongqing_night: 'city',
  chongqing_station: 'city',
  station: 'city',
  night_market: 'city',
  home_night: 'city',
  office: 'city',
  school_office: 'city',
  school_entrance: 'city',
  meeting_hall: 'city',
  classroom: 'city',

  // 湖边/野餐场景
  dai_lake_picnic: 'healing',
  minsu: 'healing',

  // 浪漫场景
  romantic: 'romantic'
}

// 角色专属音乐风格
export const CHARACTER_TO_MUSIC: Record<string, string> = {
  suqingyan: 'cafe',
  linwanxing: 'healing',
  xuzhinan: 'city'
}

export class MusicGenerator {
  private audioContext: AudioContext
  private masterGain: GainNode
  private reverbNode: ConvolverNode
  private reverbGain: GainNode
  private dryGain: GainNode
  private activeOscillators: OscillatorNode[] = []
  private scheduledNotes: number[] = []
  private isPlaying = false
  private currentStyle: string = 'default'
  private progressionIndex = 0
  private noteIndex = 0

  constructor(audioContext: AudioContext, masterGain: GainNode) {
    this.audioContext = audioContext
    this.masterGain = masterGain

    // 创建混响效果
    this.reverbNode = audioContext.createConvolver()
    this.reverbGain = audioContext.createGain()
    this.dryGain = audioContext.createGain()

    // 创建混响脉冲响应
    const sampleRate = audioContext.sampleRate
    const length = sampleRate * 3 // 3秒混响
    const impulse = audioContext.createBuffer(2, length, sampleRate)
    const impulseL = impulse.getChannelData(0)
    const impulseR = impulse.getChannelData(1)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      const decay = Math.exp(-t * 2.5)
      impulseL[i] = (Math.random() * 2 - 1) * decay
      impulseR[i] = (Math.random() * 2 - 1) * decay
    }

    this.reverbNode.buffer = impulse
    this.reverbGain.gain.value = 0.25
    this.dryGain.gain.value = 0.75

    // 连接音频图
    this.masterGain.connect(this.dryGain)
    this.dryGain.connect(audioContext.destination)

    this.masterGain.connect(this.reverbNode)
    this.reverbNode.connect(this.reverbGain)
    this.reverbGain.connect(audioContext.destination)
  }

  // 创建音色
  private createTone(
    freq: number,
    type: OscillatorType = 'sine',
    gainValue: number = 0.1,
    detune: number = 0
  ): { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null {
    try {
      const osc = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()
      const filter = this.audioContext.createBiquadFilter()

      osc.type = type
      osc.frequency.value = freq
      osc.detune.value = detune

      // 低通滤波器
      filter.type = 'lowpass'
      filter.frequency.value = 1800
      filter.Q.value = 0.7

      gain.gain.value = gainValue

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      return { osc, gain, filter }
    } catch (e) {
      return null
    }
  }

  // 播放和弦
  private playChord(freqs: number[], duration: number, volume: number = 0.06) {
    freqs.forEach((freq, i) => {
      const tone = this.createTone(freq, 'triangle', volume, (i - 1) * 5)
      if (tone) {
        const now = this.audioContext.currentTime

        // 柔和的 ADSR 包络
        tone.gain.gain.setValueAtTime(0, now)
        tone.gain.gain.linearRampToValueAtTime(volume, now + 0.15)
        tone.gain.gain.setValueAtTime(volume * 0.8, now + duration - 0.3)
        tone.gain.gain.linearRampToValueAtTime(0, now + duration)

        tone.osc.start(now)
        tone.osc.stop(now + duration)

        this.activeOscillators.push(tone.osc)
      }
    })
  }

  // 播放旋律音符
  private playMelodyNote(freq: number, duration: number, volume: number = 0.1) {
    const tone = this.createTone(freq, 'sine', volume)
    if (tone) {
      const now = this.audioContext.currentTime

      // 旋律的 ADSR 包络
      tone.gain.gain.setValueAtTime(0, now)
      tone.gain.gain.linearRampToValueAtTime(volume, now + 0.03)
      tone.gain.gain.linearRampToValueAtTime(volume * 0.7, now + 0.08)
      tone.gain.gain.setValueAtTime(volume * 0.7, now + duration - 0.1)
      tone.gain.gain.linearRampToValueAtTime(0, now + duration)

      tone.osc.start(now)
      tone.osc.stop(now + duration)

      this.activeOscillators.push(tone.osc)
    }
  }

  // 生成旋律
  private generateMelody(style: MusicStyle) {
    const { scale, progressions, rhythms, tempo } = style
    const beatDuration = 60 / tempo

    // 获取当前和弦进行
    const progression = progressions[this.progressionIndex % progressions.length]
    const chordRoot = progression[this.noteIndex % progression.length]

    // 生成旋律音符
    const melodyNotes = [
      scale[chordRoot],
      scale[(chordRoot + 2) % scale.length],
      scale[(chordRoot + 4) % scale.length],
      scale[chordRoot + 1] || scale[chordRoot]
    ]

    const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)]
    const rhythm = rhythms[this.noteIndex % rhythms.length]
    const duration = beatDuration * rhythm

    this.playMelodyNote(note, duration, 0.08 + Math.random() * 0.04)

    // 更新索引
    this.noteIndex++
    if (this.noteIndex >= 8) {
      this.noteIndex = 0
      this.progressionIndex++
    }

    return duration
  }

  // 生成和弦伴奏
  private generateChords(style: MusicStyle) {
    const { scale, progressions, tempo } = style
    const beatDuration = 60 / tempo

    const progression = progressions[this.progressionIndex % progressions.length]
    const chordRoot = progression[this.noteIndex % progression.length]

    // 构建三和弦
    const chordFreqs = [
      scale[chordRoot] * 0.5,
      scale[(chordRoot + 2) % scale.length] * 0.5,
      scale[(chordRoot + 4) % scale.length] * 0.5
    ]

    this.playChord(chordFreqs, beatDuration * 2, 0.04)
  }

  // 生成低音
  private generateBass(style: MusicStyle) {
    const { scale, progressions, tempo } = style
    const beatDuration = 60 / tempo

    const progression = progressions[this.progressionIndex % progressions.length]
    const chordRoot = progression[this.noteIndex % progression.length]

    const bassFreq = scale[chordRoot] * 0.25
    const tone = this.createTone(bassFreq, 'sine', 0.06)
    if (tone) {
      const now = this.audioContext.currentTime
      const duration = beatDuration * 2

      tone.gain.gain.setValueAtTime(0, now)
      tone.gain.gain.linearRampToValueAtTime(0.06, now + 0.1)
      tone.gain.gain.setValueAtTime(0.04, now + duration - 0.2)
      tone.gain.gain.linearRampToValueAtTime(0, now + duration)

      tone.osc.start(now)
      tone.osc.stop(now + duration)

      this.activeOscillators.push(tone.osc)
    }
  }

  // 播放音乐
  async play(styleName: string = 'default') {
    const style = MUSIC_STYLES[styleName] || MUSIC_STYLES.default
    this.currentStyle = styleName
    this.isPlaying = true
    this.progressionIndex = 0
    this.noteIndex = 0

    const playLoop = () => {
      if (!this.isPlaying) return

      // 生成低音
      this.generateBass(style)

      // 生成和弦
      this.generateChords(style)

      // 生成旋律
      const melodyDuration = this.generateMelody(style)

      // 安排下一次生成
      const nextTime = melodyDuration * 1000 * 0.8
      const timeoutId = window.setTimeout(playLoop, nextTime)
      this.scheduledNotes.push(timeoutId)
    }

    // 开始播放循环
    playLoop()
  }

  // 停止播放
  stop() {
    this.isPlaying = false

    // 清除所有计划的音符
    this.scheduledNotes.forEach(id => clearTimeout(id))
    this.scheduledNotes = []

    // 停止所有活跃的振荡器
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
        // 忽略已停止的振荡器
      }
    })
    this.activeOscillators = []
  }

  // 暂停
  pause() {
    this.isPlaying = false
  }

  // 恢复
  resume() {
    if (!this.isPlaying) {
      this.play(this.currentStyle)
    }
  }

  // 切换风格
  async switchStyle(styleName: string) {
    if (this.currentStyle === styleName && this.isPlaying) return

    this.stop()
    await this.play(styleName)
  }

  // 获取当前风格
  getCurrentStyle(): string {
    return this.currentStyle
  }

  // 检查是否正在播放
  getIsPlaying(): boolean {
    return this.isPlaying
  }
}
