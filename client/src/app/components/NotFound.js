import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="text-center">
            <h2>Страница не найдена</h2>
            <p>Попробуйте изменить запрос или перейдите в <Link to="/">начало</Link>.</p>
        </div>
    );
};

export default NotFound;
