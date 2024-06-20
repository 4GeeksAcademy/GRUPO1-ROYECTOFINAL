import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Header } from "./component/header";
import Footer  from "./component/footer";
import UserProfile from "./pages/userProfile";
import CreatePost from "./pages/createPost";
import PostDetails from "./pages/postDetails";

//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Header />
                    <Routes>
                        <Route element={<Login></Login>}  path="/login"/>
                        <Route element={<Register />} path="/register" />
                        <Route element={<PostDetails />} path="/post/:postId" />
                        <Route element={<CreatePost />} path="/create-post" />
                        <Route element={<Home />} path="/" />
                        <Route element={<UserProfile />} path="/profile" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
