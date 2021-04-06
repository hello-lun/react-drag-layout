export interface ReactVisualEditorBlock {
  componentKey: string,
  top: number,
  left: number
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
  preview: () => JSX.Element,
  render: () => JSX.Element,
}

export function createVisualConfig() {
  
}