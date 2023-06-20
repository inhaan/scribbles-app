import { memo, useCallback } from "react";
import { IoAdd } from "react-icons/io5";
import { FaPaintBrush } from "react-icons/fa";
import { BiText } from "react-icons/bi";
import { BsFillEraserFill } from "react-icons/bs";
import { DrawMode, EditorMode } from "../../types/scribbles";
import { ToolButton } from "../base/ToolButton";

interface IAppHeaderProps {
  editorMode: EditorMode;
  drawMode: DrawMode;
  onAdd: () => void;
  onChangeEditorMode: (mode: EditorMode) => void;
  onChangeDrawMode: (mode: DrawMode) => void;
}

export const AppHeader = memo(
  ({
    editorMode,
    drawMode,
    onAdd,
    onChangeEditorMode,
    onChangeDrawMode,
  }: IAppHeaderProps) => {
    const onClickText = useCallback(() => {
      onChangeEditorMode(EditorMode.Text);
    }, [onChangeEditorMode]);

    const onClickDraw = useCallback(() => {
      onChangeEditorMode(EditorMode.Draw);
    }, [onChangeEditorMode]);

    const onClickEraser = useCallback(() => {
      onChangeDrawMode(DrawMode.Eraser);
    }, [onChangeDrawMode]);

    const onClickPen = useCallback(() => {
      onChangeDrawMode(DrawMode.Pen);
    }, [onChangeDrawMode]);

    return (
      <header className="pb-1 relative flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">낙서장</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-3">
            무엇을 끄적여도 좋습니다.
            <br />
            낙서는 기기에 저장됩니다.
          </p>
        </div>
        <div className="absolute flex gap-3 bottom-0 right-0 pr-3">
          {editorMode === EditorMode.Draw && drawMode === DrawMode.Pen && (
            <ToolButton title="지우기" bg="sky" onClick={onClickEraser}>
              <BsFillEraserFill />
            </ToolButton>
          )}
          {editorMode === EditorMode.Draw && drawMode === DrawMode.Eraser && (
            <ToolButton title="펜" bg="sky" onClick={onClickPen}>
              <FaPaintBrush />
            </ToolButton>
          )}
          {editorMode === EditorMode.Draw && (
            <ToolButton title="글쓰기" bg="sky" onClick={onClickText}>
              <BiText />
            </ToolButton>
          )}
          {editorMode === EditorMode.Text && (
            <ToolButton title="그리기" bg="sky" onClick={onClickDraw}>
              <FaPaintBrush />
            </ToolButton>
          )}
          <ToolButton title="새 낙서" bg="lime" onClick={onAdd}>
            <IoAdd />
          </ToolButton>
        </div>
      </header>
    );
  }
);
