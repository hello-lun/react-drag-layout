import './app.scss'
import {useState} from "react";
import {Input, notification} from 'antd'

function App() {

    const [formData, setFormData] = useState({
        username: 'hello world',
        maxLevel: 200,
        minLevel: 100,
    } as any)
    const [customProps] = useState({
        submitButton: {
            onClick: () => {
                notification.info({message: '执行提交表单逻辑'})
            }
        },
        changeField: {
            onChange: (e: any) => {
                notification.info({message: e.target.value})
            }
        },
    })

    return (
        <div className="app">
            <h1>hello world</h1>
        </div>
    )
}

export default App
