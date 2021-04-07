import { useEffect, useMemo, useRef } from "react";
import { ReactVisualEditorBlock, ReactVisualEditorConfig } from "./ReactVisualEditor.utils";
import {useUpdate} from './hook//useUpdate';

export const ReactVisualBlock: React.FC<{
  block: ReactVisualEditorBlock,
  config: ReactVisualEditorConfig
}> = (props) => {
  const {forceUpdate} = useUpdate();

  const styles = useMemo(() => {
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      opacity: props.block.adjustPosition ? '0' : ''
    }
  }, [props.block.top, props.block.left])

  const component = props.config.componentMap[props.block.componentKey]
  let render: any;
  if(!!component) {
    render = component.render()
  }

  const elRef = useRef({} as HTMLDivElement)

  useEffect(() => {
    if(props.block.adjustPosition) {
      const {top, left} = props.block
      const {height, width} = elRef.current.getBoundingClientRect()
      props.block.adjustPosition = false
      props.block.top = top - height / 2
      props.block.left = left - width / 2
      forceUpdate()
    }
  }, [])

  return (
    <div className="react-visual-editor-block" style={styles} ref={elRef}>
      {render}
    </div>
  )
}