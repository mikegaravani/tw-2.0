export const getEventReminderEmailContent = (
  title: string,
  formattedTime: string,
  location: string | undefined,
  minutesBefore: number
) => ({
  subject: `⏰ Reminder: "${title}" is starting soon`,

  text: `Your event "${title}" starts at ${formattedTime}. ${
    location ? `Location: ${location}.` : ""
  }`,

  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; color: #333;">
      <h2 style="color: #007bff;">Reminder: "${title}"!</h2>
      <p>Your event starts <strong>${
        minutesBefore === 0 ? "NOW" : `in ${minutesBefore} minute(s)`
      }</strong>.</p>
      <p><strong>🔜 Start time:</strong> ${formattedTime}</p>
      ${location ? `<p><strong>📍 Location:</strong> ${location}</p>` : ""}
      <p>Make sure you're ready!!!</p>
      <p style="margin-top: 30px; font-size: 0.9em; color: #777;">This is an automated reminder from your calendar app.</p>
    </div>
  `,
});
