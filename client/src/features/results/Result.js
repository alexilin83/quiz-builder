import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/outline';

const Result = props => {
    const [isActive, setIsActive] = useState(props.isActive || false);

    let { id, title, min, max } = props.result;

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
                        <label className="label">Кол-во очков <span className='text-red-500'>*</span></label>
                    </div>
                    <div className='form-group__inner'>
                        <div className="flex items-center">
                            <i>от</i>
                            <input type="number" className="input-text w-24 mx-3" name="min" value={min} min="0" max={props.max} onChange={e => props.onDataChanged(id, e)} required />
                            <i>до</i>
                            <input type="number" className="input-text w-24 mx-3" name="max" value={max} min="0" max={props.max} onChange={e => props.onDataChanged(id, e)} required />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Result;