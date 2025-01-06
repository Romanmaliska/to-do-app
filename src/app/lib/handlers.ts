import {
  addNewColumn,
  deleteColumn,
  updateColumns,
} from '../actions/notesActions';
import { UserColumn } from '../types/user';
import { generateId } from './utils';

export async function handleAddColumn({
  setOptimisticColumns,
  columns,
  columnTitle,
  userId,
  boardId,
}: {
  setOptimisticColumns: (columns: UserColumn[] | null) => void;
  columns: UserColumn[] | null;
  columnTitle: string;
  userId: string;
  boardId: string;
}) {
  const newColumn = {
    columnTitle,
    columnId: generateId(),
    notes: [],
  };

  setOptimisticColumns([...(columns || []), newColumn]);

  try {
    await addNewColumn(userId, boardId, newColumn);
  } catch {
    setOptimisticColumns(columns);
  }
}

export async function handleDeleteColumn(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columnId: string,
  columns: UserColumn[],
  userId: string,
  boardId: string,
) {
  const newColumns = columns.filter((col) => col.columnId !== columnId);

  try {
    setOptimisticColumns(newColumns);
    await deleteColumn(userId, boardId, columnId);
  } catch {
    setOptimisticColumns(columns);
  }
}

export async function handleAddNote({
  setOptimisticColumns,
  columns,
  columnId,
  noteText,
  userId,
  boardId,
}: {
  setOptimisticColumns: (columns: UserColumn[]) => void;
  columns: UserColumn[];
  columnId: string;
  noteText: string;
  userId: string;
  boardId: string;
}) {
  const newNote = {
    noteText,
    noteId: generateId(),
  };

  const newColumns = columns.map((col) => {
    if (col.columnId !== columnId) return col;
    return { ...col, notes: [...col.notes, newNote] };
  });

  try {
    setOptimisticColumns(newColumns);
    await updateColumns(userId, boardId, newColumns);
  } catch {
    setOptimisticColumns(columns);
  }
}
