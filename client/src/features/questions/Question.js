import React, { useState } from 'react';

const Question = props => {
    const [expanded, setExpanded] = useState(false);
    const [title, setTitle] = useState(props.question.title);
    const [variants, setVariants] = useState(props.question.variants);

    const variantWords = ["ответ", "ответа", "ответов"];

    function declOfNum(number, words) {  
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
    }

    return (
        <div className="question">
            <header className="flex items-center">
                <div className="px-5 text-xl font-bold">{props.number}</div>
                <div className="leading-tight">
                    <h3 className="m-0">{title}</h3>
                    <p className="text-sm">{variants.length} {declOfNum(variants.length, variantWords)}</p>
                </div>
            </header>
            {expanded &&
                <div>
                    <label className="label">Название</label>
                    <input type="text" className="input-text" value={title} />
                </div>
            }
        </div>
    )
}

export default Question;