// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddUser from './add';
import DeleteUser from './delete';
import FindUser from './find';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db,auth, provider } from './Firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
function App() {
  const [user, setUser] = useState(null); // Firebaseユーザー
  const [dbUsers, setdbUsers] = useState([]); // Firesroreのデータ
useEffect(() => {
// Firestoreからusersコレクションを取得
const fetchUsers = async () => {
const usersCol = collection(db, 'mydata');
const userSnapshot = await getDocs(usersCol);
const userList = userSnapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));
setdbUsers(userList);
};

// 認証状態を監視
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  setUser(currentUser);
});

fetchUsers();

return () => unsubscribe();

}, []);

// Googleログイン処理
const handleLogin = async () => {
  try {
  await signInWithPopup(auth, provider);
  } catch (error) {
  console.error("ログインエラー :", error);
  }
  };
  // ログアウト処理
  const handleLogout = async () => {
  try {
  await signOut(auth);
  } catch (error) {
  console.error("ログアウトエラー :", error);
  }
  };

return (
  <Router>
<Navigation /> {/* ← ナビゲーションをここ䛻表示 */}

<div className="p-4 flex justify-end bg-gray-100">
{user ? (
<div>
<span className="mr-4">こんにちは、 {user.displayName} さん</span>
<button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">ログアウト </button>
</div>
) : (
<button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">Googleでログイン </button>
)}
</div>

<Routes>
<Route path="/" element={
  <div>
  <h1>Users from Firestore</h1>
  <table>
    <tr>
      <th>id</th>
      <td>name</td>
      <td>mail</td>
      <td>dorm</td>
    </tr>

    {user ? (
          <tbody>
          {dbUsers.map(user => (
          <tr key={user.id} className='border-b-2 border-gray-400'>
          <th className='p-4'>{user.id}</th>
          <td className='p-4'>{user.name}</td>
          <td className='p-4'>{user.mail}</td>
          <td className='p-4'>{user.dorm ? "寮生" : "通学"}</td>
          </tr>
          ))}
          </tbody>
          ) : (
          <tbody>
          <tr><th colSpan={4} className="text-gray-600 mt-4">ログインするとデータが見られます。 </th></tr>
          </tbody>
          )}
  </table>
  </div>
  } />
  {user ? (
<>
<Route path="/add" element={<AddUser />} />
<Route path="/delete" element={<DeleteUser />} />
<Route path="/find" element={<FindUser />} />
</>
) : (
<>
<Route path="/add" element={<p>ログインしてください </p>} />
<Route path="/delete" element={<p>ログインしてください </p>} />
<Route path="/find" element={<p>ログインしてください </p>} />
</>
)}
  </Routes>
  </Router>
  );
  }
  export default App;