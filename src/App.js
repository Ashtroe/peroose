
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { AuthProvider } from './context/authContext'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Forgot from './pages/Forgot'
import PostPage from './pages/PostPage'
import Create from './pages/Create'
import Account from './pages/Account'
import SubPage from './pages/SubPage'


function App() {

  return (
    <AuthProvider>
      <ChakraProvider>
      <Router>

      <Navbar />
      <Switch>
            <PrivateRoute path="/create" component={Create}/>
            <PrivateRoute path="/account" component={Account}/>
            <Route path="/sub/:sub" component={SubPage}/>
            <Route path="/sub/post/:post" component={PostPage}/>
            <Route path="/post/:post" component={PostPage}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/login" component={Login}/>
            <Route path="/forgot" component={Forgot}/>
            <Route path="/home" component={Home}/>
            <Redirect exact from='/' to='/home'/>
          </Switch>
      </Router>
    </ChakraProvider>
    </AuthProvider>
    
  );
}

export default App;
