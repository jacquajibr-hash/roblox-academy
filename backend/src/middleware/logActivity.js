
import { findUserById } from "../utils/users.js";
import { addActivity } from "../utils/activity.js";

export function logActivity(action) {
  return (req, res, next) => {
    const methodsToLog = ["POST", "PUT", "PATCH", "DELETE"];

    if (!methodsToLog.includes(req.method)) {
      return next();
    }

    res.on("finish", async () => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        return;
      }

      try {
        const user = await findUserById(req.session?.userId);

        if (!user) return;

        await addActivity({
          userId: user.id,
          username: user.username,
          action,
          details: `${req.method} ${req.originalUrl}`
        });
      } catch (error) {
        console.error("Erreur journal d'activité :", error);
      }
    });

    next();
  };
}
