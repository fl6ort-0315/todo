// src/components/Navigation.js
import { Link } from 'react-router-dom';
import { FaBook } from "react-icons/fa";
import { FaBox } from "react-icons/fa";


function Navigation() {
return (
<nav className="bg-gray-100 pt-6 text-center">
<Link to="/">一覧</Link> | 
<Link to="/add">ユーザー追加 </Link> | 
<Link to="/delete">ユーザー削除 </Link> |
<Link to="/find">🔍 検索</Link>
</nav>
);
}

export default Navigation;