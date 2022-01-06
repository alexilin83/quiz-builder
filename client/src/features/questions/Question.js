import React, { useState } from 'react';
import { TrashIcon, CheckIcon, XIcon } from '@heroicons/react/outline';

const Question = props => {
    const [isActive, setIsActive] = useState(props.isActive || false);

    let { id, title, image } = props.question;

    function onHeaderClicked() {
        setIsActive(!isActive);
    }

    return (
        <div className="mb-5 bg-gray-50 rounded-lg overflow-hidden">
            <header className={`flex items-center px-5 py-5 bg-gray-50 cursor-pointer transition hover:bg-gray-200 ${isActive ? 'bg-green-400 text-white hover:bg-green-400': ''}`} onClick={onHeaderClicked}>
                <div className="flex-grow">
                    <h3 className="m-0 text-current">
                        <span className="inline-block pr-2 opacity-50">{props.index}</span>
                        {title}
                    </h3>
                </div>
                <button type="button" className="flex flex-grow-0 justify-center items-center transition hover:text-pink-500" onClick={e => props.onDeleted(id, e)}>
                    <TrashIcon className="h-6 w-6"/>
                </button>
            </header>
            {isActive &&
                <div className="px-10 py-8">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-3">
                            <label className="label">Текст</label>
                            <textarea className="input-textarea h-28 mb-5" name="title" value={title} onChange={e => props.onDataChanged(id, e)} />
                            <label className="label">Изображение</label>
                            <div className="flex items-center mb-5">
                                <span className="thumb mr-2">
                                    { image && <img className="thumb__img" src={image} alt="" /> }
                                </span>
                                <input type="text" className="input-text" name="image" value={image} onChange={e => props.onDataChanged(id, e)} />
                            </div>
                        </div>
                        <div className="col-span-3">
                            <label className="label">Ответы</label>
                            {props.answers.map(answer =>
                                <div key={answer.id} className="mt-2 flex rounded-md shadow-sm">
                                    <button type='button' className={`inline-flex items-center px-3 rounded-l-md text-white ${answer.isCorrect ? 'bg-green-400 hover:bg-green-500': 'bg-red-400 hover:bg-red-500'}`} onClick={() => props.onCorrectAnswerChanged(id, answer.id)}>
                                        { answer.isCorrect ? <CheckIcon className='w-6 h-6' /> : <XIcon className='w-6 h-6' /> }
                                    </button>
                                    <input type="text" className="input-text flex-1 rounded-none z-10" value={answer.title} onChange={e => props.onAnswerChanged(answer.id, e)} />
                                    <button type='button' className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 transition hover:text-pink-500" onClick={() => props.onAnswerDeleted(answer.id)}>
                                        <TrashIcon className="h-6 w-6"/>
                                    </button>
                                </div>
                            )}
                            <button type="button" className="btn btn_secondary mt-5" onClick={() => props.onAnswerAdded(id)}>Добавить ответ</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Question;