'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { UserBoard } from '@/app/types/user';

type Props = {
  userBoards: UserBoard[] | null;
  boardId: UserBoard['boardId'];
};

export default function Sidebar({ userBoards, boardId }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`flex flex-col bg-gray-900 text-white mr-2 ${isExpanded ? 'w-52' : 'w-8'}`}
    >
      <section className='flex justify-between place-content-start pb-4'>
        <h2 className={`text-xl font-semibold ${!isExpanded && 'hidden'}`}>
          Workspace
        </h2>
        {isExpanded && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <MdOutlineKeyboardArrowLeft
                  className='rounded-full bg-darkBlue hover:bg-darkerBlue'
                  onClick={() => setIsExpanded(!isExpanded)}
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
        {!isExpanded && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <MdOutlineKeyboardArrowRight
                  className='rounded-full bg-darkBlue hover:bg-darkerBlue'
                  onClick={() => setIsExpanded(!isExpanded)}
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
      <section className={`flex flex-col gap-2 ${!isExpanded && 'hidden'}`}>
        <h2 className='font-bold text-md'>Your boards</h2>
        {userBoards?.map((board) => (
          <Link
            className={`flex justify-between place-items-center p-1 rounded-sm cursor-pointer hover:bg-darkBlue
            ${board.boardId === boardId && 'bg-lightBlue pointer-events-none'}`}
            key={board.boardId}
            href={`/board/${board.boardId}`}
          >
            <p>{board.boardName}</p>
            {board.starred && <FaStar />}
          </Link>
        ))}
      </section>
    </div>
  );
}
