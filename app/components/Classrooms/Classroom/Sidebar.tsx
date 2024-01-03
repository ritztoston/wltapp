import { UserCard } from "~/components/UserCard";
import { ClassroomWithStudents } from "~/models/classroom.server";

export const Sidebar = ({
  classroom,
}: {
  classroom: ClassroomWithStudents;
}) => (
  <div>
    <div className="text-xs font-semibold leading-6 text-gray-400">
      Moderator
    </div>
    <div className="text-gray-300">
      <UserCard user={classroom.owner} />
    </div>
    {[...Array(15)].map((_, i) => (
      <div className="text-gray-300" key={i}>
        <UserCard user={classroom.owner} />
      </div>
    ))}
    {classroom.students.length > 0 ? (
      <div className="mt-4">
        <div className="text-xs font-semibold leading-6 text-gray-400">
          Students
        </div>
        <div className="text-gray-300">
          {classroom.students.map((student) => (
            <UserCard key={student.id} user={student} />
          ))}
        </div>
      </div>
    ) : null}
  </div>
);
