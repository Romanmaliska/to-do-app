type Props = {
  noteText: string;
};

export default function NoteSkeleton({ draggedNote }: Props) {
  return (
    <p className='h-9 m-1 px-4 py-2 bg-white border-0 rounded-md'>
      {draggedNote.noteText}
    </p>
  );
}
