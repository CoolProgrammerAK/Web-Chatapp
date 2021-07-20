import './App.css'
import {BrowserRouter} from 'react-router-dom'
import Layout from './containers/layout';
function App() {
  return (
    <>
    <BrowserRouter>
      <Layout></Layout>
    </BrowserRouter>
    </>
  );
}

export default App;
