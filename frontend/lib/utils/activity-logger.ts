import { addActivityLog } from "../mocks/activity-logs";

export function logActivity(
  activity: string,
  details: string,
  type: "LOGIN" | "CREATE" | "UPDATE" | "DELETE" | "LOGOUT"
) {
  const userStr = localStorage.getItem("User");
  if (!userStr) return;

  try {
    const user = JSON.parse(userStr);
    addActivityLog({
      username: user.username,
      activity,
      details,
      type,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
