// timer.js - タイマー関連の処理

// タイマー表示を更新する関数
function updateTimerDisplay() {
    const timerText = document.getElementById('timerText');
    const timerBar = document.getElementById('timerBar');
    const timerContainer = document.querySelector('.timer');
    
    timerText.textContent = timeLeft;
    
    // 最大表示時間（100秒）を基準にバーの幅を計算
    const maxDisplayTime = 100;
    const barWidth = Math.min(100, (timeLeft / maxDisplayTime) * 100);
    timerBar.style.width = barWidth + '%';
    
    // 時間に応じて警告表示と警告音
    if (timeLeft <= 10) {
        timerContainer.classList.add('timer-warning');
        
        // 残り10秒以下で警告音を開始
        if (timeLeft === 10) {
            startTimerWarningSound();
        }
    } else {
        timerContainer.classList.remove('timer-warning');
        stopTimerWarningSound();
    }
}
// タイマーを開始する関数
function startTimer() {
    // 既存のタイマーをクリア
    clearInterval(timer);
    
    // 警告音を停止
    stopTimerWarningSound();
    
    // 新しいタイマー開始
    timer = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();
        
        // 時間切れ
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver = true; // ゲームオーバーフラグをセット
            
            // 警告音を停止
            stopTimerWarningSound();
            
            // 時間切れ = ゲーム終了
            showGameOverEffect();
            
            // ゲーム終了処理へ
            setTimeout(() => {
                showFinalResults();
            }, 2000);
        }
    }, 1000);
}

// 時間切れ時のエフェクト表示
function showTimeUpEffect() {
    // 警告音を停止
    stopTimerWarningSound();
    
    // フラッシュ用のオーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'timeup-overlay';
    
    // 時間切れメッセージを表示
    const message = document.createElement('div');
    message.className = 'timeup-message';
    message.innerHTML = `
        <h2>時間切れ！</h2>
        <div class="timer-icon-large">⏱</div>
        <div class="timeup-score">+0</div>
    `;
    overlay.appendChild(message);
    
    // ボディに追加
    document.body.appendChild(overlay);
    
    // アニメーション終了後に削除
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 1400);
}