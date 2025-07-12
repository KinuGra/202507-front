'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function ApiExample() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await apiClient.get('/api/items/');
        setItems(data);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div>
      <h2>APIテスト</h2>
      <p>アイテム数: {items.length}</p>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}