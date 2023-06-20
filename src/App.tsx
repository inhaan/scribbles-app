import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { AppContainer } from "./components/layout/AppContainer";
import { AppContents } from "./components/layout/AppContents";
import { AppFooter } from "./components/layout/AppFooter";
import { AppHeader } from "./components/layout/AppHeader";
import { AppMain } from "./components/layout/AppMain";
import {
  IScribblesEditorHandle,
  ScribblesEditor,
} from "./components/scribbles/ScribblesEditor";
import { ScribblesList } from "./components/scribbles/ScribblesList";
import { useScribbles } from "./hooks/useScribbles";
import { DrawMode, EditorMode, IScribble } from "./types/scribbles";
import { waitAsync } from "./utils/timer";
import { flushSync } from "react-dom";

export const App = () => {
  const { scribbles, viewModels, dispatch, createScribble, initScribbles } =
    useScribbles();
  const editorHandleRef = useRef<IScribblesEditorHandle | null>(null);
  const [editingScribbleId, setEditingScribbleId] = useState<string>();
  const editingScribble = useMemo(
    () => scribbles.find((scribble) => scribble.id === editingScribbleId),
    [scribbles, editingScribbleId]
  );
  const [editorMode, setEditorMode] = useState(EditorMode.Text);
  const [drawMode, setDrawMode] = useState(DrawMode.Pen);

  const onChangeEditorMode = useCallback(
    (mode: EditorMode) => {
      flushSync(() => {
        setEditorMode(mode);
      });
      if (mode === EditorMode.Text) {
        editorHandleRef.current?.focus();
      }
    },
    [setEditorMode]
  );

  const onChangeDrawMode = useCallback(
    (mode: DrawMode) => {
      setDrawMode(mode);
    },
    [setDrawMode]
  );

  const onAdd = useCallback(() => {
    setEditingScribbleId(undefined);
    if (editorMode === EditorMode.Draw) {
      setDrawMode(DrawMode.Pen);
    } else {
      editorHandleRef.current?.focus();
    }
  }, [editorMode]);

  const onCreate = useCallback(
    async (option?: { content?: string; drawing?: string }) => {
      const scribble = createScribble(option?.content, option?.drawing);
      dispatch({ type: "ADD", payload: scribble });
      setEditingScribbleId(scribble.id);
      await waitAsync(0);
      dispatch({ type: "CREATED", payload: { id: scribble.id } });
    },
    [createScribble, dispatch]
  );

  const onUpdateContent = useCallback(
    (id: string, content: string) => {
      dispatch({ type: "UPDATE_CONTENT", payload: { id, content } });
    },
    [dispatch]
  );

  const onUpdateDrawing = useCallback(
    (id: string, drawing: string) => {
      dispatch({ type: "UPDATE_DRAWING", payload: { id, drawing } });
    },
    [dispatch]
  );

  const onEdit = useCallback((scribble: IScribble) => {
    setEditingScribbleId(scribble.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (scribble.drawing) {
      setEditorMode(EditorMode.Draw);
    } else {
      flushSync(() => {
        setEditorMode(EditorMode.Text);
      });
      editorHandleRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const onDelete = useCallback(
    async (id: string) => {
      dispatch({ type: "TO_DELETE", payload: { id } });
      await waitAsync(250);
      dispatch({ type: "DELETE", payload: { id } });
    },
    [dispatch]
  );

  const onClear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, [dispatch]);

  // 초기화
  useEffect(() => {
    initScribbles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContainer>
      {/* header */}
      <AppHeader
        editorMode={editorMode}
        drawMode={drawMode}
        onAdd={onAdd}
        onChangeEditorMode={onChangeEditorMode}
        onChangeDrawMode={onChangeDrawMode}
      />

      {/* contents */}
      <AppContents>
        {/* editor */}
        <AppMain>
          <ScribblesEditor
            ref={editorHandleRef}
            editorMode={editorMode}
            drawMode={drawMode}
            scribble={editingScribble}
            onCreate={onCreate}
            onUpdateContent={onUpdateContent}
            onUpdateDrawing={onUpdateDrawing}
            onDelete={onDelete}
          />
        </AppMain>

        {/* list */}
        <section className="sm:mt-12">
          <ScribblesList
            scribbles={scribbles}
            viewModels={viewModels}
            onEdit={onEdit}
            onDelete={onDelete}
            onClear={onClear}
          />
        </section>
      </AppContents>

      {/* footer */}
      <AppFooter />
    </AppContainer>
  );
};
