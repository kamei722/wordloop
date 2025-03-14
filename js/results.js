// results.js - 結果画面関連の処理

// スコアからランクを判定する関数
function determineRank(score) {
    if (score >= 62) {
        return { rank: "SSS", comment: PERFECT_COMMENT };
    } else if (score >= RANKS.SS.threshold) {
        return { rank: "SS", comment: RANKS.SS.comment };
    } else if (score >= RANKS.S.threshold) {
        return { rank: "S", comment: RANKS.S.comment };
    } else if (score >= RANKS.A.threshold) {
        return { rank: "A", comment: RANKS.A.comment };
    } else if (score >= RANKS.B.threshold) {
        return { rank: "B", comment: RANKS.B.comment };
    } else if (score >= RANKS.C.threshold) {
        return { rank: "C", comment: RANKS.C.comment };
    } else {
        return { rank: "D", comment: RANKS.D.comment };
    }
}

// 最終結果表示
function showFinalResults() {
    // タイマー音を確実に停止
    stopTimerWarningSound();
    
    // ゲーム画面を非表示
    document.getElementById('gameContainer').style.display = 'none';
    
    // サウンドボタン切り替え
    document.getElementById('gameScreenSoundToggle').style.display = 'none';
    document.getElementById('resultScreenSoundToggle').style.display = 'flex';
    
    // 統計情報を更新
    gameStats.clearedStages = currentStage;
    
    // ランクを判定
    const rankInfo = determineRank(totalScore);
    
    // 結果画面の各要素を更新
    document.getElementById('finalScore').textContent = totalScore;
    document.getElementById('finalRank').textContent = rankInfo.rank;
    document.getElementById('finalRank').className = `rank rank-${rankInfo.rank.toLowerCase()}`;
    document.getElementById('rankComment').textContent = rankInfo.comment;
    
    // ランクに応じた効果音を再生
    setTimeout(() => {
        playRankSound(rankInfo.rank);
    }, 500);
    
    // 結果画面を表示
    document.getElementById('resultsScreen').style.display = 'flex';
    
    // イベントリスナーを設定
    document.getElementById('retryGameBtn').addEventListener('click', resetGame);
    
    // shareResultBtnが存在する場合のみイベントリスナーを設定
    const shareResultBtn = document.getElementById('shareResultBtn');
    if (shareResultBtn) {
        shareResultBtn.addEventListener('click', shareResults);
    }
}

// 結果をシェアする関数
function shareResults() {
    const rankInfo = determineRank(totalScore);
    const shareText = `ループしりとりで${totalScore}点獲得！ランク：${rankInfo.rank}\nステージ：${gameStats.clearedStages}\nつなげた単語：${gameStats.totalWords}`;
    
    // クリップボードにコピー
    navigator.clipboard.writeText(shareText)
        .then(() => {
            alert('結果をクリップボードにコピーしました！SNSなどでシェアしてください。');
        })
        .catch(err => {
            alert('クリップボードへのコピーに失敗しました。');
            console.error('クリップボードへのコピーに失敗:', err);
        });
}

// ゲームのリセット
function resetGame() {
    // ボタン音を再生
    playButtonSound();
    
    // タイマー音を確実に停止
    stopTimerWarningSound();
    
    // 状態をリセット
    currentStage = 0;
    totalScore = 0;
    timeLeft = INITIAL_TIME;
    gameOver = false;
    gameStats = { totalWords: 0, clearedStages: 0 };
    
    // 結果画面を非表示
    document.getElementById('resultsScreen').style.display = 'none';
    
    // サウンドボタン切り替え
    document.getElementById('resultScreenSoundToggle').style.display = 'none';
    document.getElementById('startScreenSoundToggle').style.display = 'flex';
    
    // スタート画面表示
    document.getElementById('startScreen').style.display = 'flex';
}