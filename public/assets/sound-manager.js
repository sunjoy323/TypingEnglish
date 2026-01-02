// 声音管理器
class SoundManager {
    constructor() {
        this.sounds = {
            typing: document.getElementById('typing-sound'),
            correct: document.getElementById('correct-sound'),
            error: document.getElementById('error-sound'),
            complete: document.getElementById('complete-sound'),
            gameStart: document.getElementById('game-start-sound'),
            gameOver: document.getElementById('game-over-sound'),
            achievement: document.getElementById('achievement-sound')
        };
        
        this.enabled = true;
        this.volume = 0.5;
        this.lastTypingTime = 0;
        this.typingCooldown = 50; // 打字音效冷却时间(毫秒)

        this.audioContext = null;
        this.webAudioSupported = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
        this.unlocked = false;
        
        this.initSounds();
    }
    
    // 初始化声音
    initSounds() {
        // 为所有音频元素设置基本属性
        Object.values(this.sounds).forEach(sound => {
            if (!sound) return;
            sound.volume = this.volume;
        });

        // 浏览器策略要求：AudioContext 必须在用户手势后创建/恢复
        this.setupAutoUnlock();
    }
    
    setupAutoUnlock() {
        if (!this.webAudioSupported) return;

        const unlockOnce = () => {
            void this.unlock();
        };

        // 尽可能覆盖各种设备的“用户手势”事件
        ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach((eventName) => {
            window.addEventListener(eventName, unlockOnce, { capture: true, passive: true });
        });
    }

    ensureAudioContext() {
        if (!this.webAudioSupported) return null;
        if (this.audioContext) return this.audioContext;

        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new Ctx();
        return this.audioContext;
    }

    async unlock() {
        if (!this.webAudioSupported || this.unlocked) return false;

        let audioContext = null;
        try {
            audioContext = this.ensureAudioContext();
        } catch {
            return false;
        }
        if (!audioContext) return false;

        try {
            if (audioContext.state !== 'running') {
                await audioContext.resume();
            }

            // 某些浏览器需要实际“播放”一次无声节点来彻底解锁
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.01);

            // 尝试解锁 <audio>（作为回退方案）
            Object.values(this.sounds).forEach((sound) => {
                if (!sound) return;
                const originalVolume = sound.volume;
                sound.volume = 0;
                const p = sound.play();
                if (p && typeof p.then === 'function') {
                    p.then(() => {
                        sound.pause();
                        sound.currentTime = 0;
                        sound.volume = originalVolume;
                    }).catch(() => {
                        sound.volume = originalVolume;
                    });
                } else {
                    try {
                        sound.pause();
                        sound.currentTime = 0;
                    } catch {}
                    sound.volume = originalVolume;
                }
            });

            this.unlocked = true;
            return true;
        } catch {
            // 未在用户手势中调用时可能会失败；静默等待下一次手势
            return false;
        }
    }
    
    // 生成打字音效
    generateTypingSound(audioContext) {
        const volume = Math.max(0, Math.min(1, this.volume));
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(Math.max(0.0001, 0.1 * volume), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * volume), audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // 生成正确音效
    generateCorrectSound(audioContext) {
        const volume = Math.max(0, Math.min(1, this.volume));
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(Math.max(0.0001, 0.3 * volume), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * volume), audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // 生成错误音效
    generateErrorSound(audioContext) {
        const volume = Math.max(0, Math.min(1, this.volume));
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(Math.max(0.0001, 0.2 * volume), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * volume), audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    }
    
    // 生成完成音效
    generateCompleteSound(audioContext) {
        const volume = Math.max(0, Math.min(1, this.volume));
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 上升的音调
        oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
        oscillator.frequency.exponentialRampToValueAtTime(523.25, audioContext.currentTime + 0.5); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(Math.max(0.0001, 0.2 * volume), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * volume), audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    // 生成游戏开始音效
    generateGameStartSound(audioContext) {
        const volume = Math.max(0, Math.min(1, this.volume));
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
        oscillator.frequency.exponentialRampToValueAtTime(523.25, audioContext.currentTime + 0.3); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(Math.max(0.0001, 0.3 * volume), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * volume), audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    // 生成游戏结束音效
    generateGameOverSound(audioContext) {
        const volume = Math.max(0, Math.min(1, this.volume));
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 下降的音调
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(130.81, audioContext.currentTime + 1); // C3
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(Math.max(0.0001, 0.3 * volume), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * volume), audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    }
    
    // 生成成就解锁音效
    generateAchievementSound(audioContext) {
        const volume = Math.max(0, Math.min(1, this.volume));
        const times = [0, 0.1, 0.2, 0.3, 0.4];
        const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        
        times.forEach((time, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequencies[index], audioContext.currentTime + time);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(Math.max(0.0001, 0.2 * volume), audioContext.currentTime + time);
            gainNode.gain.exponentialRampToValueAtTime(
                Math.max(0.0001, 0.01 * volume),
                audioContext.currentTime + time + 0.2
            );
            
            oscillator.start(audioContext.currentTime + time);
            oscillator.stop(audioContext.currentTime + time + 0.2);
        });
    }

    playWithWebAudio(soundName) {
        if (!this.webAudioSupported || !this.unlocked || !this.audioContext) return false;
        const audioContext = this.audioContext;
        if (audioContext.state !== 'running') return false;

        const volume = Math.max(0, Math.min(1, this.volume));
        if (volume === 0) return true;

        try {
            switch (soundName) {
                case 'typing': {
                    const now = Date.now();
                    if (now - this.lastTypingTime <= this.typingCooldown) return true;
                    this.lastTypingTime = now;
                    this.generateTypingSound(audioContext);
                    return true;
                }
                case 'correct':
                    this.generateCorrectSound(audioContext);
                    return true;
                case 'error':
                    this.generateErrorSound(audioContext);
                    return true;
                case 'complete':
                    this.generateCompleteSound(audioContext);
                    return true;
                case 'gameStart':
                    this.generateGameStartSound(audioContext);
                    return true;
                case 'gameOver':
                    this.generateGameOverSound(audioContext);
                    return true;
                case 'achievement':
                    this.generateAchievementSound(audioContext);
                    return true;
                default:
                    break;
            }

            return false;
        } catch {
            return false;
        }
    }
    
    // 播放声音
    play(soundName) {
        if (!this.enabled) return;
        
        try {
            // 优先用 WebAudio（已在用户手势后解锁）
            if (this.playWithWebAudio(soundName)) return;

            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                sound.volume = this.volume;
                sound.play().catch(e => console.log('音频播放失败:', e));
            }
        } catch (error) {
            console.log('播放声音失败:', error);
        }
    }
    
    // 播放打字音效 (带冷却时间)
    playTyping() {
        const now = Date.now();
        if (now - this.lastTypingTime > this.typingCooldown) {
            this.play('typing');
            this.lastTypingTime = now;
        }
    }
    
    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            if (!sound) return;
            sound.volume = this.volume;
        });
    }
    
    // 启用/禁用声音
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    // 切换声音状态
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}
