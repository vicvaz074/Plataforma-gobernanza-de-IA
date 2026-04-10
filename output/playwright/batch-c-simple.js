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

  const buildTransparencySections = () => {
    const sectionItems = {
      "1": ["1.1", "1.2"],
      "2": ["2.1", "2.2"],
      "3": ["3.1", "3.2", "3.3"],
      "4": ["4.1", "4.2"],
      "5": ["5.1", "5.2"],
      "6": ["6.1", "6.2"],
      "7": ["7.1", "7.2"],
    }
    const ratings = ["C", "PC", "C", "NA"]
    return Object.entries(sectionItems).map(([sectionId, itemIds], sectionIndex) => ({
      sectionId,
      items: itemIds.map((itemId, itemIndex) => ({
        itemId,
        rating: ratings[(sectionIndex + itemIndex) % ratings.length],
        evidenceNotes: `Evidencia del criterio ${itemId}.`,
        actionPlan: `Seguimiento trimestral ${itemId}.`,
        justification: "",
        uploadedEvidences: [],
      })),
    }))
  }

  const isoNow = new Date().toISOString()
  const governancePolicy = {
    id: "policy-001",
    policyType: "acceptableUse",
    policyFullName: "Política corporativa de uso responsable de IA",
    policyPurpose: "Definir principios, responsabilidades y controles para el uso responsable de IA.",
    appliesTo: ["employees", "contractors"],
    topicsCovered: ["ethics", "privacy", "security"],
    effectiveStartDate: "2026-01-15T00:00:00.000Z",
    effectiveEndDate: null,
    isIndefinite: true,
    lastReviewDate: "2026-03-15T00:00:00.000Z",
    reviewPeriodicity: "quarterly",
    responsibleArea: "legalCompliance",
    designatedResponsible: "Alicia Rivera",
    policyVersion: "v1.2",
    currentStatus: "active",
    approvedBy: "board",
    relationshipOtherPolicies: "Se alinea con privacidad, seguridad y proveedores.",
    additionalObservations: "Incluye anexos operativos y checklists.",
    createdAt: "2026-01-15T00:00:00.000Z",
  }

  const transparencyRecord = {
    id: "transparency-001",
    evaluationName: "Checklist transparencia Q2 2026",
    aiSystem: "Copiloto Legal Interno",
    frameworks: ["ISO/IEC 23894:2023", "ISO/IEC 42001:2023", "NIST AI RMF 1.0"],
    riskLevel: "alto",
    evaluationCycle: "Trimestral",
    evaluationDate: "2026-04-03",
    stakeholders: "Usuarios internos, comité, DPO",
    leadEvaluator: "Alicia Rivera",
    objectives: "Validar transparencia y explicabilidad antes de ampliar el despliegue.",
    notes: "Evaluación demo con evidencias trazables.",
    sections: buildTransparencySections(),
    createdAt: isoNow,
    updatedAt: isoNow,
  }

  const training = {
    id: "training-001",
    courseName: "Sesgos y decisiones automatizadas",
    mainTopic: "Ética y sesgos",
    trainingObjective: "Sensibilizar al personal sobre sesgos, supervisión y controles de IA.",
    depthLevel: "Intermedio",
    modality: "Híbrida",
    instructorName: "Dr. Daniel Ortiz",
    instructorType: "Externo",
    instructorProfile: "Especialista en ética y gobernanza de IA",
    startDate: "2026-04-02T00:00:00.000Z",
    endDate: "2026-04-02T00:00:00.000Z",
    totalDuration: "6",
    locationPlatform: "Zoom + sala híbrida",
    participantsList: "Equipo legal, producto y compliance",
    attendeeAreas: ["Jurídico", "Compliance", "Producto"],
    totalAttendees: "24",
    targetAudienceLevel: "Mandos medios",
    trainingEvidence: [],
    attendeeEvaluation: "Encuesta de satisfacción",
    evaluationResults: "Promedio de satisfacción 4.7/5",
    certificatesDelivered: "Sí",
    internalResponsible: "Alicia Rivera",
    nextUpdateDate: "2026-10-02T00:00:00.000Z",
    programVersion: "v1.1",
    trainingStatus: "Completado",
    completionStatus: "completed",
    additionalObservations: "Capacitación replicable por área.",
    createdAt: isoNow,
    updatedAt: isoNow,
  }

  const trainingMaterial = {
    id: "material-001",
    materialType: "Presentación",
    materialDescription: "Deck de apoyo para sesgos y supervisión humana.",
    relatedTraining: "Sesgos y decisiones automatizadas",
    uploadDate: isoNow,
  }

  const committee = {
    id: "committee-001",
    committeeName: "Comité Central de Gobernanza IA",
    committeeMembers: ["presidency", "technicalSecretary", "privacyCommitteeLink"],
    rolesDocumented: "fullyDocumented",
    organizationalLevel: "direction",
    constitutionDate: "2026-01-15",
    documents: { charter: "acta-comite.pdf" },
    createdAt: isoNow,
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
    governancePolicies: JSON.stringify([governancePolicy]),
    transparencyExplainabilityChecklists: JSON.stringify([transparencyRecord]),
    aiTrainings: JSON.stringify([training]),
    aiTrainingMaterials: JSON.stringify([trainingMaterial]),
    aiGovernanceCommittees: JSON.stringify([committee]),
  })

  await page.goto(`${baseUrl}/politicas-procesos-gobernanza`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/18-politicas-procesos-gobernanza-registrar.png` })

  await clickByLabel(["Gestionar políticas", "Gestionar"])
  await page.screenshot({ path: `${outDir}/19-politicas-procesos-gobernanza-gestionar.png` })

  await page.goto(`${baseUrl}/transparencia-explicabilidad`, { waitUntil: "domcontentloaded" })
  await wait(6500)
  await page.screenshot({ path: `${outDir}/20-transparencia-explicabilidad-captura.png` })

  await clickByLabel("Historial")
  await page.screenshot({ path: `${outDir}/21-transparencia-explicabilidad-historial.png` })

  await page.goto(`${baseUrl}/concientizacion-entrenamiento-ia`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/22-concientizacion-entrenamiento-ia-registrar.png` })

  await clickByLabel(["Capacitaciones registradas", "Capacitaciones"])
  await page.screenshot({ path: `${outDir}/23-concientizacion-entrenamiento-ia-capacitaciones.png` })

  await page.goto(`${baseUrl}/comite-gobernanza-ia`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/24-comite-gobernanza-ia-registrar.png` })

  await clickByLabel(["Comités registrados", "Comités"])
  await page.screenshot({ path: `${outDir}/25-comite-gobernanza-ia-comites-registrados.png` })

  return "batch-c-simple-ok"
}
