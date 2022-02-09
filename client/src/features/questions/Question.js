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
        <div className="overflow-hidden mb-5 rounded shadow">
            <header className={`flex items-center p-5 cursor-pointer transition ${isActive ? 'bg-gray-400 text-white' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={onHeaderClicked}>
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
            <div className={`px-8 ${isActive ? 'block' : 'hidden'}`}>
                <div className="form-group">
                    <div className='form-group__label'>
                        <label className="label">Текст <span className='text-red-500'>*</span></label>
                    </div>
                    <div className='form-group__inner'>
                        <textarea className="input-textarea h-28" name="title" value={title} onChange={e => props.onDataChanged(id, e)} required />
                    </div>
                </div>
                <div className="form-group">
                    <div className='form-group__label'>
                        <label className="label">Изображение</label>
                    </div>
                    <div className='form-group__inner'>
                        <input type="text" className="input-text mb-2" name="image" value={image} onChange={e => props.onDataChanged(id, e)} />
                        <span className="thumb">
                            { image && <img className="thumb__img" src={image} alt="" /> }
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <div className='form-group__label'>
                        <label className="label">Источник изображения</label>
                    </div>
                    <div className='form-group__inner'>
                        <input type="text" className="input-text" name="imageSource" value={imageSource} onChange={e => props.onDataChanged(id, e)} />
                    </div>
                </div>
                <div className="form-group border-b-0">
                    <div className='form-group__label'>
                        <label className="label">Ответы <span className='text-red-500'>*</span></label>
                    </div>
                    <div className='form-group__inner'>
                        {props.answers.map(answer => {
                            if (!answer.isDeleted) {
                                return (
                                    <div key={answer.id} className="mb-3 flex max-w-lg">
                                        <button type='button' className={`inline-flex items-center px-3 border border-r-0 rounded-l-md transition ${answer.isCorrect ? 'bg-teal-400 border-transparent text-white': 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`} onClick={() => props.onCorrectAnswerChanged(id, answer.id)}>
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
                        <button type="button" className="btn btn_secondary" onClick={() => props.onAnswerAdded(id)}>
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