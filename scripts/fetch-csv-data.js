// Script para obtener y procesar los datos del CSV de evaluación de riesgos
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cuestionario_riesgo_IA_PDP-E9QM9eb3ZVmL7cAlV9aP1oSUhFJLoC.csv"

async function fetchAndProcessCSV() {
  try {
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parsear CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    const questions = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
        const question = {
          section: values[0],
          id: values[1],
          question: values[2],
          options: values[3] ? values[3].split(";") : [],
          scores: values[4] ? values[4].split(";").map((s) => Number.parseInt(s)) : [],
        }
        questions.push(question)
      }
    }

    console.log("[v0] Preguntas procesadas:", questions.length)
    console.log("[v0] Secciones encontradas:", [...new Set(questions.map((q) => q.section))])

    return questions
  } catch (error) {
    console.error("[v0] Error al procesar CSV:", error)
    return []
  }
}

// Ejecutar y mostrar resultados
fetchAndProcessCSV().then((questions) => {
  console.log("[v0] Datos del CSV procesados exitosamente")

  // Agrupar por sección
  const sections = {}
  questions.forEach((q) => {
    if (!sections[q.section]) {
      sections[q.section] = []
    }
    sections[q.section].push(q)
  })

  console.log(
    "[v0] Estructura por secciones:",
    Object.keys(sections).map((s) => `${s}: ${sections[s].length} preguntas`),
  )
})
