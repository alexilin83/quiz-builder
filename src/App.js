import React from 'react';
import { TemplateIcon } from '@heroicons/react/outline';
import QuizList from './features/quizes/QuizList';

const App = () => (
    <React.Fragment>
        <div className="bg-gray-50 bg-opacity-50 border-b">
            <div className="container mx-auto py-7">
                <div className="flex items-center">
                    <TemplateIcon className="h-8 w-8 mr-3 text-green-600"/>
                    <h1 className="text-xl font-black text-gray-600">Quiz Builder</h1>
                </div>
            </div>
        </div>
        <div className="container mx-auto py-7">
            <QuizList />
        </div>
    </React.Fragment>
)

export default App;