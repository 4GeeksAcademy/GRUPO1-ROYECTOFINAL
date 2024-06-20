import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../store/appContext";

const PrivateRoute = () => {
    const { store } = useContext(Context);

    return store.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
