import logo from './logo.svg';
import './App.css';
import Auth from './Auth';
import Posts from './Post';
import Comments from './Comment';

function App() {
  return (
    <div className="App">
      <Auth/>
      <Posts/>
      <Comments/>
    </div>
  );
}

export default App;
