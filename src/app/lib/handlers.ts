import {
  addNewColumn,
  addNewNote,
  deleteColumn,
  deleteNote,
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
    await addNewColumn(newColumn, userId);
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
  const newColumns = columns.filter((column) => column.columnId !== columnId);
  setOptimisticColumns(newColumns);

  try {
    await deleteColumn(userId, newColumns);
  } catch {
    setOptimisticColumns(columns);
  }
}

export async function handleAddNote(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columns: UserColumn[],
  columnId: string,
  noteText: string,
) {
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
    await addNewNote(columnId, newNote);
  } catch {
    setOptimisticColumns(columns);
  }
}

export async function handleDeleteNote(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columnId: string,
  columns: UserColumn[],
  noteId: string,
) {
  const newColumns = columns.map((col) => {
    if (col.columnId !== columnId) return col;

    const newNotes = col.notes.filter((note) => note.noteId !== noteId);

    return { ...col, notes: newNotes };
  });

  setOptimisticColumns(newColumns);
  deleteNote(columnId, noteId);
}
