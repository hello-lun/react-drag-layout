import { useState } from 'react';
import { ReactVisualEditorValue } from './packages//ReactVisualEditor.utils';
import './app.scss'
import {ReactVisualEditor} from './packages/ReactVisualEditor';
import { visualConfig } from './visual.config';

export default () => {
    const [editorValue, setEditorValue] = useState({
        container: {
            height: 700,
            width: 1000
        },
        blocks: []
    }  as ReactVisualEditorValue)
    
    return (
        <div className="app">
            <ReactVisualEditor config={visualConfig} value={editorValue} onChange={setEditorValue} />
        </div>
    )
}
