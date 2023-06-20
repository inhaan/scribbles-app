import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { IScribble } from "../../types/scribbles";

interface IScribblesTextEditorProps {
  active: boolean;
  scribble?: IScribble;
  onCreate: (contents: string) => void;
  onUpdateContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const ScribblesTextEditor = memo(
  forwardRef<HTMLTextAreaElement, IScribblesTextEditorProps>(
    ({ active, scribble, onCreate, onUpdateContent, onDelete }, editorRef) => {
      // 삭제시 content를 바로 없애기 위해 state를 따로 관리 (store에서는 애니메이션을 위해 늦게 삭제됨)
      const orgContent = scribble?.content ?? "";
      const [content, setContent] = useState(orgContent);

      const textStyle = useMemo(() => (active ? "z-10" : ""), [active]);

      const onChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const { value } = e.target;
          setContent(value);
          if (!value && !scribble?.drawing) {
            //삭제
            scribble && onDelete(scribble.id);
          } else if (scribble) {
            //수정
            onUpdateContent(scribble.id, value);
          } else {
            //신규
            onCreate(value);
          }
        },
        [scribble, onCreate, onUpdateContent, onDelete]
      );

      useEffect(() => {
        setContent(orgContent);
      }, [orgContent]);

      return (
        <textarea
          ref={editorRef}
          className={`absolute w-full resize-none outline-none h-full p-5 rounded-lg bg-transparent ${textStyle}`}
          autoFocus
          placeholder={active ? "낙서를 입력하세요." : ""}
          value={content}
          onChange={onChange}
          disabled={active ? false : true}
        ></textarea>
      );
    }
  )
);
