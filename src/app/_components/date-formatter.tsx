import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString);
  return (
    <span className='inline-flex items-center gap-2'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        className='h-5 w-5'
        aria-hidden='true'
      >
        <rect x='3' y='4.5' width='18' height='16.5' rx='2' />
        <path d='M8 3v3M16 3v3M3 9.5h18' />
      </svg>
      <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>
    </span>
  );
};

export default DateFormatter;
