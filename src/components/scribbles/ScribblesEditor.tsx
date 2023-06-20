import {
  forwardRef,
  useImperativeHandle,
  useRef,
  memo,
  useCallback,
} from "react";
import { DrawMode, EditorMode, IScribble } from "../../types/scribbles";
import { ScribblesDrawEditor } from "./ScribblesDrawEditor";
import { ScribblesTextEditor } from "./ScribblesTextEditor";

export interface IScribblesEditorHandle {
  focus: (options?: FocusOptions) => void;
}

interface IScribblesEditorProps {
  editorMode: EditorMode;
  drawMode: DrawMode;
  scribble?: IScribble;
  onCreate: (option?: { contents?: string; drawing?: string }) => void;
  onUpdateContent: (id: string, content: string) => void;
  onUpdateDrawing: (id: string, drawing: string) => void;
  onDelete: (id: string) => void;
}

export const ScribblesEditor = memo(
  forwardRef<IScribblesEditorHandle, IScribblesEditorProps>(
    (
      {
        editorMode,
        drawMode,
        scribble,
        onCreate,
        onUpdateContent,
        onUpdateDrawing,
        onDelete,
      },
      ref
    ) => {
      const editorRef = useRef<HTMLTextAreaElement>(null);

      useImperativeHandle(
        ref,
        () => ({
          focus(options?: FocusOptions) {
            editorRef.current?.focus(options);
          },
        }),
        []
      );

      const onCreateText = useCallback(
        (contents: string) => {
          onCreate({ contents });
        },
        [onCreate]
      );

      const onCreateDraw = useCallback(
        (drawing: string) => {
          onCreate({ drawing });
        },
        [onCreate]
      );

      return (
        <div className="relative h-96">
          <div className="absolute w-full h-full rounded-lg shadow-lg bg-white" />

          <ScribblesTextEditor
            ref={editorRef}
            active={editorMode === EditorMode.Text}
            onCreate={onCreateText}
            onUpdateContent={onUpdateContent}
            onDelete={onDelete}
            scribble={scribble}
          />

          <ScribblesDrawEditor
            active={editorMode === EditorMode.Draw}
            drawMode={drawMode}
            scribble={scribble}
            onCreate={onCreateDraw}
            onUpdateDrawing={onUpdateDrawing}
          />
        </div>
      );
    }
  )
);
