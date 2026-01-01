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
        
        this.initSounds();
    }
    
    // 初始化声音
    initSounds() {
        // 为所有音频元素设置基本属性
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
        
        // 生成简单的音效
        this.generateSounds();
    }
    
    // 生成简单的音效 (使用Web Audio API)
    generateSounds() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 打字音效 - 短促的点击声
            this.generateTypingSound(audioContext);
            
            // 正确音效 - 清脆的提示音
            this.generateCorrectSound(audioContext);
            
            // 错误音效 - 低沉的提示音
            this.generateErrorSound(audioContext);
            
            // 完成音效 - 上升的音调
            this.generateCompleteSound(audioContext);
            
            // 游戏开始音效
            this.generateGameStartSound(audioContext);
            
            // 游戏结束音效
            this.generateGameOverSound(audioContext);
            
            // 成就解锁音效
            this.generateAchievementSound(audioContext);
            
        } catch (error) {
            console.warn('Web Audio API不支持，使用静音模式');
        }
    }
    
    // 生成打字音效
    generateTypingSound(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // 生成正确音效
    generateCorrectSound(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // 生成错误音效
    generateErrorSound(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    }
    
    // 生成完成音效
    generateCompleteSound(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 上升的音调
        oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
        oscillator.frequency.exponentialRampToValueAtTime(523.25, audioContext.currentTime + 0.5); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    // 生成游戏开始音效
    generateGameStartSound(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
        oscillator.frequency.exponentialRampToValueAtTime(523.25, audioContext.currentTime + 0.3); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    // 生成游戏结束音效
    generateGameOverSound(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 下降的音调
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(130.81, audioContext.currentTime + 1); // C3
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    }
    
    // 生成成就解锁音效
    generateAchievementSound(audioContext) {
        const times = [0, 0.1, 0.2, 0.3, 0.4];
        const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        
        times.forEach((time, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequencies[index], audioContext.currentTime + time);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.2);
            
            oscillator.start(audioContext.currentTime + time);
            oscillator.stop(audioContext.currentTime + time + 0.2);
        });
    }
    
    // 播放声音
    play(soundName) {
        if (!this.enabled) return;
        
        try {
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
