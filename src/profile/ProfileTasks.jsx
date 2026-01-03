import { Card } from '../components/MidnightFrostComponents';

const ProfileTasks = () => {
  const tasks = [
    { id: 1, title: 'Review job applications', status: 'Pending', priority: 'High' },
    { id: 2, title: 'Schedule interviews', status: 'In Progress', priority: 'Medium' },
    { id: 3, title: 'Update candidate database', status: 'Completed', priority: 'Low' },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between">
            <div>
              <p className="text-[#88aaff]">{task.title}</p>
              <p className="text-[#1f2937] text-sm">Priority: {task.priority}</p>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              task.status === 'Completed' ? 'bg-green-600 text-white' :
              task.status === 'In Progress' ? 'bg-[#aaccff] text-[#020617]' :
              'bg-[#1f2937] text-[#ddeeff]'
            }`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileTasks;
