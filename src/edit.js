import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function EditTodo() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: '', title: '', detail: '' });

  const fetchTodos = async () => {
    const todosCol = collection(db, 'todos');
    const snapshot = await getDocs(todosCol);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTodos(list);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setFormData({ date: todo.date, title: todo.title, detail: todo.detail || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ date: '', title: '', detail: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveEdit = async () => {
    if (!formData.date || !formData.title) {
      alert('日付とやることは必須です');
      return;
    }
    try {
      const docRef = doc(db, 'todos', editingId);
      await updateDoc(docRef, formData);
      alert('更新しました');
      setEditingId(null);
      fetchTodos();
    } catch (error) {
      alert('更新に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold mb-4">リスト編集</h1>

      {todos.length === 0 && <p>データがありません</p>}

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="mb-4 border-b pb-2">
            {editingId === todo.id ? (
              <>
                <div className="mb-2">
                  <label>日付:</label>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border p-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label>やること:</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border p-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label>詳細:</label>
                  <input
                    name="detail"
                    value={formData.detail}
                    onChange={handleChange}
                    className="border p-1 w-full"
                  />
                </div>
                <button
                  className="mr-2 px-3 py-1 bg-green-500 text-white rounded"
                  onClick={saveEdit}
                >
                  保存
                </button>
                <button
                  className="px-3 py-1 bg-gray-300 rounded"
                  onClick={cancelEdit}
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <div><strong>日付:</strong> {todo.date}</div>
                <div><strong>やること:</strong> {todo.title}</div>
                <div><strong>詳細:</strong> {todo.detail}</div>
                <button
                  className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => startEdit(todo)}
                >
                  編集
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditTodo;
