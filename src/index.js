import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import MainPage from './components/MainPage/MainPage';
import AuthorizationPage from './components/AuthorizationPage/AuthorizationPage';
import ToDoList from './components/ToDoList/ToDoList';
import ScrumBoardPage from './components/ScrumBoardPage/ScrumBoardPage';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Router } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthorizationPage />
    // element: "AuthorizationPage"
  },
  {
    path: "/todolist",
    element: <ToDoList />
  },
  {
    path: "/board",
    element: <ScrumBoardPage />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router}/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
