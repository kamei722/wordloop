// tutorial.js - チュートリアル関連の処理

// チュートリアル用変数
let tutorialSelectedWords = [];

// チュートリアルの初期化
function initTutorial() {
    setupTutorial();
    addTutorialStyles();
    
    // チュートリアルのGOボタンのイベントリスナーを追加
    const tutorialGoBtn = document.getElementById('tutorialGoBtn');
    if (tutorialGoBtn) {
        tutorialGoBtn.addEventListener('click', function() {
            // ボタン音を再生
            playButtonSound();
            checkTutorialLoop();
        });
    }
}

// チュートリアル機能のセットアップ
function setupTutorial() {
    const tutorialWordItems = document.querySelectorAll('.tutorial-word-item');
    tutorialWordItems.forEach(item => {
        item.addEventListener('click', function() {
            // 単語の取得
            const word = this.getAttribute('data-word');
            
            // すでに選択済みかチェック
            if (this.classList.contains('selected')) {
                // 直近の選択かチェック
                if (tutorialSelectedWords.length > 0 && tutorialSelectedWords[tutorialSelectedWords.length - 1] === word) {
                    // 選択解除
                    this.classList.remove('selected');
                    tutorialSelectedWords.pop();
                    updateTutorialDisplay();
                    
                    // ボタン音を再生
                    playButtonSound();
                }
                return;
            }
            
            // 接続可能かチェック
            const isFirstWord = tutorialSelectedWords.length === 0;
            const isConnectable = isFirstWord || 
                                tutorialSelectedWords[tutorialSelectedWords.length - 1].charAt(tutorialSelectedWords[tutorialSelectedWords.length - 1].length - 1) === word.charAt(0);
            
            if (isConnectable) {
                // 選択状態に
                this.classList.add('selected');
                tutorialSelectedWords.push(word);
                updateTutorialDisplay();
                
                // ボタン音を再生
                playButtonSound();
            } else {
                // 接続不可をフィードバック
                this.classList.add('invalid');
                setTimeout(() => {
                    this.classList.remove('invalid');
                }, 500);
                
                // エラー音を再生
                playLoopFailSound();
                
                // エラーメッセージを表示
                const tutorialResult = document.getElementById('tutorialResult');
                if (tutorialResult) {
                    tutorialResult.textContent = 'しりとりになってないよ';
                    tutorialResult.className = 'tutorial-result error';
                    
                    // メッセージをクリア
                    setTimeout(() => {
                        tutorialResult.textContent = '';
                        tutorialResult.className = 'tutorial-result';
                    }, 3000);
                }
            }
        });
    });
}

// チュートリアルでの選択状態を表示更新
function updateTutorialDisplay() {
    const selectedWordsContainer = document.getElementById('tutorialSelectedWords');
    if (!selectedWordsContainer) return;
    
    selectedWordsContainer.innerHTML = '';
    
    tutorialSelectedWords.forEach((word, index) => {
        if (index > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'tutorial-arrow-icon';
            arrow.textContent = '→';
            selectedWordsContainer.appendChild(arrow);
        }
        
        const wordEl = document.createElement('div');
        wordEl.className = 'tutorial-selected-word';
        
        // 最新選択の場合はハイライトクラスを追加
        if (index === tutorialSelectedWords.length - 1) {
            wordEl.classList.add('latest-selected');
        }
        
        wordEl.textContent = word;
        selectedWordsContainer.appendChild(wordEl);
    });
    
    // 選択した単語プール内の要素もハイライト
    updateTutorialLatestHighlight();
}

// チュートリアル単語プール内の最新選択をハイライト
function updateTutorialLatestHighlight() {
    // まずすべてのハイライトを解除
    const allWords = document.querySelectorAll('.tutorial-word-item');
    allWords.forEach(item => {
        item.classList.remove('latest-selected');
    });
    
    // 最新選択がある場合ハイライト
    if (tutorialSelectedWords.length > 0) {
        const latestWord = tutorialSelectedWords[tutorialSelectedWords.length - 1];
        const latestItem = document.querySelector(`.tutorial-word-item[data-word="${latestWord}"]`);
        
        if (latestItem) {
            latestItem.classList.add('latest-selected');
        }
    }
}

// チュートリアルループをチェック
function checkTutorialLoop() {
    const tutorialResult = document.getElementById('tutorialResult');
    if (!tutorialResult) return;
    
    // 選択がない場合
    if (tutorialSelectedWords.length === 0) {
        tutorialResult.textContent = '単語を選んでみよう！';
        tutorialResult.className = 'tutorial-result error';
        playLoopFailSound();
        return;
    }
    
    // 1つしか選んでいない場合、単語自体がループになっているかチェック
    if (tutorialSelectedWords.length === 1) {
        const word = tutorialSelectedWords[0];
        const isLoop = word.charAt(word.length - 1) === word.charAt(0);
        
        if (isLoop) {
            tutorialResult.textContent = '1単語でもLOOPになるよ!! 1点だけど';
            tutorialResult.className = 'tutorial-result success';
            playLoopSuccessSound();
            celebrateTutorialSuccess();
        } else {
            tutorialResult.textContent = 'NON LOOP... 最初と最後に注目！';
            tutorialResult.className = 'tutorial-result error';
            playLoopFailSound();
        }
        return;
    }
    
    // 複数単語の場合
    const firstWord = tutorialSelectedWords[0];
    const lastWord = tutorialSelectedWords[tutorialSelectedWords.length - 1];
    
    const isLoop = lastWord.charAt(lastWord.length - 1) === firstWord.charAt(0);
    
    if (isLoop) {
        tutorialResult.textContent = 'LOOP!! 準備OK!!';
        tutorialResult.className = 'tutorial-result success';
        playLoopSuccessSound();
        celebrateTutorialSuccess();
    } else {
        tutorialResult.textContent = 'NON LOOP... 最初と最後に注目！';
        tutorialResult.className = 'tutorial-result error';
        playLoopFailSound();
    }
}

// チュートリアル成功時のお祝いエフェクト
function celebrateTutorialSuccess() {
    // 単語に成功エフェクトを追加
    const selectedWords = document.querySelectorAll('.tutorial-selected-word');
    selectedWords.forEach(word => {
        word.style.animation = 'none';
        setTimeout(() => {
            word.style.animation = 'successPulse 1s infinite';
        }, 10);
    });
    
    // スタートボタンをさらに目立たせる
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.classList.add('highlight-start');
        
        // 3秒後にエフェクトを元に戻す
        setTimeout(() => {
            startBtn.classList.remove('highlight-start');
        }, 3000);
    }
    
    // 3秒後にエフェクトを元に戻す
    setTimeout(() => {
        selectedWords.forEach(word => {
            word.style.animation = '';
        });
    }, 3000);
}

// チュートリアル用のスタイルを追加
function addTutorialStyles() {
    if (!document.getElementById('tutorial-animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'tutorial-animation-styles';
        styleSheet.innerHTML = `
            @keyframes successPulse {
                0% { transform: scale(1); box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
                50% { transform: scale(1.1); box-shadow: 0 0 15px rgba(76, 175, 80, 0.8); }
                100% { transform: scale(1); box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
            }
            .tutorial-word-item.invalid {
                animation: shake 0.5s;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}