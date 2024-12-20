import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

import { handleAddColumn } from '../lib/hooks';
import { UserColumn } from '../types/note';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[];
  setOptimisticColumns: (columns: UserColumn[]) => void;
};

export default function AddColumnButton({
  columns,
  setOptimisticColumns,
}: Props) {
  const [isAddColumnClicked, setIsAddColumnClicked] = useState(false);

  const handleAddColumnTitle = (formData: FormData) => {
    const columnTitle = formData.get('columnTitle') as string;
    handleAddColumn(setOptimisticColumns, columns, columnTitle);
    setIsAddColumnClicked(false);
  };

  return (
    <div className='w-52'>
      {isAddColumnClicked ? (
        <form className='bg-grey p-2 rounded-xl' action={handleAddColumnTitle}>
          <Input
            className='mb-2 border-0 rounded-md focus-visible:ring-blue'
            autoFocus
            required
            type='text'
            minLength={1}
            name='columnTitle'
          ></Input>
          <div className='flex justify-between items-center gap-2'>
            <Button className='bg-blue hover:bg-lighterBlue'>Add column</Button>
            <IoClose
              className=' cursor-pointer'
              size={24}
              onClick={(e) => {
                e.preventDefault();
                setIsAddColumnClicked(false);
              }}
            />
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
