export function Quizscreen() {
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
      {/* プレイヤー画像＋名前 */}
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '40px' }}>
        {/* Alice */}
        <div style={{ position: 'relative', width: '180px', height: '140px' }}>
          <img
            src="./asobu_cat_shadow.png"
            alt="Alice"
            style={{
              width: '180px',
              height: '140px',
              objectFit: 'cover',
              borderRadius: '18px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
              background: '#eee',
              display: 'block',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              background: 'rgba(255,255,255,0.7)',
              color: '#FF7043',
              borderRadius: '0 0 18px 18px',
              padding: '10px 0',
              fontWeight: 700,
              fontSize: '1.3em',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(255,167,38,0.13)',
            }}
          >
            Alice
          </span>
        </div>
        {/* Bob */}
        <div style={{ position: 'relative', width: '180px', height: '140px' }}>
          <img
            src="./asobu_cat_shadow.png"
            alt="Bob"
            style={{
              width: '180px',
              height: '140px',
              objectFit: 'cover',
              borderRadius: '18px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
              background: '#eee',
              display: 'block',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              background: 'rgba(255,255,255,0.7)',
              color: '#FF7043',
              borderRadius: '0 0 18px 18px',
              padding: '10px 0',
              fontWeight: 700,
              fontSize: '1.3em',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(255,167,38,0.13)',
            }}
          >
            Bob
          </span>
        </div>
      </div>
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
        富士山の標高は何メートル？
      </div>
      {/* 答え入力フィールド */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="ここに答えを入力"
          style={{
            width: '80%',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #FFA726',
            fontSize: '1.1em',
            fontWeight: 600,
            color: '#FF7043',
            outline: 'none',
            boxShadow: '0 1px 4px rgba(255,167,38,0.10)',
            marginBottom: '8px',
          }}
        />
        {/* 必要なら送信ボタンなど追加可能 */}
      </div>
    </div>
  );
}