import { useParams } from 'next/navigation';
import { FocusEvent, useState, useTransition } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { updateColumnTitle } from '../actions/notesActions';
import { handleDeleteColumn } from '../lib/handlers';
import { UserColumn } from '../types/user';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {
  setOptimisticColumns: (columns: UserColumn[]) => void;
  columns: UserColumn[];
  column: UserColumn;
  userId: string;
};

export default function NotesColumnHeader({
  setOptimisticColumns,
  columns,
  column,
  userId,
}: Props) {
  const [_, startTransition] = useTransition();
  const [isColumnTitleUpdated, setIsColumnTitleUpdated] = useState(false);
  const { boardId } = useParams<{ boardId: string }>();

  const handleUpdateColumnTitle = async (columnTitle: string) => {
    setIsColumnTitleUpdated(!isColumnTitleUpdated);

    if (!columnTitle || columnTitle === column.columnTitle) return;

    const newColumns = columns.map((col) => {
      if (col.columnId !== column.columnId) return col;
      return { ...col, columnTitle };
    });

    setOptimisticColumns(newColumns);
    await updateColumnTitle({
      userId,
      boardId,
      columnId: column.columnId,
      columnTitle,
    });
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    startTransition(async () => {
      await handleUpdateColumnTitle(event.target.value);
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const columnTitle = formData.get('columnTitle') as string;
    await handleUpdateColumnTitle(columnTitle);
  };

  return (
    <div className='flex justify-between items-center gap-2 p-2 mb-2 h-9'>
      {isColumnTitleUpdated ? (
        <form action={handleSubmit}>
          <Input
            className='min-w-32 text-base p-2 border-0 rounded-md focus-visible:ring-blue'
            onBlur={handleBlur}
            type='text'
            defaultValue={column.columnTitle}
            minLength={1}
            name='columnTitle'
            autoFocus
            autoComplete='off'
            required
          />
        </form>
      ) : (
        <h1
          className='p-2 min-w-32 rounded-md'
          onClick={() => setIsColumnTitleUpdated(!isColumnTitleUpdated)}
        >
          {column.columnTitle}
        </h1>
      )}

      <form
        action={handleDeleteColumn.bind(
          null,
          setOptimisticColumns,
          column.columnId,
          columns,
          userId,
          boardId,
        )}
      >
        <Button className='hover:bg-darkGrey' variant='ghost'>
          <FaRegTrashAlt size={12} />
        </Button>
      </form>
    </div>
  );
}
