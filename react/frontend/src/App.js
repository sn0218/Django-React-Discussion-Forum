import {
  BrowserRouter as Router,
  Route, 
  Routes
} from "react-router-dom";
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ThreadForm from './components/ThreadForm'
import Home  from './pages/Home';
import Thread from './pages/Thread'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider} from './context/AuthContext'
import Test from './pages/Test'


function App() {
  /*
  <Route  element={<PrivateRoute />}>
          <Route path="/" element={<ThreadForm />} exact/>
          </Route>
          */ 
  return (
    
    <Router>
      <AuthProvider>
      <div className="App">
        <Header />
       
        <Routes>
          <Route path="/" element={<Home />} />
      
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/threads/:id" element={<Thread />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <Footer />
      </div>
      </AuthProvider>
    </Router>
   
   
    
  );
}

export default App;
