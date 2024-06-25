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
import Footer from "./component/footer";
import UserProfile from "./pages/userProfile";
import CreatePost from "./pages/createPost";
import EditPost from "./pages/editPost";  // Asegúrate de tener esta página
import PostDetails from "./pages/postDetails";
import PrivateRoute from "./utils/privateRoute";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Header />
                    <Routes>
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<PostDetails />} path="/post/:postId" />

                        <Route element={<PrivateRoute />}>
                            <Route element={<CreatePost />} path="/create-post" />
                            <Route element={<EditPost />} path="/edit-post/:postId" />  // Agregar ruta para editar post
                            <Route element={<UserProfile />} path="/profile" />
                        </Route>
                        <Route element={<Home />} path="/" />
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
