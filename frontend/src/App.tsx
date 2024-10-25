import { Register } from './components/Register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import './styles/App.css';

function App(): JSX.Element{
  return (
    <div className="App">
      <Register/>
    </div>
  );
}

export default App;
