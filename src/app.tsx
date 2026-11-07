import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import HomePage from "./pages/home.js";
import ProfilePage from "./pages/profile.js";
import RootLayout from "./root_layout.js";
import React from "react";
import AuthForm from "./pages/hook-form.js";
import TanStackQueryPage from "./pages/tanstack-query.js";
import UserPage from "./pages/user-cards-page.js";
import DetailedUserPage from "./pages/detailed-user-page.js";
import UserCreateUpdatePage from "./pages/UserCreateUpdatePage.js";


const NotFoundPage = ()=><div>
    <h1 className="text-7xl text-red-950 uppercase font-bold">404 Not Found. </h1>
    <Link to='/'>Go gome</Link>
</div>

const router = createBrowserRouter([
    {
        path:'/',
        element: <RootLayout/>,
        children:[
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: 'profile/:id',
                element: <ProfilePage/>
            },
            {
                path: 'profile',
                element: <ProfilePage/>
            },
            {
                path: 'hook-form',
                element: <AuthForm/>
            },
            {
                path:'tanstack-query',
                element: <TanStackQueryPage/>
            },
            {
                path:"user-page",
                element: <UserPage/>
            },
            {
                path:"detailed-user-page/:UserId",
                element: <DetailedUserPage/>
            },
            {
                path:"userUpdate-create",
                element: <UserCreateUpdatePage/>
            }
        ]
    },
    {
        path: '*',
        element: <NotFoundPage/>
    }
])

const App:React.FC = ()=>{
    return <RouterProvider router={router}/>
}
export default App;