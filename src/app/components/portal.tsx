import { DragOverlay } from '@dnd-kit/core';
import { createPortal } from 'react-dom';

import { UserColumn, UserNote } from '../types/user';
import NotesColumnSkeleton from './notesColumnSkeleton';
import NoteSkeleton from './noteSkeleton';

type Props = {
  draggedColumn: UserColumn | null;
  draggedNote: UserNote | null;
};

export default function Portal({ draggedColumn, draggedNote }: Props) {
  return (
    <>
      {createPortal(
        <DragOverlay>
          {draggedColumn && (
            <NotesColumnSkeleton draggedColumn={draggedColumn} />
          )}
          {draggedNote && <NoteSkeleton draggedNote={draggedNote} />}
        </DragOverlay>,
        document.body,
      )}
    </>
  );
}
