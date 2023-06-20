import { memo, useCallback } from "react";
import { IScribble, IViewModel } from "../../types/scribbles";
import { ScribbleCard } from "./ScribbleCard";

interface IScribblesListProps {
  scribbles: IScribble[];
  viewModels: IViewModel[];
  onEdit: (scribble: IScribble) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const ScribblesList = memo(
  ({
    scribbles,
    viewModels,
    onEdit,
    onDelete,
    onClear,
  }: IScribblesListProps) => {
    const onClickClear = useCallback(() => {
      if (window.confirm("전체 낙서를 삭제하시겠습니까?")) {
        onClear();
      }
    }, [onClear]);

    return (
      <>
        {/* 낙서 목록 헤더 */}
        {scribbles.length > 0 && (
          <>
            <div className="text-right mt-10 text-sm mb-1">
              <span className="mr-3">총 {scribbles.length} 낙서</span>
              <button
                className="text-lime-700 hover:underline"
                onClick={onClickClear}
              >
                전체삭제
              </button>
            </div>
            <hr className="mb-3 sm:mb-10" />
          </>
        )}

        {/* 낙서 목록 */}
        <ul className="flex flex-wrap flex-col sm:flex-row gap-5 sm:gap-10 justify-start">
          {scribbles.map((scribble) => (
            <ScribbleCard
              key={scribble.id}
              scribble={scribble}
              viewModel={viewModels.find((vm) => vm.id === scribble.id)}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
        {scribbles.length > 0 && <div className="mb-20" />}
      </>
    );
  }
);
