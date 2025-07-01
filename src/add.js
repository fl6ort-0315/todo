import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

function AddTodo() {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');  // 追加
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'todos'), {
        date,
        title,
        detail,  // 追加
      });
      alert('追加しました');
      navigate('/');
    } catch (error) {
      alert('追加に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold mb-4">リスト追加</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>日付：</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>やること：</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>詳細：</label>  {/* 追加 */}
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">追加</button>
      </form>
    </div>
  );
}

export default AddTodo;
