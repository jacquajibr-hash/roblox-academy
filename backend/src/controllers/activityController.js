
import { listActivity } from "../utils/activity.js";

export async function getActivity(req, res) {
  try {
    const activities = await listActivity(300);

    return res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error("Erreur journal d'activité :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer le journal d'activité."
    });
  }
}
