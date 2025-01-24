'use client';

import Link from 'next/link';
import { FaRegStar, FaStar } from 'react-icons/fa';

import { starBoard } from '@/app/actions/notesActions';
import { UserBoard } from '@/app/types/user';

type Props = {
  board: UserBoard;
  userId: string;
};

export default function BoardTile({ board, userId }: Props) {
  const handleClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
    starBoard(userId, board.boardId, !board.starred);
  };

  return (
    <Link className='hover:cursor-pointer' href={`/board/${board.boardId}`}>
      <div className='w-[200px] h-[100px] bg-grey rounded-md p-4'>
        <div className='flex gap-2 justify-between'>
          <h2>{board.boardName}</h2>
          {board.starred && (
            <FaStar
              className='relative -top-2-right-2 w-6 h-6 p-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-white rounded-full'
              onClick={handleClick}
            />
          )}
          {!board.starred && (
            <FaRegStar
              className='relative -top-2-right-2 w-6 h-6 p-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-white hover:text-black rounded-full'
              onClick={handleClick}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
