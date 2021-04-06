import './ReactVisualEditor.scss';
import { ReactVisualEditorValue } from './ReactVisualEditor.utils';

export const ReactVisualEditor: React.FC<{
  value: ReactVisualEditorValue,
  onChange: () => {}
}> = () => {
  return (
    <div className="react-visual-editor">
      <div className="react-visual-editor-menu">menu</div>
      <div className="react-visual-editor-head">head</div>
      <div className="react-visual-editor-operator">operator</div>
      <div className="react-visual-editor-body">body</div>
    </div>
  )
}