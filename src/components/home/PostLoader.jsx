export default function PostLoader() {
  return (
    <div className="w-full py-4">
      <div className="border border-[#282828] shadow rounded-md p-4 w-full mx-auto">
        <div className="flex space-x-4 animate-pulse">
          <div className="rounded-full bg-[#282828] h-10 w-10"></div>
          <div className="flex-1 py-1 space-y-6">
            <div className="h-2 bg-[#282828] rounded"></div>{" "}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-[#282828] rounded col-span-2"></div>
                <div className="h-2 bg-[#282828] rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-[#282828] rounded"></div>
              <div className="h-2 bg-[#282828] rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-[#282828] rounded col-span-2"></div>
                <div className="h-2 bg-[#282828] rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-[#282828] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
