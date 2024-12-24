import { UserColumn } from "../types/note";

type Props = {
  draggedColumn: UserColumn | null;
};

export default function NotesColumnSkeleton({ draggedColumn }: Props) {
  return <div className='flex flex-col w-52 h-16 rounded-xl bg-grey p-2'></div>;
}
