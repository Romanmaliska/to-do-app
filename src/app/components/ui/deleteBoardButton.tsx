import { PopoverClose } from '@radix-ui/react-popover';
import { FaEllipsis } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

import { deleteBoard } from '@/app/actions/actions';
import { Button } from '@/app/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { UserBoard } from '@/app/types/user';

type Props = {
  userId: string;
  board: UserBoard;
  boards?: UserBoard[];
};

export default function DeleteBoardButton({ userId, board, boards }: Props) {
  const nextBoardId =
    !boards || boards.length < 2
      ? null
      : boards.find((b) => b.boardId !== board.boardId)?.boardId || null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FaEllipsis className='hover:text-darkGrey' size={18} />
      </PopoverTrigger>
      <PopoverContent
        className='bg-white text-black w-40'
        align='start'
        sideOffset={+8}
      >
        <div className='grid gap-4'>
          <div className='flex justify-between items-center font-medium'>
            <h4>Board: {board.boardName}</h4>
            <PopoverClose
              className='p-[2px] cursor-pointer rounded-sm hover:bg-grey'
              asChild
            >
              <IoClose size={24} />
            </PopoverClose>
          </div>
          <PopoverClose asChild>
            <form
              action={deleteBoard.bind(
                null,
                userId,
                board.boardId,
                nextBoardId,
              )}
            >
              <Button variant='destructive'>Delete Board</Button>
            </form>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
