import { useCallback, useMemo, useRef } from 'react';
import './ReactVisualEditor.scss';
import { 
  ReactVisualEditorValue,
  ReactVisualEditorConfig,
  ReactVisualEditorComponent,
  createVisualBlock, 
  ReactVisualEditorBlock} from './ReactVisualEditor.utils';
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

  const focusData = useMemo(() => {
    const focus: ReactVisualEditorBlock[] = []
    const unFocus: ReactVisualEditorBlock[] = []
    props.value.blocks.forEach(block => {
      (block.focus ? focus : unFocus).push(block)
    })

    return {
      focus,
      unFocus
    }
  }, [props.value.blocks])

  const methods = {
    updateBlocks: (blocks: ReactVisualEditorBlock[]) => {
      props.onChange({
        ...props.value,
        blocks: [...blocks]
      })
    },
    clearFocus: (external?: ReactVisualEditorBlock) => {
      let data = !!external ? focusData.focus.filter(item => item !== external) : focusData.focus;

      data.forEach(block => {
        block.focus = false
      })

      methods.updateBlocks(props.value.blocks)

    }
  }

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

  const focusHandler = (() => {
    const block = (e: React.MouseEvent<HTMLDivElement>, block: ReactVisualEditorBlock) => {
      if (e.shiftKey) {
        /*如果摁住了shift键，如果此时没有选中的block，就选中这个block，否则令这个block的选中状态去翻*/
        if (focusData.focus.length <= 1) {
            block.focus = true
        } else {
            block.focus = !block.focus
        }
        methods.updateBlocks(props.value.blocks)
      } else {
          /*如果点击的这个block没有被选中，才清空这个其他选中的block，否则不做任何事情。放置拖拽多个block，取消其他block的选中状态*/
          if (!block.focus) {
              block.focus = true
              methods.clearFocus(block)
          }
      }
    }
    
    const container = (e: React.MouseEvent<HTMLDivElement>) => {
      if(e.target !== e.currentTarget) return

      if(!e.shiftKey) methods.clearFocus()
    }

    return {
      block,
      container
    }
  })()

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
        <div
          className="react-visual-editor-container"
          style={containerStyles}
          ref={containerRef}
          onMouseDown={focusHandler.container}>
          {
            props.value.blocks.map((block, index) => (
              <ReactVisualBlock
                key={index}
                block={block}
                config={props.config}
                onMouseDown={(e) => focusHandler.block(e, block)}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}