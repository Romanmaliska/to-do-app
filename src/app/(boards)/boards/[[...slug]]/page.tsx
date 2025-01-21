import { PopoverClose } from '@radix-ui/react-popover';
import Link from 'next/link';
import { BsPlus } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';

import {
  createNewBoard,
  createNewUser,
  getBoards,
  testDatabaseConnection,
} from '@/app/actions/notesActions';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import type { UserBoard } from '@/app/types/user';

export default async function BoardsPage() {}
