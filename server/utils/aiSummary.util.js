import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAppointmentSummary = async (reason) => {
  if (!reason || !reason.trim()) {
    throw new Error("Reason for visit is required");
  }

  const prompt = `
You are an AI assistant for a professional healthcare appointment booking application.

Analyze the patient's reason for visiting.

Your job is to determine whether the provided reason is a VALID healthcare-related
reason for an appointment and then provide a useful appointment analysis.

A valid reason may include:
- Symptoms or health concerns
- Medical consultation
- Follow-up appointment
- Routine health checkup
- Dental appointment
- Vaccination
- Diagnostic consultation
- Specialist consultation
- Treatment follow-up
- Prescription follow-up
- Other legitimate healthcare-related purposes

An invalid reason includes:
- Greetings
- Random words
- Gibberish
- Test messages
- Completely unrelated requests
- Non-healthcare requests

For a VALID reason:

1. State "VALID: Yes"
2. Provide a professional 2-3 sentence summary.
3. Identify the primary concern.
4. Identify the duration if provided.
5. Identify additional symptoms if provided.
6. Identify important details such as frequency, severity, or timing if explicitly provided.
7. Explain the purpose of the appointment.

For an INVALID reason:

1. State "VALID: No"
2. Explain why the provided reason is not suitable for a healthcare appointment.
3. Ask the patient to provide a clear healthcare-related reason.

IMPORTANT SAFETY RULES:

- Do NOT diagnose diseases.
- Do NOT predict diseases.
- Do NOT recommend medicines.
- Do NOT recommend treatments.
- Do NOT invent symptoms.
- Do NOT assume medical history.
- Do NOT add information that the patient did not provide.
- Only analyze information explicitly provided by the patient.

Use exactly this format:

VALID: Yes/No

Summary:
[summary]

Primary Concern:
[primary concern]

Duration:
[duration or "Not provided"]

Additional Symptoms:
[list or "None reported"]

Relevant Details:
[details or "None provided"]

Visit Purpose:
[purpose]

Patient's reason:
${reason.trim()}
`;

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return response.text.trim();
    } catch (error) {
      console.error(
        `Gemini request failed (attempt ${attempt}/${maxRetries}):`,
        error.message
      );

      const isTemporaryError =
        error.status === 503 ||
        error.code === 503 ||
        error.message?.includes("high demand");

      if (!isTemporaryError || attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 1500)
      );
    }
  }
};

