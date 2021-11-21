import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/outline';

const Question = props => {
    const [isActive, setIsActive] = useState(props.isActive || false);

    let { id, title, image, answers } = props.question;

    function handleHeaderClick() {
        setIsActive(!isActive);
    }

    return (
        <div className="mb-3 bg-gray-50 rounded-lg overflow-hidden shadow">
            <header className={`flex items-center px-5 py-5 bg-gray-100 cursor-pointer transition hover:bg-gray-200 ${isActive ? 'bg-gray-200': ''}`} onClick={handleHeaderClick}>
                <div className="flex-grow">
                    <h3 className="m-0">
                        <span className="inline-block pr-2 text-gray-400">{props.index}</span>
                        {title}
                    </h3>
                </div>
                <button type="button" className="flex flex-grow-0 justify-center items-center transition hover:text-pink-500" onClick={e => props.onDelete(id, e)}>
                    <TrashIcon className="h-6 w-6"/>
                </button>
            </header>
            {isActive &&
                <div className="px-10 py-8">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-3">
                            <label className="label">Текст</label>
                            <textarea type="text" className="input-textarea h-28 mb-5" value={title} onChange={e => props.onTitleChange(id, e)} />
                            <label className="label">Изображение</label>
                            <input type="text" className="input-text mb-2" value={image} onChange={e => props.onImageChange(id)} />
                            <div className="thumb">
                                <img className="thumb__img" src={image} alt="" />
                            </div>
                        </div>
                        <div className="col-span-3">
                            <label className="label">Ответы</label>
                            {answers.map(answer => 
                                <div key={answer.id} className="mb-2">
                                    <input type="text" className="input-text" value={answer.title} onChange={e => props.onAnswerChange(answer.id, id, e)} />
                                </div>
                            )}
                            <button type="button" className="btn btn_secondary mt-5" onClick={props.onAnswerAdd}>Добавить</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Question;