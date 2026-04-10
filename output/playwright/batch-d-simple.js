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

  const scrollTextToCenter = async (text) => {
    await page.evaluate((content) => {
      const nodes = Array.from(document.querySelectorAll("*"))
      const target = nodes.find((node) => node.textContent && node.textContent.includes(content))
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ block: "center" })
      }
    }, text)
    await wait(1200)
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
    return Object.entries(sectionItems).map(([sectionId, itemIds]) => ({
      sectionId,
      items: itemIds.map((itemId) => ({
        itemId,
        rating: "C",
        evidenceNotes: `Evidencia ${itemId}`,
        actionPlan: `Seguimiento ${itemId}`,
        justification: "",
        uploadedEvidences: [],
      })),
    }))
  }

  const isoNow = new Date().toISOString()
  const now = new Date()
  const upcomingDate = new Date(now)
  upcomingDate.setDate(now.getDate() + 2)
  const overdueDate = new Date(now)
  overdueDate.setDate(now.getDate() - 3)

  const technicalControls = [
    "mfaMinimumPrivilege",
    "securePasswordsLocking",
    "encryptionInTransit",
    "encryptionAtRest",
    "periodicBackups",
    "restorationTests",
    "logsMonitoring",
    "siemIdsIps",
    "updatedAntiMalware",
    "patchManagement",
    "vulnerabilityScans",
    "periodicPentests",
    "secureSDLC",
    "continuityPlanDRP",
    "networkMonitoring",
    "emailProtection",
    "changeManagement",
    "configurationManagement",
    "databaseAccessControl",
    "identityManagement",
  ]

  const administrativeControls = [
    "personalDataPolicyActive",
    "confidentialityAgreementsSigned",
    "incidentManagementDocumented",
    "supplierEvaluation",
    "personnelOnboardingOffboarding",
    "registeredTraining",
    "informationClassificationLabeling",
    "documentManagement",
    "contractsPrivacyClauses",
    "incidentResponsePlan",
    "periodicPolicyReview",
    "processingActivitiesRegistry",
    "arcoProcedures",
    "thirdPartyContractReview",
    "legalRiskManagement",
    "businessImpactAnalysis",
    "securityCommittee",
    "incidentCommunicationPlan",
    "organizationalChangeManagement",
    "scheduledInternalAudits",
  ]

  const physicalControls = [
    "physicalAccessControl",
    "cctvRetention",
    "environmentalMeasuresCPD",
    "secureAreas",
    "visitorLogs",
    "documentSafeguarding",
    "equipmentProtection",
    "secureCabling",
    "facilitiesSecurityPlan",
    "physicalIntrusionDetection",
    "surveillance24x7",
    "portableHardwareLocking",
    "restrictedZoneSignage",
    "keyControl",
    "facilitiesMaintenance",
    "mobileDeviceControl",
    "secureMediaDestruction",
    "electricalRedundancy",
    "fireControl",
    "perimeterSecurity",
  ]

  const securityControlsData = {
    controls: [
      ...technicalControls.map((id, index) => ({
        id,
        name: id,
        category: "technical",
        status: index < 8 ? "has" : undefined,
        evidence: index < 8 ? { name: `${id}.pdf` } : undefined,
      })),
      ...administrativeControls.map((id, index) => ({
        id,
        name: id,
        category: "administrative",
        status: index < 6 ? "has" : undefined,
        evidence: index < 6 ? { name: `${id}.pdf` } : undefined,
      })),
      ...physicalControls.map((id, index) => ({
        id,
        name: id,
        category: "physical",
        status: index < 4 ? "has" : undefined,
        evidence: index < 4 ? { name: `${id}.pdf` } : undefined,
      })),
    ],
    lastUpdated: isoNow,
  }

  const reminders = [
    {
      id: "audit-reminder-001",
      title: "Revisar actualización de proveedores críticos",
      description: "Validar documentación y cláusulas del proveedor principal.",
      dueDate: upcomingDate.toISOString(),
      createdAt: isoNow,
      priority: "alta",
      status: "pendiente",
      assignedTo: ["Alicia Rivera"],
      category: "Proveedores",
      notes: "Prioridad por renovación contractual.",
    },
    {
      id: "audit-reminder-002",
      title: "Cerrar plan de remediación de transparencia",
      description: "Actualizar evidencias del checklist previo a auditoría interna.",
      dueDate: overdueDate.toISOString(),
      createdAt: isoNow,
      priority: "media",
      status: "vencida",
      assignedTo: ["Lucía Torres"],
      category: "General",
      notes: "Pendiente desde revisión anterior.",
    },
  ]

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
    aiSystemsRegistry: JSON.stringify([{ id: "sys-001", systemName: "Monitor de Cumplimiento IA", riskLevel: "alto", mainPurpose: "Monitoreo regulatorio", createdAt: isoNow }]),
    highRiskIncidentReports: JSON.stringify([{ id: "inc-001", createdAt: isoNow, updatedAt: isoNow, report: { metadata: { folioNumber: "HR-2026-001", estadoReporte: "En seguimiento" }, system: { nombreSistema: "Monitor de Cumplimiento IA" } } }]),
    algorithmicImpactAssessments: JSON.stringify([{ id: "algo-audit-001", systemName: "Scoring IA Davara", riskScore: 14, createdAt: isoNow }]),
    dataProtectionAssessments: JSON.stringify([{ id: "pdp-audit-001", responses: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [`P${index + 1}`, { value: "Sí" }])), createdAt: isoNow }]),
    intellectualPropertyAssessments: JSON.stringify([{ id: "ip-audit-001", systemName: "Asistente de redacción jurídica", riskScore: 8, createdAt: isoNow }]),
    supplierRiskAssessments: JSON.stringify([{ id: "sup-audit-001", supplierName: "Proveedor VisionTech", riskScore: 41, createdAt: isoNow }]),
    governancePolicies: JSON.stringify([{ id: "policy-001", policyFullName: "Política corporativa de uso responsable de IA", currentStatus: "active", createdAt: isoNow }]),
    transparencyExplainabilityChecklists: JSON.stringify([{ id: "transparency-001", evaluationName: "Checklist transparencia Q2 2026", aiSystem: "Copiloto Legal Interno", frameworks: ["ISO/IEC 23894:2023"], riskLevel: "alto", sections: buildTransparencySections(), createdAt: isoNow, updatedAt: isoNow }]),
    aiTrainings: JSON.stringify([{ id: "training-001", courseName: "Sesgos y decisiones automatizadas", trainingObjective: "Sensibilizar", completionStatus: "completed", createdAt: isoNow }]),
    aiGovernanceCommittees: JSON.stringify([{ id: "committee-001", committeeName: "Comité Central de Gobernanza IA", rolesDocumented: "fullyDocumented", createdAt: isoNow }]),
    securityControlsData: JSON.stringify(securityControlsData),
    "audit-reminders": JSON.stringify(reminders),
  })

  await page.goto(`${baseUrl}/seguridad-entorno`, { waitUntil: "domcontentloaded" })
  await wait(5000)
  await page.screenshot({ path: `${outDir}/26-seguridad-entorno-controles-tecnicos.png` })

  await clickByLabel("Gestión de controles")
  await page.screenshot({ path: `${outDir}/27-seguridad-entorno-gestion-controles.png` })

  await page.goto(`${baseUrl}/auditoria`, { waitUntil: "domcontentloaded" })
  await wait(5500)
  await page.screenshot({ path: `${outDir}/28-indicadores-cumplimiento-dashboard.png` })

  await scrollTextToCenter("Recordatorios de Auditoría")
  await page.screenshot({ path: `${outDir}/29-indicadores-cumplimiento-recordatorios.png` })

  await page.goto(`${baseUrl}/alicia`, { waitUntil: "domcontentloaded" })
  await wait(4500)
  await page.screenshot({ path: `${outDir}/30-alicia.png` })

  return "batch-d-simple-ok"
}
