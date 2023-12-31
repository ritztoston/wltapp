export const ClassroomsSkeleton = () => {
    return (
        <>
            {[...Array(4)].map((_, index) => (
                <div key={index} className="relative animate-pulse">
                    <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg border-2 border-dashed border-main-blue focus:outline-none focus:ring-0 select-none bg-main-blue bg-opacity-5" />
                    <p className="mt-4">;</p>
                </div>
            ))}
        </>
    );
};
