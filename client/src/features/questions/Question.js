import React, { useState } from 'react';
import { TrashIcon, CheckIcon, XIcon } from '@heroicons/react/outline';
import { PlusCircleIcon } from '@heroicons/react/solid';

const Question = props => {
    const [isActive, setIsActive] = useState(props.isActive || false);

    let { id, title, image, imageSource } = props.question;

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
            <div className={`px-10 py-8 ${isActive ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-3">
                        <label className="label">Текст <span className='text-red-500'>*</span></label>
                        <textarea className="input-textarea h-28 mb-5" name="title" value={title} onChange={e => props.onDataChanged(id, e)} required />
                        <label className="label">Изображение</label>
                        <div className="flex items-center mb-5">
                            <span className="thumb mr-2">
                                { image && <img className="thumb__img" src={image} alt="" /> }
                            </span>
                            <input type="text" className="input-text" name="image" value={image} onChange={e => props.onDataChanged(id, e)} />
                        </div>
                        <label className="label">Источник изображения</label>
                        <input type="text" className="input-text" name="imageSource" value={imageSource} onChange={e => props.onDataChanged(id, e)} />
                    </div>
                    <div className="col-span-3">
                        <label className="label">Ответы <span className='text-red-500'>*</span></label>
                        {props.answers.map(answer => {
                            if (!answer.isDeleted) {
                                return (
                                    <div key={answer.id} className="mt-2 flex rounded-md shadow-sm">
                                        <button type='button' className={`inline-flex items-center px-3 border border-r-0 rounded-l-md transition ${answer.isCorrect ? 'bg-green-400 border-transparent text-white': 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`} onClick={() => props.onCorrectAnswerChanged(id, answer.id)}>
                                            { answer.isCorrect ? <CheckIcon className='w-6 h-6' /> : <XIcon className='w-6 h-6' /> }
                                        </button>
                                        <input type="text" className="input-text flex-1 rounded-none z-10" value={answer.title} onChange={e => props.onAnswerChanged(answer.id, e)} required />
                                        <button type='button' className="inline-flex items-center px-3 rounded-r-md bg-gray-50 border border-l-0 border-gray-300 transition hover:bg-gray-100 hover:text-pink-500" onClick={() => props.onAnswerDeleted(answer.id)}>
                                            <TrashIcon className="h-6 w-6"/>
                                        </button>
                                    </div>
                                )
                            }
                            return false;
                        })}
                        <button type="button" className="btn btn_secondary mt-5" onClick={() => props.onAnswerAdded(id)}>
                            <PlusCircleIcon className='h-5 w-5 mr-2' />
                            Добавить ответ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Question;