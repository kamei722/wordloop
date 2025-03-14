// main.js - メインの処理

// ゲームデータ：8つのステージ
const stages = [
    {
        id: 1,
        words: ["とまと", "すいか", "からす", "まくら", "らくだ", "だるま"],
        description: "ループを見つけよう!! 長いほど高得点！!"
    },
    {
        id: 2,
        words: ["りんご", "ごま", "まめ", "めだか", "かき", "きつね", "ねこ", "こおり"],
        description: "つながるつながる"
    },
    {
        id: 3,
        words: ["たか", "かかし", "しんぶんし", "しか", "かるた"],
        description: "たくさんつながると大変だあ"
    },
    {
        id: 4,
        words: ["えんぴつ", "つくえ", "かっき", "つみき", "きょうしつ", "つうがくろ", "ろうか"],
        description: "学校の風景が見えてくる..."
    },
    {
        id: 5,
        words: ["フェニックス", "スピリット", "トルネード", "アルケミスト", "クエスト", "スパーク", "アンドロイド", "フレア", "ドワーフ", "アンデッド"],
        description: "ファンタジーでファンタスティック"
    },
    {
        id: 6,
        words: ["カタール", "ルーマニア", "アルバニア", "アメリカ", "クロアチア", "アイルランド", "ドイツ", "ツバル", "ルクセンブルク"],
        description: "国名でループ!! 世界一周！!"
    },
    {
        id: 7,
        words: ["かめ", "まぐろ", "ろば", "ばく", "くま", "まむし", "しか", "かに", "にわとり", "りす", "すずめ", "めだか", "かえる", "かば", "しまうま"],
        description: "動物たくさん!! ループもたくさん!!"
    },
    {
        id: 8,
        words: ["ライチュウ", "ウツボット", "トランセル", "ルージュラ", "ラプラス", "ストライク", "クサイハナ", "ナゾノクサ", "サンダース", "スリープ", "プテラ", "ラフレシア", "アーボック", "アズマオウ", "タマタマ", "マタドガス", "ドガース", "ラッタ", "サンド", "トサキント"],
        description: "ポケモンの名前でループを作ろう！ラストチャレンジ！"
    }
];

// ランク判定用の定数
const RANKS = {
    SS: { threshold: 55, comment: "どうやってここまで..." },
    S: { threshold: 48, comment: "あなたは天才ですか？？" },
    A: { threshold: 36, comment: "素晴らしい！ループの達人！" },
    B: { threshold: 24, comment: "なかなかやるじゃん!!" },
    C: { threshold: 12, comment: "まだ目が回っているようですね" },
    D: { threshold: 0, comment: "もう少しがんばりましょう！" }
};

const PERFECT_COMMENT = "満点！! LOOPMASTER!!";

// タイマー関連の定数
const INITIAL_TIME = 60;
const MAX_TIME = 90;
const TIME_BONUS_PER_WORD = 3;

// 状態変数
let currentStage = 0;
let selectedWords = [];
let timer = null;
let totalScore = 0;
let currentStageScore = 0;
let isProcessing = false;
let timeLeft = INITIAL_TIME;
let gameOver = false;

// ゲーム統計データ
let gameStats = {
    totalWords: 0,     // つなげた単語の総数
    clearedStages: 0   // クリアしたステージ数
};

// ゲームの初期化
document.addEventListener('DOMContentLoaded', function() {
    // スコア表示を初期化
    initTutorial();

    document.getElementById('scoreDisplay').textContent = totalScore;
    
    // 開始ボタンにイベントリスナーを追加
    document.getElementById('startBtn').addEventListener('click', function() {
        console.log("開始ボタンが押されました！");
        // ボタン音を再生
        playButtonSound();
        
        // 開始画面を非表示にする
        document.getElementById('startScreen').style.display = 'none';
        // ゲーム画面を表示する
        document.getElementById('gameContainer').style.display = 'block';
        // 最初のステージをロードする
        loadStage(currentStage);
    });
    
    // メインゲームのイベントリスナーの設定
    document.getElementById('resetBtn').addEventListener('click', function() {
        playButtonSound(); // ボタン音を再生
        resetSelection();
    });
    
    document.getElementById('submitBtn').addEventListener('click', function() {
        playButtonSound(); // ボタン音を再生
        checkLoop();
    });
    
    document.getElementById('retryGameBtn').addEventListener('click', function() {
        playButtonSound(); // ボタン音を再生
        resetGame();
    });
});

// ステージをロードする関数
function loadStage(stageIndex) {
    const stage = stages[stageIndex];

    // ボタン有効化処理
    resetSubmitButton();
    isProcessing = false;

    // ステージ情報の表示
    document.querySelector('.stage-number').textContent = `ステージ ${stage.id}`;

    // スコア表示を更新
    document.getElementById('scoreDisplay').textContent = totalScore;
    
    // タイマー表示を更新（新規ゲーム開始時のみ時間をリセット）
    if (currentStage === 0 && totalScore === 0) {
        timeLeft = INITIAL_TIME; // 最初のステージのみ初期時間にリセット
    }
    updateTimerDisplay();
    
    // ランダムに単語プールの生成
    const wordPool = document.getElementById('wordPool');
    wordPool.innerHTML = '';
    
    // 単語をランダムに並び替え
    const shuffledWords = [...stage.words].sort(() => Math.random() - 0.5);
    
    shuffledWords.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.dataset.word = word;
        
        // ハイライトなしで単語をそのまま表示
        wordItem.textContent = word;
        
        // クリックイベント
        wordItem.addEventListener('click', function() {
            selectWord(word, wordItem);
        });
        
        wordPool.appendChild(wordItem);
    });
    // 選択をリセット
    resetSelection();
    
    // タイマー再開（時間はそのまま継続）
    startTimer();
}


function selectWord(word, element) {
    // すでに選択済みの場合、直近の選択かどうかをチェック
    if (element.classList.contains('selected')) {
        // 直近に選択された単語なら解除する
        if (selectedWords.length > 0 && selectedWords[selectedWords.length - 1] === word) {
            selectedWords.pop();
            element.classList.remove('selected');
            
            // ボタン音を再生
            playButtonSound();
            
            const selectedWordsContainer = document.getElementById('selectedWords');
            // 末尾の子要素（単語表示）を削除
            if (selectedWordsContainer.lastChild) {
                selectedWordsContainer.removeChild(selectedWordsContainer.lastChild);
            }
            // もし、直前に矢印がある場合は削除する
            if (selectedWordsContainer.lastChild && selectedWordsContainer.lastChild.classList.contains('arrow-icon')) {
                selectedWordsContainer.removeChild(selectedWordsContainer.lastChild);
            }
            
            updateSelectableWords();
            
            // 単語数を追跡するだけ
            currentStageScore = Math.max(0, currentStageScore - 1);
        }
        return;
    }
    
    // 通常の選択処理：最初の単語または前の単語とつながる場合のみ選択可能
    const isFirstWord = selectedWords.length === 0;
    const isConnectable = isFirstWord ||
                          selectedWords[selectedWords.length - 1].charAt(selectedWords[selectedWords.length - 1].length - 1) === word.charAt(0);
    
    if (isConnectable) {
        // 選択音を再生
        playButtonSound();
        
        element.classList.add('selected');
        selectedWords.push(word);
        
        // 選択された単語表示領域に追加
        const selectedWordsContainer = document.getElementById('selectedWords');
        if (selectedWords.length > 1) {
            const arrow = document.createElement('div');
            arrow.className = 'arrow-icon';
            arrow.textContent = '→';
            selectedWordsContainer.appendChild(arrow);
        }
        
        const selectedWordEl = document.createElement('div');
        selectedWordEl.className = 'selected-word';
        selectedWordEl.textContent = word;
        selectedWordsContainer.appendChild(selectedWordEl);
        
        // 選択領域を自動スクロールして最新の選択を表示
        selectedWordsContainer.scrollTop = selectedWordsContainer.scrollHeight;
        
        updateSelectableWords();
        
        // 単語数だけ増やす
        currentStageScore++;
    } else {
        // 不正な選択でエラー音を再生
        playLoopFailSound();
        
        element.classList.add('invalid');
        setTimeout(() => {
            element.classList.remove('invalid');
        }, 500);
    }
}

// リセットボタンのイベントリスナー
document.getElementById('resetBtn').addEventListener('click', function() {
    // リセット音を再生
    playButtonSound();
    resetSelection();
});

// GOボタンのイベントリスナー
document.getElementById('submitBtn').addEventListener('click', function() {
    // ボタン音を再生
    playButtonSound();
    checkLoop();
});


// 選択された単語表示領域に単語を追加する際のコード修正
function updateSelectedWordsDisplay() {
    // 選択された単語表示領域をクリア
    const selectedWordsContainer = document.getElementById('selectedWords');
    selectedWordsContainer.innerHTML = '';
    
    // 単語を表示領域に追加
    selectedWords.forEach((word, index) => {
        // 矢印が必要な場合（最初の単語以外）
        if (index > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'arrow-icon';
            arrow.textContent = '→';
            selectedWordsContainer.appendChild(arrow);
        }
        
        // 単語要素を作成
        const selectedWordEl = document.createElement('div');
        selectedWordEl.className = 'selected-word';
        selectedWordEl.textContent = word;
        
        // 最新選択の場合はハイライト
        if (index === selectedWords.length - 1) {
            selectedWordEl.classList.add('latest-selected');
        }
        
        selectedWordsContainer.appendChild(selectedWordEl);
    });
    
    // 選択領域を自動スクロールして最新の選択を表示
    selectedWordsContainer.scrollTop = selectedWordsContainer.scrollHeight;
}

// 接続可能な単語を更新する関数
// function updateSelectableWords() {
//     const wordItems = document.querySelectorAll('.word-item');
//     wordItems.forEach(item => {
//         item.classList.remove('selectable');
//     });
    
//     if (selectedWords.length > 0) {
//         const lastSelectedWord = selectedWords[selectedWords.length - 1];
//         const lastChar = lastSelectedWord.charAt(lastSelectedWord.length - 1);
        
//         wordItems.forEach(item => {
//             const word = item.dataset.word;
//             if (!selectedWords.includes(word) && word.charAt(0) === lastChar) {
//                 item.classList.add('selectable');
//             }
//         });
//     }
    
//     // 最新選択のハイライト
//     updateLatestSelectedHighlight();
// }

//ガイドを消去
function updateSelectableWords() {
    // 最新選択のハイライトは残す
    updateLatestSelectedHighlight();
}

// 最新選択のハイライトを更新
function updateLatestSelectedHighlight() {
    // 単語プール内の選択済み単語のハイライトを更新
    const wordItems = document.querySelectorAll('.word-item');
    wordItems.forEach(item => {
        item.classList.remove('latest-selected');
    });
    
    if (selectedWords.length > 0) {
        const latestWord = selectedWords[selectedWords.length - 1];
        const latestButton = document.querySelector(`.word-item.selected[data-word="${latestWord}"]`);
        if (latestButton) {
            latestButton.classList.add('latest-selected');
        }
    }
    
    // 選択された単語表示領域内の最新選択もハイライト
    const selectedWordEls = document.querySelectorAll('.selected-word');
    selectedWordEls.forEach(el => {
        el.classList.remove('latest-selected');
    });
    
    const selectedWordElsArray = Array.from(selectedWordEls);
    if (selectedWordElsArray.length > 0) {
        selectedWordElsArray[selectedWordElsArray.length - 1].classList.add('latest-selected');
    }
}

// スコア表示を更新する関数
function updateScoreDisplay(currentScore) {
    const scoreDisplay = document.getElementById('scoreDisplay');
    // アニメーションなしで単純に合計スコアを表示
    scoreDisplay.textContent = totalScore + currentScore;
}

// 選択をリセットする関数
function resetSelection() {
    selectedWords = [];
    currentStageScore = 0;
    
    // 選択された単語の表示をクリア
    document.getElementById('selectedWords').innerHTML = '';
    
    // 単語プールのスタイルをリセット
    const wordItems = document.querySelectorAll('.word-item');
    wordItems.forEach(item => {
        item.classList.remove('selected', 'selectable', 'invalid', 'latest-selected');
    });
    
    // スコア表示を更新
    updateScoreDisplay(currentStageScore);
}

// GOボタンを再度有効化する
function resetSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
}

// 次のステージに進む共通関数
function proceedToNextStage(earnedScore) {
    // 最終ステージかどうかをチェック
    if (currentStage === stages.length - 1) {
        // ゲーム終了 - アラートではなく結果画面へ
        setTimeout(() => {
            // ゲーム統計の更新
            gameStats.clearedStages = currentStage + 1;
            
            // 結果画面を表示
            showFinalResults();
        }, 100);
    } else {
        // 次のステージへ
        setTimeout(() => {
            currentStage++;
            currentStageScore = 0;
            loadStage(currentStage);
        }, 100);
    }
}