import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { TemplateIcon } from '@heroicons/react/outline';

const Header = () => (
    <div className="bg-gray-50 bg-opacity-50 border-b">
        <div className="container mx-auto py-7">
            <div className="flex justify-between items-center">
                <div className="flex w-2/6">
                    <TemplateIcon className="h-8 w-8 mr-3 text-green-600"/>
                    <h1 className="text-xl font-black text-gray-600">Конструктор тестов</h1>
                </div>
                <nav className="flex justify-center w-2/6 space-x-6 font-bold text-gray-400">
                    <NavLink end to="/" className={({ isActive }) => "nav-link" + (isActive ? " _active" : "")}>Тесты</NavLink>
                    <NavLink to="/quiz/new" className={({ isActive }) => "nav-link" + (isActive ? " _active" : "")}>Создать тест</NavLink>
                </nav>
                <div className="flex justify-end w-2/6">
                    <Link to="/login" className="btn">Войти</Link>
                </div>
            </div>
        </div>
    </div>
)

export default Header;