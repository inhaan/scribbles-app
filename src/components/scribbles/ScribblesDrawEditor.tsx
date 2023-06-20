import _ from "lodash";
import {
  memo,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  MouseEvent,
  TouchEvent,
} from "react";
import { FiLock, FiUnlock } from "react-icons/fi";
import { DrawMode, IScribble } from "../../types/scribbles";
import { useWindowSize } from "../../hooks/useWindowSize";
import { isTouchDevice } from "../../utils/device";
import { SubButton } from "../base/SubButton";
import { isMouseEvent } from "../../utils/event";
import styles from "./ScribblesDrawEditor.module.css";

interface IScribblesDrawEditorProps {
  active: boolean;
  drawMode: DrawMode;
  scribble?: IScribble;
  onCreate: (drawing: string) => void;
  onUpdateDrawing: (id: string, drawing: string) => void;
}

export const ScribblesDrawEditor = memo(
  ({
    active,
    drawMode,
    scribble,
    onCreate,
    onUpdateDrawing,
  }: IScribblesDrawEditorProps) => {
    const isEverDrawnRef = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const windowSize = useWindowSize();
    const [isLock, setIsLock] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    const canvasStyle = active ? "z-10" : "pointer-events-none";
    const cursorStyle =
      drawMode === DrawMode.Eraser ? styles.erasing : styles.drawing;
    const lockStyle = isLock ? "pointer-events-none" : "touch-none select-none";

    const loadScribble = useMemo(() => {
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
          isEverDrawnRef.current = false;
          setIsDrawing(false);
          setIsLock(false);
          return;
        }

        const image = new Image();
        image.src = scribble.drawing;
        image.onload = () => {
          context.drawImage(image, 0, 0);
        };
      }, 250);
    }, [scribble?.drawing]);

    const onToggleLock = useCallback(() => {
      setIsLock((prev) => !prev);
    }, []);

    const onStartDrawing = useCallback((e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      setIsDrawing(true);
      if (isMouseEvent(e)) {
        setLastX(e.nativeEvent.offsetX);
        setLastY(e.nativeEvent.offsetY);
      } else {
        const touch = e.touches[0];
        const canvasRect = canvas.getBoundingClientRect();
        setLastX(touch.clientX - canvasRect.x);
        setLastY(touch.clientY - canvasRect.y);
      }
    }, []);

    const onDrawing = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isDrawing) {
          return;
        }
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) {
          return;
        }

        let currentX, currentY;
        if (isMouseEvent(e)) {
          currentX = e.nativeEvent.offsetX;
          currentY = e.nativeEvent.offsetY;
        } else {
          const canvasRect = canvas.getBoundingClientRect();
          currentX = e.touches[0].clientX - canvasRect.x;
          currentY = e.touches[0].clientY - canvasRect.y;
        }

        if (drawMode === DrawMode.Eraser) {
          context.clearRect(currentX - 40, currentY - 40, 80, 80);
        } else {
          context.beginPath();
          context.moveTo(lastX, lastY);
          context.lineTo(currentX, currentY);
          context.stroke();
        }

        setLastX(currentX);
        setLastY(currentY);
        isEverDrawnRef.current = true;
      },
      [drawMode, isDrawing, lastX, lastY]
    );

    const onEndDrawing = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      setIsDrawing(false);

      //한번도 안 그려진 상황
      if (!isEverDrawnRef.current) {
        return;
      }

      if (scribble) {
        //수정
        onUpdateDrawing(scribble.id, canvas.toDataURL());
      } else {
        //신규
        onCreate(canvas.toDataURL());
      }
    }, [onCreate, onUpdateDrawing, scribble]);

    // 선굵기 설정
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        context.lineWidth = 2;
      }
    }, []);

    // 창 크기 변경시 캔버스 크기 변경
    useEffect(() => {
      const canvas = canvasRef.current;
      const parent = canvas?.parentElement;
      if (canvas && parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        loadScribble();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowSize.width, windowSize.height]);

    // 변경된 props로 캔버스 다시 그리기
    useEffect(() => {
      loadScribble();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scribble?.drawing]);

    // 활성화시 캔버스 잠금 해제
    useEffect(() => {
      if (active) {
        setIsLock(false);
      }
    }, [active]);

    return (
      <div className={`absolute w-full h-full ${canvasStyle}`}>
        {/* canvas */}
        <canvas
          ref={canvasRef}
          className={`bg-transparent ${lockStyle} ${cursorStyle}`}
          onMouseDown={onStartDrawing}
          onMouseMove={onDrawing}
          onMouseUp={onEndDrawing}
          onMouseLeave={onEndDrawing}
          onTouchStart={onStartDrawing}
          onTouchMove={onDrawing}
          onTouchEnd={onEndDrawing}
          onTouchCancel={onEndDrawing}
        ></canvas>

        {/* 잠금 버튼 */}
        {active && isTouchDevice() && (
          <SubButton
            title={isLock ? "잠금 해제" : "잠금"}
            onClick={onToggleLock}
          >
            {isLock ? <FiUnlock /> : <FiLock />}
          </SubButton>
        )}
      </div>
    );
  }
);
