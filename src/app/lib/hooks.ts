import { addNewColumn, deleteColumn } from '../actions/notesActions';
import { UserColumn } from '../types/note';
import { generateId } from './utils';

export async function handleAddColumn(
  setOptimisticColumns: (columns: UserColumn[]) => void,
  columns: UserColumn[],
) {
  const newColumn = {
    columnTitle: 'New Column ' + columns.length,
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
