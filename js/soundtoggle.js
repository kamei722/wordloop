// sound-toggle.js - サウンドトグル機能の実装

// サウンド状態を一元管理する
let isSoundEnabled = true;

// DOMが読み込まれたら初期化
document.addEventListener('DOMContentLoaded', function() {
    initSoundToggle();
});

// サウンドトグルの初期化
function initSoundToggle() {
    // 各画面のサウンドトグルボタン
    const soundToggleButtons = [
        document.getElementById('soundToggleBtn'),
        document.getElementById('gameSoundToggleBtn'),
        document.getElementById('resultSoundToggleBtn')
    ];
    
    // 各ボタンにイベントリスナーを設定
    soundToggleButtons.forEach((button) => {
        if (button) {
            button.addEventListener('click', function() {
                // サウンド状態を切り替え
                window.isSoundEnabled = !window.isSoundEnabled;
                
                // 全ての画面のUIを更新
                updateSoundToggleUI();
                
                // 状態に応じて音を鳴らすか停止するか
                if (window.isSoundEnabled) {
                    playButtonSound(); // ONにしたときだけ音を鳴らす
                } else {
                    stopAllSounds(); // OFFにしたとき全ての音を停止
                }
            });
        }
    });
    
    // 画面遷移時にサウンドトグルを切り替え
    document.getElementById('startBtn').addEventListener('click', function() {
        // スタート画面からゲーム画面へ
        document.getElementById('startScreenSoundToggle').style.display = 'none';
        document.getElementById('gameScreenSoundToggle').style.display = 'flex';
    });
    
    // 初期UI状態を設定
    updateSoundToggleUI();
}

// サウンドトグルのUI状態を更新
function updateSoundToggleUI() {
    // オン/オフアイコンを切り替え
    const onIcons = document.querySelectorAll('.sound-icon-on');
    const offIcons = document.querySelectorAll('.sound-icon-off');
    
    onIcons.forEach(icon => {
        icon.style.display = window.isSoundEnabled ? 'flex' : 'none';
    });
    
    offIcons.forEach(icon => {
        icon.style.display = window.isSoundEnabled ? 'none' : 'flex';
    });
}


// サウンド状態の取得関数 (sounds.jsから呼び出される)
function getSoundEnabled() {
    return isSoundEnabled;
}

// 全ての音を停止する関数
function stopAllSounds() {
    // タイマー警告音など、鳴り続ける可能性のある音を停止
    stopTimerWarningSound();
    
    // 他にも停止が必要な音があれば追加
}

// 結果画面表示時のサウンド設定
function showResultScreenSound() {
    document.getElementById('gameScreenSoundToggle').style.display = 'none';
    document.getElementById('resultScreenSoundToggle').style.display = 'flex';
}