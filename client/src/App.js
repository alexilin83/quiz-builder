import React from 'react';
import { Routes, Route } from "react-router-dom";
import Header from './app/Header';
import QuizList from './features/quizes/QuizList';
import AddQuizForm from './features/quizes/AddQuizForm';
import EditQuizForm from './features/quizes/EditQuizForm';
import NotFound from './app/components/NotFound';

const App = () => (
    <React.Fragment>
        <Header />
        <div className="container mx-auto py-7">
            <Routes>
                <Route path="/" element={<QuizList />} />
                <Route path="/quizes/new" element={<AddQuizForm />} />
                <Route path="/quizes/:id" element={<EditQuizForm />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    </React.Fragment>
)

export default App;