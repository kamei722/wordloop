// effects.js - エフェクト関連の処理

// ループチェック関数
function checkLoop() {
    // 既に処理中なら無視
    if (isProcessing) {
        return;
    }
    
    // 処理中フラグをオン
    isProcessing = true;
    
    // ボタンを無効化
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
    submitBtn.style.cursor = "not-allowed";
    
    // タイマーを一時停止
    clearInterval(timer);
    
    if (selectedWords.length < 1) {
        // 単語が選択されていない場合
        showFailEffect();
        proceedToNextStage(0);
        return;
    }
    
    // ループになっているかチェック
    const firstWord = selectedWords[0];
    const lastWord = selectedWords[selectedWords.length - 1];
    
    const isLoop = lastWord.charAt(lastWord.length - 1) === firstWord.charAt(0);
    
    if (isLoop) {
        // スコアを加算
        totalScore += currentStageScore;
        
        // 統計情報を更新
        gameStats.totalWords += selectedWords.length;
        
        // スコアに応じた時間ボーナスを追加
        const timeBonus = currentStageScore * TIME_BONUS_PER_WORD;
        timeLeft += timeBonus;
        
        // スコア表示を即時更新
        document.getElementById('scoreDisplay').textContent = totalScore;
        
        // 時間表示を更新
        updateTimerDisplay();
        
        // 成功エフェクト表示（時間ボーナス情報を追加）
        showSuccessFlashWithTimeBonus(timeBonus);
    } else {
        // ループ不成立時は+0
        showFailEffect();
    }
    
    // 遅延して次のステージへ
    setTimeout(() => {
        proceedToNextStage(isLoop ? currentStageScore : 0);
    }, 1200);
}


// 時間ボーナス付きの成功フラッシュ表示
// 時間ボーナス付きの成功フラッシュ表示
function showSuccessFlashWithTimeBonus(timeBonus) {
    // 成功音を再生
    playLoopSuccessSound();
    
    // フラッシュ用のオーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    
    // 成功メッセージを表示
    const message = document.createElement('div');
    message.className = 'success-message';
    
    // 単一単語ループの場合は特別なメッセージ
    if (selectedWords.length === 1) {
        const word = selectedWords[0];
        message.innerHTML = `
            <h2>ループ完成！</h2>
            <div class="success-score">+${currentStageScore}</div>
            <div class="time-bonus">時間 +${timeBonus}秒</div>
        `;
    } else {
        message.innerHTML = `
            <h2>ループ完成！</h2>
            <div class="success-score">+${currentStageScore}</div>
            <div class="time-bonus">時間 +${timeBonus}秒</div>
        `;
    }
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    // アニメーション終了後に削除
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 1100);
}


function showSuccessFlash() {
    // サウンド再生
    playLoopSuccessSound();
    
    // フラッシュ用のオーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    
    // 成功メッセージを表示
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <h2> LOOP!!</h2>
        <div class="success-score">+${currentStageScore}</div>
    `;
    overlay.appendChild(message);
    
    // ボディに追加
    document.body.appendChild(overlay);
    
    // アニメーション終了後に削除
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 900);
}

// ループ不成立時のエフェクト表示
function showFailEffect() {
    // 失敗音を再生
    playLoopFailSound();
    
    // フラッシュ用のオーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'fail-overlay';
    
    // 失敗メッセージを表示
    const message = document.createElement('div');
    message.className = 'fail-message';
    message.innerHTML = `
        <h2> Non Loop... </h2>
        <div class="fail-score">+0</div>
    `;
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    // アニメーション終了後に削除
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 900);
}
// ゲームオーバーエフェクト表示
function showGameOverEffect() {
    // 警告音を停止
    stopTimerWarningSound();
    
    // ゲーム終了音を再生
    playGameEndSound();
    
    // フラッシュ用のオーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'gameover-overlay';
    
    // 時間切れメッセージを表示
    const message = document.createElement('div');
    message.className = 'gameover-message';
    message.innerHTML = `
        <h2>時間切れ！</h2>
        <div class="timer-icon-large">⏱</div>
        <div class="gameover-text">ゲーム終了</div>
    `;
    overlay.appendChild(message);
    
    // ボディに追加
    document.body.appendChild(overlay);
    
    // アニメーション終了後に削除して結果表示
    setTimeout(() => {
        document.body.removeChild(overlay);
        showFinalResults(); // 結果表示
    }, 1900);
}