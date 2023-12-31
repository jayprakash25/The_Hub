import { GiNothingToSay } from "react-icons/gi";

export default function Empty() {
  return (
    <div className="flex flex-col items-center space-y-3 text-center mt-36">
      <GiNothingToSay size={90} color="#282828" />
      <h1 className="text-sm font-semibold ">No Posts Connect to See</h1>
    </div>
  );
}
