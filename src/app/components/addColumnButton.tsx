import { useParams } from 'next/navigation';
import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { handleAddColumn } from '../lib/handlers';
import { UserColumn } from '../types/user';
import { Button } from './ui/button';
import CloseButton from './ui/closeButton';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[] | null;
  userId: string;
  setOptimisticColumns: (columns: UserColumn[] | null) => void;
};

export default function AddColumnButton({
  columns,
  userId,
  setOptimisticColumns,
}: Props) {
  const [isAddColumnClicked, setIsAddColumnClicked] = useState(false);
  const { boardId } = useParams<{ boardId: string }>();

  const handleAddColumnTitle = async (formData: FormData) => {
    setIsAddColumnClicked(false);

    const columnTitle = formData.get('columnTitle') as string;
    await handleAddColumn({
      setOptimisticColumns,
      columns,
      columnTitle,
      userId,
      boardId,
    });
  };

  return (
    <div className='w-52'>
      {isAddColumnClicked ? (
        <form className='bg-grey p-2 rounded-xl' action={handleAddColumnTitle}>
          <Input
            className='mb-2 border-0 rounded-md focus-visible:ring-blue'
            type='text'
            minLength={1}
            name='columnTitle'
            autoFocus
            required
          ></Input>
          <div className='flex justify-between items-center gap-2'>
            <Button className='bg-blue hover:bg-lighterBlue'>Add column</Button>
            <CloseButton handleClick={setIsAddColumnClicked} />
          </div>
        </form>
      ) : (
        <Button
          className='flex justify-start gap-2 p-2 w-52 border-0 rounded-xl bg-lightBlue text-white cursor-pointer hover:text-white hover:bg-lighterBlue'
          variant='outline'
          onClick={() => setIsAddColumnClicked(true)}
        >
          <BsPlus size={18} />
          Add new column
        </Button>
      )}
    </div>
  );
}
