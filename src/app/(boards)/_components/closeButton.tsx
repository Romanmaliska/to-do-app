import { IoClose } from 'react-icons/io5';

type Props = {
  handleClick: (value: boolean) => void;
};

export default function CloseButton({ handleClick }: Props) {
  return (
    <IoClose
      className='cursor-pointer'
      size={24}
      onClick={(e) => {
        e.preventDefault();
        handleClick(false);
      }}
    />
  );
}
