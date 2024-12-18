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
        <Input autoFocus type='text' name='columnTitle'></Input>
      </form>
    </div>
  ) : (
    <Button variant='outline' onClick={() => setIsAddColumnClicked(true)}>
      Add new column
    </Button>
  );
}
