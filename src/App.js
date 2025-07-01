import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddTodo from './add';
import DeleteTodo from './delete';
import FindTodo from './find';
import EditTodo from './edit'; 
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const todosCol = collection(db, 'todos');
      const snapshot = await getDocs(todosCol);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(list);
    };

    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });

    fetchTodos();
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
  };

  return (
    <Router>
      <Navigation />
      <div className="p-4 flex justify-end bg-gray-100">
        {user ? (
          <div>
            <span className="mr-4">こんにちは、{user.displayName} さん</span>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">ログアウト</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">Googleでログイン</button>
        )}
      </div>

      <Routes>
      <Route path="/" element={
  <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-6 text-center">スケジュール一覧</h1>

    {user ? (
      todos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 border border-gray-300">日付</th>
                <th className="py-3 px-4 border border-gray-300">やること</th>
                <th className="py-3 px-4 border border-gray-300">詳細</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border border-gray-200">{todo.date}</td>
                  <td className="py-2 px-4 border border-gray-200">{todo.title}</td>
                  <td className="py-2 px-4 border border-gray-200">{todo.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">データがまだありません。</p>
      )
    ) : (
      <p className="text-center text-gray-500">ログインするとデータが表示されます。</p>
    )}
  </div>
} />


        {user ? (
          <>
            <Route path="/add" element={<AddTodo />} />
            <Route path="/delete" element={<DeleteTodo />} />
            <Route path="/find" element={<FindTodo />} />
            <Route path="/edit" element={<EditTodo />} /> 
          </>
        ) : (
          <>
            <Route path="/add" element={<p>ログインしてください</p>} />
            <Route path="/delete" element={<p>ログインしてください</p>} />
            <Route path="/find" element={<p>ログインしてください</p>} />
            <Route path="/edit" element={<p>ログインしてください</p>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
