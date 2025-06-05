import { format } from "date-fns";

export interface ActivityLog {
  id: number;
  username: string;
  activity: string;
  details: string;
  timestamp: string;
  type: "LOGIN" | "CREATE" | "UPDATE" | "DELETE" | "LOGOUT";
}

const generateMockLogs = (): ActivityLog[] => {
  const activities = [
    {
      type: "LOGIN" as const,
      activity: "User Login",
      details: "User logged in successfully",
    },
    {
      type: "CREATE" as const,
      activity: "Create Resident",
      details: "Created a new resident record",
    },
    {
      type: "UPDATE" as const,
      activity: "Update Payment",
      details: "Updated payment status",
    },
    {
      type: "DELETE" as const,
      activity: "Delete Fee",
      details: "Deleted fee record",
    },
    {
      type: "LOGOUT" as const,
      activity: "User Logout",
      details: "User logged out",
    },
  ];

  const usernames = ["admin", "staff1", "staff2"];
  const logs: ActivityLog[] = [];

  // Generate 50 random logs
  for (let i = 1; i <= 50; i++) {
    const randomActivity =
      activities[Math.floor(Math.random() * activities.length)];
    const randomUsername =
      usernames[Math.floor(Math.random() * usernames.length)];
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days

    logs.push({
      id: i,
      username: randomUsername,
      activity: randomActivity.activity,
      details: randomActivity.details,
      timestamp: format(randomDate, "yyyy-MM-dd HH:mm:ss"),
      type: randomActivity.type,
    });
  }

  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Initialize logs in localStorage if not exists
if (typeof window !== "undefined") {
  const storedLogs = localStorage.getItem("activityLogs");
  if (!storedLogs) {
    localStorage.setItem("activityLogs", JSON.stringify(generateMockLogs()));
  }
}

export const getActivityLogs = (): ActivityLog[] => {
  if (typeof window === "undefined") return [];
  const logs = localStorage.getItem("activityLogs");
  return logs ? JSON.parse(logs) : [];
};

export const addActivityLog = (log: Omit<ActivityLog, "id" | "timestamp">) => {
  if (typeof window === "undefined") return;
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    ...log,
    id: logs.length + 1,
    timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  };
  logs.unshift(newLog);
  localStorage.setItem("activityLogs", JSON.stringify(logs));
};
