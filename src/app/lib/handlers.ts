import {
  addNewColumn,
  addNewNote,
  deleteColumn,
} from '../actions/notesActions';
import { UserColumn } from '../types/note';
import { generateId } from './utils';

export async function handleAddColumn({
  setOptimisticColumns,
  columns,
  columnTitle,
  userId,
}: {
  setOptimisticColumns: (columns: UserColumn[] | null) => void;
  columns: UserColumn[] | null;
  columnTitle: string;
  userId: string;
}) {
  const newColumn = {
    columnTitle,
    columnIndex: columns?.length || 0,
    columnId: generateId(),
    notes: [],
  };

  setOptimisticColumns([...(columns || []), newColumn]);

  try {
    await addNewColumn(userId, newColumn);
  } catch {
    setOptimisticColumns(columns);
  }
}

export async function handleDeleteColumn(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columnId: string,
  columns: UserColumn[],
  userId: string,
) {
  const newColumns = columns.reduce<UserColumn[]>((acc, curr) => {
    if (curr.columnId === columnId) return acc;
    return [...acc, { ...curr, columnIndex: acc.length }];
  }, []);

  setOptimisticColumns(newColumns);

  try {
    await deleteColumn(userId, newColumns);
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
}: {
  setOptimisticColumns: (columns: UserColumn[]) => void;
  columns: UserColumn[];
  columnId: string;
  noteText: string;
  userId: string;
}) {
  const newNote = {
    noteText,
    noteId: generateId(),
    noteIndex:
      columns.find((col) => col.columnId === columnId)?.notes.length || 0,
  };

  const newColumns = columns.map((col) => {
    if (col.columnId !== columnId) return col;

    return { ...col, notes: [...col.notes, newNote] };
  });

  try {
    setOptimisticColumns(newColumns);
    await addNewNote(userId, newColumns);
  } catch {
    setOptimisticColumns(columns);
  }
}
