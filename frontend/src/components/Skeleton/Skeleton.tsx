export const Skeleton = () => {
  return (
    <div className="w-full h-full inline-block relative overflow-hidden bg-[#ddd] after:absolute after:inset-0 after:-translate-x-full after:content-[''] after:bg-[linear-gradient(to_right,_transparent,_#ffffff33_20%,_#ffffff80_60%,_transparent)] after:animate-[skeleton_2s_infinite] rounded" />
  );
};
