import { useState } from 'react';

import { handleAddColumn } from '../lib/hooks';
import { UserColumn } from '../types/note';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[];
  setOptimisticColumns: (columns: UserColumn[]) => void;
};

export default function NewColumnButton({
  columns,
  setOptimisticColumns,
}: Props) {
  const [isAddColumnClicked, setIsAddColumnClicked] = useState(false);

  const handleAddColumnTitle = (formData: FormData) => {
    const columnTitle = formData.get('columnTitle') as string;
    handleAddColumn(setOptimisticColumns, columns, columnTitle);
    setIsAddColumnClicked(false);
  };

  return isAddColumnClicked ? (
    <div>
      <form action={handleAddColumnTitle}>
        <Input autoFocus type='text' minLength={1} name='columnTitle'></Input>
        <Button>Add Column</Button>
        <Button
          onClick={(e) => {
            e.preventDefault(), setIsAddColumnClicked(false);
          }}
        >
          x
        </Button>
      </form>
    </div>
  ) : (
    <Button variant='outline' onClick={() => setIsAddColumnClicked(true)}>
      Add new column
    </Button>
  );
}
