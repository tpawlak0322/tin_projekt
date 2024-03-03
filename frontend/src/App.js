import logo from './logo.svg';
import './App.css';
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools, ReactQueryDevtoolsPanel} from "react-query/devtools";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Homepage from "./components/Homepage";
import Threads from "./components/Threads";
import UsersFollowed from "./components/UsersFollowed";
import ThreadMessages from "./components/Messages";
import ThreadsForGuest from "./components/ThreadsForGuest";
import ManageAccounts from "./components/ManageAccounts";
import Navbar from './components/Navbar';
import Followers from "./components/Followers";
import Logout from "./components/Logout";


function App() {
  const queryClient = new QueryClient()
    if(localStorage.getItem("role") == null)
        localStorage.setItem("role","guest")
  return (
      <div className="App">
          <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Navbar />
          <Routes>
          <Route path="/register" element=<Register/> />
          <Route path="/login" element=<Login /> />
          <Route path="/" element=<Homepage /> />
          <Route path="/threads" element=<Threads /> />
          <Route path="/users" element=<UsersFollowed /> />
          <Route path="/getThread/:id/:username" element=<ThreadMessages /> />
          <Route path="/ThreadsForGuest/" element=<ThreadsForGuest /> />
          <Route path="/ManageAccounts/" element=<ManageAccounts /> />
          <Route path="/Followers/" element=<Followers /> />
          <Route path="/Logout/" element=<Logout /> />
          </Routes>
      </BrowserRouter>
          </QueryClientProvider>

      </div>

  );
}

export default App;
