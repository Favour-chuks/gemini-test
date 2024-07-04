interface colorProps {
  color: string;
}
export default function ColorCircle({ color }: colorProps) {
  return (
    <>
      <div className="flex justify-between my-10">
        <p>{color}</p>
        <div
          className="w-[50px] h-[50px] rounded-full"
          style={{ backgroundColor: `${color}` }}></div>
      </div>
    </>
  );
}
