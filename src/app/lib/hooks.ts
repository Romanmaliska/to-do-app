import {
  addNewColumn,
  addNewNote,
  deleteColumn,
  deleteNote,
} from '../actions/notesActions';
import { UserColumn } from '../types/note';
import { generateId } from './utils';

export async function handleAddColumn(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columns: UserColumn[],
  columnTitle: string,
) {
  const newColumn = {
    columnTitle,
    columnIndex: Date.now(),
    columnId: generateId(),
    notes: [],
  };

  try {
    setOptimisticColumns([...columns, newColumn]);
    await addNewColumn(newColumn);
  } catch {
    setOptimisticColumns(columns);
  }
}

export async function handleDeleteColumn(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columnId: string,
  columns: UserColumn[],
) {
  const newColumns = columns.filter((column) => column.columnId !== columnId);
  try {
    setOptimisticColumns(newColumns);
    await deleteColumn(columnId);
  } catch {
    setOptimisticColumns(columns);
  }
}

export async function handleAddNote(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columnId: string,
  columns: UserColumn[],
) {
  const newNote = {
    noteText: generateId().toString(),
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
