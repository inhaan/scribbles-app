import _ from "lodash";
import dayjs from "dayjs";
import { memo, MouseEvent, useMemo, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IScribble, IViewModel } from "../../types/scribbles";
import { useCallback, useRef, useState } from "react";
import { SubButton } from "../base/SubButton";

interface IScribbleCardProps {
  scribble: IScribble;
  viewModel?: IViewModel;
  onEdit: (scribble: IScribble) => void;
  onDelete: (id: string) => void;
}

export const ScribbleCard = memo(
  ({ scribble, viewModel, onDelete, onEdit }: IScribbleCardProps) => {
    const [isShowDelete, setIsShowDelete] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const longPressTime = 700;
    const longPressTimer = useRef<number | null>();
    const toCreateStyle = useMemo(
      () =>
        viewModel?.toCreate
          ? "opacity-0 w-0 sm:w-0 px-0"
          : "w-full sm:w-52 px-5",
      [viewModel?.toCreate]
    );
    const toDeleteStyle = useMemo(
      () => (viewModel?.toDelete ? "opacity-0" : ""),
      [viewModel?.toDelete]
    );
    const dateTimeString = useMemo(
      () => dayjs(scribble.timestamp).format("YY.MM.DD HH:mm:ss"),
      [scribble.timestamp]
    );

    const clearLongPressTimer = useCallback(() => {
      if (longPressTimer.current !== null) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }, []);

    const onClickDelete = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("낙서를 삭제하시겠습니까?")) {
          onDelete(scribble.id);
        }
      },
      [scribble.id, onDelete]
    );

    const onClick = useCallback(() => {
      onEdit(scribble);
    }, [onEdit, scribble]);

    const onMouseEnter = useCallback(() => {
      setIsShowDelete(true);
    }, []);

    const onMouseLeave = useCallback(() => {
      setIsShowDelete(false);
    }, []);

    const onDeleteButtonPointerDown = useCallback((e: MouseEvent) => {
      e.stopPropagation();
    }, []);

    const onTouchStart = useCallback(() => {
      longPressTimer.current = +setTimeout(() => {
        clearLongPressTimer();
        if (window.confirm("낙서를 삭제하시겠습니까?")) {
          onDelete(scribble.id);
        }
      }, longPressTime);
    }, [scribble.id, onDelete, clearLongPressTimer]);

    const onTouchEnd = useCallback(() => {
      clearLongPressTimer();
    }, [clearLongPressTimer]);

    const loadDrawing = useMemo(() => {
      return _.throttle(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) {
          return;
        }
        if (canvas.toDataURL() === scribble?.drawing) {
          return;
        }

        //초기화
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (!scribble?.drawing) {
          return;
        }

        const image = new Image();
        image.src = scribble.drawing;
        image.onload = () => {
          // Canvas 크기 설정
          const canvasWidth = canvas.clientWidth;
          const canvasHeight = canvas.clientHeight;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        };
      }, 250);
    }, [scribble?.drawing]);

    // canvas 로딩
    useEffect(() => {
      loadDrawing();
    }, [scribble?.drawing, loadDrawing]);

    return (
      <li
        key={scribble.id}
        className={`relative select-none bg-white h-20 sm:h-52 py-5 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-2 active:bg-gray-100 ${toDeleteStyle} ${toCreateStyle}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* text */}
        <div className="leading-7 text-lg font-bold break-words h-full overflow-hidden text-ellipsis whitespace-nowrap sm:whitespace-pre-line">
          <span className="align-middle sm:align-top">{scribble.content}</span>
        </div>

        {/* drawing */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        ></canvas>

        {/* 수정 날짜시간 */}
        <div className="absolute bottom-0 right-0 mb-3 mr-3 text-sm text-gray-500">
          {dateTimeString}
        </div>

        {/* 삭제 버튼 */}
        {isShowDelete && (
          <SubButton
            title="삭제"
            onClick={onClickDelete}
            onPointerDown={onDeleteButtonPointerDown}
          >
            <AiOutlineDelete />
          </SubButton>
        )}
      </li>
    );
  }
);
