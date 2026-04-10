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
          await wait(1600)
          return true
        }
      }
    }
    return false
  }

  const isoNow = new Date().toISOString()
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
    supplierAssessments: JSON.stringify([supplierAssessment]),
    supplierRiskAssessments: JSON.stringify([{ id: supplierAssessment.id, supplierName: supplierAssessment.supplierName, riskScore: supplierAssessment.score, createdAt: supplierAssessment.createdAt }]),
  })

  await page.goto(`${baseUrl}/evaluacion-riesgos-proveedores`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await clickByLabel(["Evaluaciones guardadas", "Guardadas", "Evaluaciones registradas"])
  await page.screenshot({ path: `${outDir}/17-evaluacion-proveedores-guardadas.png` })
  return "supplier-view-ok"
}
