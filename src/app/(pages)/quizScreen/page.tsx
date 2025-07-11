import styles from './quizScreen.module.css';

export default function Quizscreen() {
  return (
    <div className={styles.container}>
      {/* プレイヤー画像＋名前 */}
      <div className={styles.players}>
        {/* Alice */}
        <div className={styles.player}>
          <img
            src="./asobu_cat_shadow.png"
            alt="Alice"
            className={styles.playerImg}
          />
          <span className={styles.playerName}>Alice</span>
        </div>
        {/* Bob */}
        <div className={styles.player}>
          <img
            src="./asobu_cat_shadow.png"
            alt="Bob"
            className={styles.playerImg}
          />
          <span className={styles.playerName}>Bob</span>
        </div>
      </div>
      {/* クイズ問題表示 */}
      <div className={styles.quizBox}>
        富士山の標高は何メートル？
      </div>
      {/* 答え入力フィールド */}
      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="ここに答えを入力"
          className={styles.inputField}
        />
        {/* 必要なら送信ボタンなど追加可能 */}
      </div>
    </div>
  );
}