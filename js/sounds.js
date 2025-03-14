// sounds.js - 効果音の管理

// グローバルアクセス用のサウンド有効/無効フラグ
window.isSoundEnabled = true;

// 音声ファイルのパス
const SOUNDS = {
    button: 'assets/btn.ogg',           // ボタン押下時の音
    loopSuccess: 'assets/loop_success.ogg', // ループ成立時の音
    loopFail: 'assets/loop_fail.ogg',   // ループ失敗時の音
    gameEnd: 'assets/gameend.ogg',      // ゲーム終了時の音
    tickSound: 'assets/tick.ogg',       // タイマーのカウント音
    bcdRank: 'assets/b_c_d_rank.ogg',   // B/C/D ランク時の音
    ssaRank: 'assets/ss_s_a_rank.ogg'   // SS/S/A ランク時の音
};

// 音声オブジェクトのキャッシュ
let audioCache = {};

// タイマー音のフラグと変数
let isTimerSoundPlaying = false;
let timerSoundInterval = null;

// 音声を事前にロードする
function preloadSounds() {
    Object.keys(SOUNDS).forEach(key => {
        const audio = new Audio(SOUNDS[key]);
        // ロード済みのフラグを設定
        audio.addEventListener('canplaythrough', () => {
            console.log(`Sound loaded: ${key}`);
        }, { once: true });
        
        // キャッシュに保存
        audioCache[key] = audio;
    });
}

// 音を再生する関数
function playSound(soundKey, volume = 1.0) {
    // サウンドが無効の場合は再生しない
    if (!window.isSoundEnabled) return;
    
    try {
        // キャッシュに音声がなければ作成
        if (!audioCache[soundKey]) {
            audioCache[soundKey] = new Audio(SOUNDS[soundKey]);
            console.log(`Created new audio for ${soundKey}`);
        }
        
        const sound = audioCache[soundKey];
        
        // 音量設定
        sound.volume = volume;
        
        // 再生位置をリセット
        sound.currentTime = 0;
        
        // 再生
        let playPromise = sound.play();
        
        // 再生の Promise が利用可能な場合はエラーハンドリング
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error(`Error playing sound ${soundKey}:`, error);
            });
        }
    } catch (error) {
        console.error(`Error with sound ${soundKey}:`, error);
    }
}

// ボタン音を再生
function playButtonSound() {
    console.log("Playing button sound");
    playSound('button', 0.7);
}

// ループ成功音を再生
function playLoopSuccessSound() {
    console.log("Playing loop success sound");
    playSound('loopSuccess', 0.8);
}

// ループ失敗音を再生
function playLoopFailSound() {
    console.log("Playing loop fail sound");
    playSound('loopFail', 0.8);
}

// ゲーム終了音を再生
function playGameEndSound() {
    playSound('gameEnd', 0.8);
}

// ランクによって音を変える
function playRankSound(rank) {
    // SS, S, A ランクの場合
    if (['SSS', 'SS', 'S', 'A'].includes(rank)) {
        playSound('ssaRank', 0.8);
    } else {
        // B, C, D ランクの場合
        playSound('bcdRank', 0.8);
    }
}

// タイマー警告音を開始
function startTimerWarningSound() {
    if (isTimerSoundPlaying || !window.isSoundEnabled) return;
    
    isTimerSoundPlaying = true;
    // 1秒ごとにカチカチ音を鳴らす
    timerSoundInterval = setInterval(() => {
        playSound('tickSound', 0.5);
    }, 1000);
}

// タイマー警告音を停止
function stopTimerWarningSound() {
    if (!isTimerSoundPlaying) return;
    
    clearInterval(timerSoundInterval);
    isTimerSoundPlaying = false;
}

// 初期化時に音声をプリロード
document.addEventListener('DOMContentLoaded', () => {
    preloadSounds();
});