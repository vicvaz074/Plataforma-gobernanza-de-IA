async (page) => {
  const baseUrl = "http://localhost:3000"
  const outDir = "/Users/vicentevazquez/Desktop/Plataforma-gobernanza-de-IA-main/output/playwright/plataforma-capturas"
  const wait = (ms) => page.waitForTimeout(ms)

  const clickByLabel = async (labels) => {
    const labelList = Array.isArray(labels) ? labels : [labels]
    for (const label of labelList) {
      const candidates = [
        page.getByRole("button", { name: label, exact: false }),
        page.locator("button").filter({ hasText: label }),
        page.getByText(label, { exact: false }),
      ]
      for (const locator of candidates) {
        const count = await locator.count()
        for (let index = 0; index < count; index += 1) {
          const target = locator.nth(index)
          if (!(await target.isVisible().catch(() => false))) continue
          await target.scrollIntoViewIfNeeded().catch(() => {})
          await wait(200)
          await target.click({ force: true })
          await wait(1400)
          return
        }
      }
    }
    throw new Error(`No pude hacer clic en: ${labelList.join(", ")}`)
  }

  const isoNow = new Date().toISOString()

  const algorithmicAssessment = {
    id: "algo-001",
    projectName: "Sistema de scoring crediticio",
    systemName: "Scoring IA Davara",
    version: "v3.2",
    personalData: "si",
    dataMinimization: "si",
    pseudonymization: "parcial",
    multipleSources: "si",
    transparency: "parcial",
    rightsMechanisms: "si",
    performanceObjectives: "si",
    trainingDocumentation: "parcial",
    biasEvaluations: "parcial",
    robustnessTests: "si",
    humanSupervision: "si",
    designatedResponsibles: "si",
    decisionLogging: "si",
    vulnerabilityManagement: "parcial",
    leakageRisks: "no",
    contractClauses: "si",
    kpis: "si",
    committeeReports: "si",
    incidentRegistry: "si",
    transparencyRegistry: "parcial",
    createdAt: isoNow,
    updatedAt: isoNow,
    riskScore: 14,
  }

  const riskResponses = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [
      `P${index + 1}`,
      { value: index % 3 === 0 ? "Sí" : index % 3 === 1 ? "Parcial" : "No", other: "" },
    ]),
  )

  const dataProtectionAssessment = {
    id: "pdp-001",
    systemName: "Copiloto de RRHH",
    assessmentDate: "2026-04-01",
    createdAt: isoNow,
    updatedAt: isoNow,
    normalizedScore: 82.4,
    riskLevelNumber: 2,
    riskLevel: "Medio",
    totalScore: 38,
    responses: riskResponses,
    documents: {
      dpia: "dpia.pdf",
      policies: "politicas.pdf",
    },
    recommendations: ["Reforzar minimización", "Actualizar contrato de encargado"],
  }

  const ipAssessment = {
    id: "ip-001",
    timestamp: isoNow,
    projectName: "Asistente de redacción jurídica",
    responsibleArea: "Jurídico y cumplimiento",
    lifecyclePhase: "produccion",
    aiType: "generativa",
    usageType: "interno",
    copyrightData: "si",
    contentType: ["texto", "codigo"],
    licensesDocumented: "parcial",
    scrapingData: "no",
    protectedOutput: "si",
    outputOwnership: "si",
    contentTraceability: "parcial",
    infringementRisk: "medio",
    patentMonitoring: "si",
    technicalControls: ["filtro-contenido", "control-manual"],
    defensibilityEvaluations: "si",
    legalAdvice: "si",
    termsOfUse: "si",
    publicReport: "parcial",
    riskLevel: "Medio",
    recommendedActions: ["Actualizar matriz de licencias", "Formalizar revisiones legales"],
    score: 8,
    riskCategory: "medium",
  }

  const supplierAssessment = {
    id: "supplier-001",
    supplierName: "Proveedor VisionTech",
    country: "España",
    thirdPartyType: "desarrollador",
    developerType: "externo",
    role: "",
    serviceDescription: "Proveedor de motor de visión para verificación documental.",
    contactPerson: "Laura Sánchez, Directora de Cuenta",
    transversalQuestions: {
      technical_documentation_complete: "si",
      explainability_mechanisms: "parcial",
      bias_quality_evaluations: "parcial",
      data_retention_policies: "si",
      security_controls: "si",
      audit_rights: "si",
      subprocessors_list: "parcial",
      system_classification: "alto_riesgo",
      intended_use: "si_completo",
      deployment_context: "si_detallado",
      technical_documentation: "si_completa",
      quality_system: "si_certificado",
    },
    documents: {
      contract: "contrato.pdf",
    },
    score: 41,
    riskLevel: "Medio",
    createdAt: isoNow,
    updatedAt: isoNow,
  }

  await page.setViewportSize({ width: 1440, height: 1200 })
  await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" })
  await wait(1000)

  await page.evaluate((seed) => {
    localStorage.clear()
    sessionStorage.clear()
    Object.entries(seed).forEach(([key, value]) => localStorage.setItem(key, value))
  }, {
    isAuthenticated: "true",
    userRole: "admin",
    userName: "Alicia Rivera",
    userEmail: "alicia.rivera@davara.com.mx",
    language: "es",
    theme: "light",
    sidebarCollapsed: "false",
    algorithmicAssessments: JSON.stringify([algorithmicAssessment]),
    algorithmicImpactAssessments: JSON.stringify([algorithmicAssessment]),
    riskAssessments: JSON.stringify([dataProtectionAssessment]),
    dataProtectionAssessments: JSON.stringify([dataProtectionAssessment]),
    ipAssessments: JSON.stringify([ipAssessment]),
    intellectualPropertyAssessments: JSON.stringify([{ id: "ip-audit-001", systemName: "Asistente de redacción jurídica", riskScore: 8, createdAt: isoNow }]),
    supplierAssessments: JSON.stringify([supplierAssessment]),
    supplierRiskAssessments: JSON.stringify([{ id: supplierAssessment.id, supplierName: supplierAssessment.supplierName, riskScore: supplierAssessment.score, createdAt: supplierAssessment.createdAt }]),
  })

  await page.goto(`${baseUrl}/evaluacion-impacto-algoritmico`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/10-evaluacion-impacto-algoritmico-registrar.png` })

  await clickByLabel("Evaluaciones registradas")
  await page.screenshot({ path: `${outDir}/11-evaluacion-impacto-algoritmico-historial.png` })

  await page.goto(`${baseUrl}/evaluacion-riesgos-pdp`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/12-evaluacion-datos-personales-registrar.png` })

  await clickByLabel("Evaluaciones guardadas")
  await page.screenshot({ path: `${outDir}/13-evaluacion-datos-personales-guardadas.png` })

  await page.goto(`${baseUrl}/evaluacion-impacto-pi`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/14-evaluacion-propiedad-intelectual-registrar.png` })

  await clickByLabel(["Ver Evaluaciones Registradas", "Historial"])
  await page.screenshot({ path: `${outDir}/15-evaluacion-propiedad-intelectual-historial.png` })

  await page.goto(`${baseUrl}/evaluacion-riesgos-proveedores`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/16-evaluacion-proveedores-registrar.png` })

  await clickByLabel("Evaluaciones guardadas")
  await page.screenshot({ path: `${outDir}/17-evaluacion-proveedores-guardadas.png` })

  return "batch-b-simple-ok"
}
