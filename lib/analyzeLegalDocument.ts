// Definición de tipos
export interface AnalysisResult {
  summary: string
  keyPoints: string[]
  riskLevel: "low" | "medium" | "high"
  recommendations: string[]
}

export async function analyzeLegalDocument(text: string): Promise<AnalysisResult> {
  if (!text || text.trim().length === 0) {
    throw new Error("El documento está vacío o no es válido")
  }

  try {
    const response = await fetch("/api/analyze-document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al analizar el documento")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error al analizar el documento:", error)
    if (error instanceof Error) {
      throw new Error(`Error al analizar el documento: ${error.message}`)
    }
    throw new Error("Error desconocido al analizar el documento")
  }
}
