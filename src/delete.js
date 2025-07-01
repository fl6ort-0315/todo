import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function DeleteTodo() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const todosCol = collection(db, 'todos');
    const snapshot = await getDocs(todosCol);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTodos(list);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id) => {
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      await deleteDoc(doc(db, 'todos', id));
      alert('削除しました');
      fetchTodos();
    } catch (error) {
      alert('削除に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold mb-4">リスト削除</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="mb-2 border-b pb-2">
            <div><strong>日付:</strong> {todo.date}</div>
            <div><strong>やること:</strong> {todo.title}</div>
            <div><strong>詳細:</strong> {todo.detail}</div> {/* 追加 */}
            <button
              className="mt-1 px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => deleteTodo(todo.id)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeleteTodo;
