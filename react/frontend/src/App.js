import {
  BrowserRouter as Router,
  Route, 
  Routes
} from "react-router-dom";
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home  from './pages/Home';
import Thread from './pages/Thread'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider} from './context/AuthContext'

import Bookmark from "./pages/Bookmark";
import Topic from './pages/Topic'
import Profile from './pages/Profile'

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
          <Route path="/topic/:id" element={<Topic />} />
          <Route path="/profile/:id" element={<Profile />} exact/>
          <Route  element={<PrivateRoute />}>
            <Route path="/bookmark" element={<Bookmark />} exact/>
            
          </Route>
        </Routes>
        <Footer />
      </div>
      </AuthProvider>
    </Router>
   
   
    
  );
}

export default App;
