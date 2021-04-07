import { useCallback, useMemo, useRef } from 'react';
import './ReactVisualEditor.scss';
import { 
  ReactVisualEditorValue,
  ReactVisualEditorConfig,
  ReactVisualEditorComponent,
  createVisualBlock } from './ReactVisualEditor.utils';
import {ReactVisualBlock} from './ReactVisualBlock';
import { useCallbackRef } from './hook/useCallbackRef';

export const ReactVisualEditor: React.FC<{
  value: ReactVisualEditorValue,
  onChange: (val: ReactVisualEditorValue) => void,
  config: ReactVisualEditorConfig
}> = (props) => {
  console.log(props, 88)

  const containerStyles = useMemo(() => {
    return {
      height: `${props.value.container.height}px`,
      width: `${props.value.container.width}px`
    }
  }, [
    props.value.container.height,
    props.value.container.width,
  ])

  const containerRef = useRef({} as HTMLDivElement)

  const menuDraggier = (() => {

    const dragData = useRef({
      dragComponent: null as null | ReactVisualEditorComponent
    })
    
    const container = {
      dragenter: useCallbackRef((e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'move';
      }),
      dragover: useCallbackRef((e: DragEvent) => {e.preventDefault()}),
      dragleave: useCallbackRef((e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none';
      }),
      drop: useCallbackRef((e: DragEvent) => {
        console.log('新增block')
        props.onChange({
          ...props.value,
          blocks: [
            ...props.value.blocks,
            createVisualBlock({
              top: e.offsetY,
              left: e.offsetX,
              component: dragData.current.dragComponent
            })
          ]
        })
      }),
    }

    const block = {
      dragstart: useCallback((e: React.DragEvent<HTMLDivElement>, dragComponent: ReactVisualEditorComponent) => {
        containerRef.current.addEventListener('dragenter', container.dragenter)
        containerRef.current.addEventListener('dragover', container.dragover)
        containerRef.current.addEventListener('dragleave', container.dragleave)
        containerRef.current.addEventListener('drop', container.drop)

        dragData.current.dragComponent = dragComponent;
      }, []),
      dragend: useCallback((e: React.DragEvent<HTMLDivElement>) => {
        containerRef.current.removeEventListener('dragenter', container.dragenter)
        containerRef.current.removeEventListener('dragover', container.dragover)
        containerRef.current.removeEventListener('dragleave', container.dragleave)
        containerRef.current.removeEventListener('drop', container.drop)
      }, []),
    }

    return block;

  })();

  return (
    <div className="react-visual-editor">
      <div className="react-visual-editor-menu">
        {
          props.config.componentArray.map((component, index) => (
            
            <div className="react-visual-editor-menu-component"
              key={index}
              draggable
              onDragStart={(e) => menuDraggier.dragstart(e, component)}
              onDragEnd={menuDraggier.dragend}
              // onDragStart={() => menuDraggier.dragstart(component)}
              // onDragEnd={menuDraggier.dragend}
            >
              {component.preview()}
              <div className="react-visual-editor-menu-component-name">{component.name}</div>
            </div>
          ))
        }
      </div>
      <div className="react-visual-editor-head">head</div>
      <div className="react-visual-editor-operator">operator</div>
      <div className="react-visual-editor-body">
        <div className="react-visual-editor-container" style={containerStyles} ref={containerRef}>
          {
            props.value.blocks.map((block, index) => (
              <ReactVisualBlock
                key={index}
                block={block}
                config={props.config}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}