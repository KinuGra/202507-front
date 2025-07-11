// env.d.ts
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** ブラウザにも埋め込む公開用変数（NEXT_PUBLIC_ プレフィックス必須） */
      NEXT_PUBLIC_COG_POOL_ID: string;
      NEXT_PUBLIC_COG_CLIENT_ID: string;
      NEXT_PUBLIC_COG_DOMAIN: string;
      NEXT_PUBLIC_REDIRECT_URI: string;

      /** サーバー専用の機密変数（クライアントに露出しません） */
      COG_POOL_ID: string;
      COG_CLIENT_ID: string;
      COG_DOMAIN: string;
      REDIRECT_URI: string;
    }
  }
}
