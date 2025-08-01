import { cn } from "@codescape-financial/core-ui";

/**
 * This simple spinner was inspired by the much more involved example from Kyle Cook (aka Web Dev Simplified).
 *
 * See his video on YouTube: https://www.youtube.com/watch?v=Gx35fMhDPWs
 */
export const Spinner = () => {
  const sectorClasses =
    "absolute w-full h-full rounded-full border-[20px] border-transparent animate-[spin_4s_ease-in-out_infinite]";

  return (
    <div className="relative w-64 h-64 flex justify-center items-center text-3xl overflow-hidden">
      <span className="animate-pulse">LOADING</span>
      <div className={cn(sectorClasses, "border-t-red-100")}></div>
      <div className={cn(sectorClasses, "border-r-green-100")}></div>
      <div className={cn(sectorClasses, "border-b-blue-100")}></div>
      <div className={cn(sectorClasses, "border-l-yellow-100")}></div>
    </div>
  );
};
