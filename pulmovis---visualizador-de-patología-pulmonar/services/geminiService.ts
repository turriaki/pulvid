import { GoogleGenAI, Type } from "@google/genai";
import { PathologyType, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchPathologyDetails = async (pathology: PathologyType): Promise<GeminiResponse> => {
  if (pathology === PathologyType.NORMAL) {
    return {
      description: "Los pulmones son los órganos principales del sistema respiratorio. En un estado saludable, el tejido pulmonar es elástico, permitiendo una adecuada expansión (inspiración) y contracción (espiración) para el intercambio gaseoso. Los alvéolos están llenos de aire y las pleuras se deslizan suavemente.",
      symptoms: ["Respiración sin esfuerzo", "Frecuencia respiratoria normal (12-20 rpm)", "Ausencia de tos o dolor torácico"],
      radiographicFeatures: ["Campos pulmonares radiolúcidos (oscuros)", "Ángulos costofrénicos libres y agudos", "Silueta cardíaca y diafragmática bien definidas"],
      treatment: "Mantener hábitos saludables, no fumar, ejercicio regular y vacunación preventiva."
    };
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    Provee una explicación médica detallada pero accesible sobre la patología pulmonar: "${pathology}".
    
    Responde estrictamente en formato JSON con la siguiente estructura:
    {
      "description": "Explicación fisiopatológica breve.",
      "symptoms": ["Síntoma 1", "Síntoma 2", "Síntoma 3"],
      "radiographicFeatures": ["Hallazgo visual en RX/TAC 1", "Hallazgo visual 2"],
      "treatment": "Resumen del enfoque terapéutico general."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            radiographicFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatment: { type: Type.STRING }
          },
          required: ["description", "symptoms", "radiographicFeatures", "treatment"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as GeminiResponse;

  } catch (error) {
    console.error("Error fetching Gemini data:", error);
    // Fallback data in case of API failure
    return {
      description: "No se pudo cargar la información detallada desde la IA. Por favor verifica tu conexión o clave API.",
      symptoms: ["No disponible"],
      radiographicFeatures: ["No disponible"],
      treatment: "Consultar a un especialista."
    };
  }
};
