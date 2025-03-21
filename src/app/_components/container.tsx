type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className='container mx-auto md:max-w-3xl px-5'>{children}</div>;
};

export default Container;
