export interface ReactVisualEditorBlock {
  componentKey: string,
  top: number,
  left: number,
  adjustPosition: boolean,
  focus: boolean
}

export interface ReactVisualEditorValue {
  container: {
    height: number,
    width: number
  },
  blocks: ReactVisualEditorBlock[]
}

export interface ReactVisualEditorComponent {
  key: string,
  name: string,
  preview: () => JSX.Element,
  render: () => JSX.Element,
}

export function createVisualBlock(
  {
    top,
    left,
    component,
  }:
  {
    top: number,
    left: number,
    component: ReactVisualEditorComponent,
  }
): ReactVisualEditorBlock {
  return {
    componentKey: component.key,
    top,
    left,
    adjustPosition: true,
    focus: false
  }
}

export function createVisualConfig() {
  const componentMap: { [k: string]: ReactVisualEditorComponent } = {}
  const componentArray: ReactVisualEditorComponent[] = []

  function registryComponent(key: string, option: Omit<ReactVisualEditorComponent, 'key'>) {
    if(componentMap[key]) {
      const index = componentArray.indexOf(componentMap[key])
      componentArray.splice(index, 1)
    }

    const newComponent = {
      key,
      ...option,
    }

    componentArray.push(newComponent)
    componentMap[key] = newComponent
  }

  return {
      componentMap,
      componentArray,
      registryComponent,
  }
}

export type ReactVisualEditorConfig = ReturnType<typeof createVisualConfig>;