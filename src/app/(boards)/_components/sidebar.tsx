'use client';

import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';

import DeleteBoardButton from '@/app/components/ui/deleteBoardButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { useStore } from '@/app/store/store';
import { UserBoard } from '@/app/types/user';

type Props = {
  userId: string;
  userBoards: UserBoard[] | null;
  boardId: UserBoard['boardId'];
};

export default function Sidebar({ userId, userBoards, boardId }: Props) {
  const { isSidebarExpanded, toggleSidebarExpansion } = useStore();

  return (
    <div
      className={`flex flex-col bg-gray-900 text-white mr-2 ${isSidebarExpanded ? 'w-52' : 'w-8'}`}
    >
      <section className='flex justify-between place-content-start pb-4'>
        <h2
          className={`text-xl font-semibold ${!isSidebarExpanded && 'hidden'}`}
        >
          Workspace
        </h2>
        {isSidebarExpanded && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <MdOutlineKeyboardArrowLeft
                  className='rounded-full bg-darkBlue hover:bg-darkerBlue'
                  onClick={toggleSidebarExpansion}
                  size={32}
                />
                <TooltipContent
                  className='bg-darkGrey text-black'
                  side='top'
                  align='end'
                  alignOffset={12}
                  sideOffset={4}
                >
                  Collapse Sidebar
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        )}
        {!isSidebarExpanded && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <MdOutlineKeyboardArrowRight
                  className='rounded-full bg-darkBlue hover:bg-darkerBlue'
                  onClick={toggleSidebarExpansion}
                  size={32}
                />
                <TooltipContent
                  className='bg-darkGrey text-black'
                  side='top'
                  align='start'
                  alignOffset={12}
                  sideOffset={4}
                >
                  Expand Sidebar
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        )}
      </section>
      <section
        className={`flex flex-col gap-2 ${!isSidebarExpanded && 'hidden'}`}
      >
        <h2 className='font-bold text-md'>Your boards</h2>

        {userBoards?.map((board) => (
          <div
            key={board.boardId}
            className={`flex justify-between place-items-center  px-1 rounded-sm cursor-pointer hover:bg-darkBlue  
              ${board.boardId === boardId && 'bg-lightBlue'}`}
          >
            <Link
              className={`w-full p-1 ${board.boardId === boardId && 'pointer-events-none'}`}
              href={`/board/${board.boardId}`}
            >
              {board.boardName}
            </Link>
            <div className={`flex justify-between place-items-center gap-2`}>
              <DeleteBoardButton
                userId={userId}
                boards={userBoards}
                board={board}
              />
              {board.starred && <FaStar />}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
