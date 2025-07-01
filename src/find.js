import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function FindTodo() {
  const [todos, setTodos] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const snapshot = await getDocs(collection(db, 'todos'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(data);
      setFiltered(data);
    };
    fetch();
  }, []);

  const handleSearch = (e) => {
    const kw = e.target.value;
    setKeyword(kw);
    setFiltered(todos.filter(t => t.title.includes(kw)));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-2">タスク検索</h2>
      <input type="text" value={keyword} onChange={handleSearch} placeholder="タイトルで検索" className="w-full border p-1 mb-2" />
      <ul>
        {filtered.map(todo => (
          <li key={todo.id} className="bg-white p-2 mb-1 shadow rounded">
            {todo.title} - {todo.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FindTodo;
