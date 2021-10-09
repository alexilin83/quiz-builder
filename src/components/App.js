import React from 'react';
import { TemplateIcon } from '@heroicons/react/outline'

const App = () => (
    <React.Fragment>
        <div class="bg-gray-50 bg-opacity-50 border-b">
            <div class="container mx-auto py-7">
                <div className="flex items-center">
                    <TemplateIcon className="h-8 w-8 mr-3 text-green-600"/>
                    
                    <h1 class="text-xl font-black text-gray-600">Конструктор тестов</h1>
                </div>
            </div>
        </div>
        <div class="container mx-auto py-7">
        </div>
    </React.Fragment>
)

export default App;