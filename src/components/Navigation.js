import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/" className="hover:underline">一覧</Link>
      <Link to="/add" className="hover:underline">追加</Link>
      <Link to="/delete" className="hover:underline">削除</Link>
      <Link to="/find" className="hover:underline">検索</Link>
      <Link to="/edit" className="hover:underline">編集</Link>
    </nav>
  );
}

export default Navigation;
