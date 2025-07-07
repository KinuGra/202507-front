type quizdata = {
  questionId: number,
  quizId: number,
  question: any,
  answerLetters: string[],
  answer_full: string,
  category: null | string,
  time: number, // ミリ秒
}
type userinfo = {
  id: number;
  username: string;
};

type userdata = {
  user: userinfo[]; // 最大4人まで格納可能
};

// ⚠注意::::引数でuserが入っているためuserdataを参照するとき、props.user.userみたいな感じになる

export function Quizscreen(props: { quizzes: quizdata[]; user: userdata }) {
  // 最初のクイズのtimeを表示（必要に応じてロジック調整）
  const time = props.quizzes.length > 0 ? props.quizzes[0].time : 0;
  const playerCount = props.user.user.length;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
        padding: '32px',
        borderRadius: '16px',
        color: '#fff',
        minWidth: '320px',
        maxWidth: '480px',
        margin: '0 auto',
        boxShadow: '0 4px 16px rgba(255,112,67,0.15)',
      }}
    >
      {/* 画面上部情報 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>プレイヤー数: {playerCount}</div>
        <div style={{ display: 'flex', gap: '16px', marginLeft: '8px' }}>
          {props.user.user.map((u) => (
            <span
              key={u.id}
              style={{
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '8px',
                padding: '6px 16px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                boxShadow: '0 1px 4px rgba(255,167,38,0.10)',
              }}
            >
              {u.username}
            </span>
          ))}
        </div>
        <div style={{ fontSize: '1em', marginTop: '4px' }}>time: {time} ms</div>
      </div>
      {/* ...ここに他のクイズ画面要素... */}
      {/* クイズ問題表示 */}
      <div
        style={{
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '32px',
          marginBottom: '16px',
          fontSize: '1.15em',
          fontWeight: 600,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(255,167,38,0.08)',
        }}
      >
        {props.quizzes.length > 0 ? props.quizzes[0].question : 'No question'}
      </div>
      {/* 正解候補（answerLetters）表示 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {props.quizzes.length > 0 &&
          props.quizzes[0].answerLetters.map((letter, idx) => (
            <span
              key={idx}
              style={{
                background: '#fff',
                color: '#FF7043',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: '1.1em',
                boxShadow: '0 1px 4px rgba(255,167,38,0.10)',
                cursor: 'pointer',
                userSelect: 'none',
                border: '2px solid #FFA726',
                transition: 'background 0.2s',
              }}
            >
              {letter}
            </span>
          ))}
      </div>
    </div>
  );
}