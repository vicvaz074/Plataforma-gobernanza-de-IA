async (page) => {
  const baseUrl = "http://localhost:3000"
  const outDir = "/Users/vicentevazquez/Desktop/Plataforma-gobernanza-de-IA-main/output/playwright/plataforma-capturas"
  const batch = "B"

  const wait = (ms) => page.waitForTimeout(ms)

  const waitForBodyContent = async () => {
    await page.waitForFunction(
      () => !!document.body && document.body.innerText.trim().length > 30,
      null,
      { timeout: 45000 },
    )
  }

  const ensureUiPrefs = async () => {
    await page
      .evaluate(() => {
        try {
          localStorage.setItem("language", "es")
          localStorage.setItem("theme", "light")
          localStorage.setItem("sidebarCollapsed", "false")
          document.documentElement.classList.remove("dark")
          document.documentElement.style.colorScheme = "light"
          document.body?.classList.remove("dark")
        } catch {}
      })
      .catch(() => {})
  }

  const waitForText = async (text) => {
    await page.waitForFunction(
      (expected) => !!document.body && document.body.innerText.includes(expected),
      text,
      { timeout: 45000 },
    )
  }

  const waitForAnyText = async (texts) => {
    let lastError
    for (const text of texts) {
      try {
        await waitForText(text)
        return
      } catch (error) {
        lastError = error
      }
    }
    throw lastError || new Error(`No fue posible encontrar ninguno de estos textos: ${texts.join(", ")}`)
  }

  const waitForSelector = async (selector) => {
    await page.locator(selector).first().waitFor({ state: "visible", timeout: 45000 })
  }

  const gotoAndWait = async (pathname, options = {}) => {
    const { text, selector, after = 900, before = 600 } = options
    await page.goto(`${baseUrl}${pathname}`, { waitUntil: "domcontentloaded" })
    await wait(before)
    await waitForBodyContent()
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {})
    await ensureUiPrefs()
    if (selector) {
      await waitForSelector(selector)
    }
    if (text) {
      if (Array.isArray(text)) {
        await waitForAnyText(text)
      } else {
        await waitForText(text)
      }
    }
    await wait(after)
  }

  const clickByLabel = async (labels) => {
    const labelList = Array.isArray(labels) ? labels : [labels]

    for (const label of labelList) {
      const candidates = [
        page.getByRole("button", { name: label, exact: false }),
        page.locator("button").filter({ hasText: label }),
        page.getByRole("link", { name: label, exact: false }),
        page.locator("[role='tab']").filter({ hasText: label }),
        page.getByText(label, { exact: false }),
      ]

      for (const locator of candidates) {
        const count = await locator.count()
        if (count > 0) {
          for (let index = 0; index < count; index += 1) {
            const target = locator.nth(index)
            const isVisible = await target.isVisible().catch(() => false)
            if (!isVisible) continue
            await target.scrollIntoViewIfNeeded().catch(() => {})
            await wait(200)
            await target.click({ force: true })
            await wait(700)
            return
          }
        }
      }
    }

    throw new Error(`No fue posible hacer clic en ninguno de estos elementos: ${labelList.join(", ")}`)
  }

  const scrollTextToCenter = async (text) => {
    await page.evaluate((content) => {
      const nodes = Array.from(document.querySelectorAll("*"))
      const target = nodes.find((node) => node.textContent && node.textContent.includes(content))
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ block: "center" })
      }
    }, text)
    await wait(700)
  }

  const screenshot = async (fileName) => {
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
    await wait(250)
    await page.screenshot({ path: `${outDir}/${fileName}` })
    console.log(`saved:${fileName}`)
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
        evidenceNotes: `Evidencia validada para el criterio ${itemId}.`,
        actionPlan: `Seguimiento trimestral del criterio ${itemId}.`,
        justification: "",
        uploadedEvidences: [],
      })),
    }))
  }

  const now = new Date()
  const isoNow = now.toISOString()
  const upcomingDate = new Date(now)
  upcomingDate.setDate(now.getDate() + 2)
  const overdueDate = new Date(now)
  overdueDate.setDate(now.getDate() - 3)

  const users = [
    {
      name: "Alicia Rivera",
      email: "alicia.rivera@davara.com.mx",
      password: "seeded",
      approved: true,
      role: "admin",
    },
    {
      name: "Carlos Méndez",
      email: "carlos.mendez@davara.com.mx",
      password: "seeded",
      approved: true,
      role: "user",
    },
    {
      name: "Lucía Torres",
      email: "lucia.torres@davara.com.mx",
      password: "seeded",
      approved: true,
      role: "user",
    },
    {
      name: "Mariana Soto",
      email: "mariana.soto@davara.com.mx",
      password: "seeded",
      approved: false,
      role: "user",
    },
  ]

  const aiSystemsRegistry = [
    {
      id: "ai-system-001",
      companyName: "Davara Governance",
      corporateGroup: "Davara",
      mainJurisdiction: "México",
      systemName: "Monitor de Cumplimiento IA",
      systemVersion: "v2.4.1",
      systemDescription: "Sistema de terceros para monitoreo regulatorio y trazabilidad operativa.",
      responsibleArea: "juridico_compliance",
      riskLevel: "alto",
      mainPurpose: "Supervisar cumplimiento regulatorio de sistemas de IA.",
      createdAt: isoNow,
    },
  ]

  const aiTechnicalDocuments = [
    {
      id: "tech-doc-001",
      name: "arquitectura-monitor-ia.pdf",
      type: "application/pdf",
      size: 482000,
      uploadDate: isoNow,
      category: "Documentación de arquitectura",
      description: "Arquitectura funcional del sistema interno de IA.",
    },
  ]

  const aiDocumentationQuestionnaires = [
    {
      id: "questionnaire-001",
      systemName: "Copiloto Legal Interno",
      version: "v1.3.0",
      createdAt: isoNow,
      updatedAt: isoNow,
      responses: {
        "sectionA_1": { answer: "si", explanation: "El sistema cuenta con control documental." },
        "sectionB_2": { answer: "parcial", explanation: "Se encuentra en expansión la trazabilidad." },
      },
    },
  ]

  const highRiskIncidentReports = [
    {
      id: "incident-001",
      createdAt: isoNow,
      updatedAt: isoNow,
      report: {
        metadata: {
          folioNumber: "HR-2026-001",
          estadoReporte: "En seguimiento",
          fechaGeneracion: isoNow,
          hashIntegridad: "sha256-demo-hr-2026-001",
        },
        administrative: {
          numeroExpediente: "EXP-IA-2026-010",
          autoridadReceptora: "Autoridad de Supervisión",
          entidadFederativa: "Ciudad de México",
          fechaReporte: isoNow,
          fechaIncidenteInicio: isoNow,
          fechaIncidenteFin: isoNow,
          fechaDeteccion: isoNow,
          fechaNotificacionInterna: isoNow,
          fechaSeguimiento: upcomingDate.toISOString(),
          clasificacionGravedad: "Alta",
        },
        responsible: {
          tipoResponsable: "Responsable del tratamiento",
          razonSocial: "Davara Governance",
          sectorEconomico: "Servicios legales",
          giroEmpresarial: "Gobernanza y cumplimiento",
          responsableNombre: "Alicia Rivera",
          responsableCargo: "Directora de Gobernanza IA",
          emailPrincipal: "alicia.rivera@davara.com.mx",
          emailSecundario: "equipo.ia@davara.com.mx",
          telefono: "+52 55 5555 0101",
          direccionCompleta: "Av. Reforma 123, Ciudad de México",
        },
        system: {
          nombreSistema: "Monitor de Cumplimiento IA",
          versionSistema: "v2.4.1",
          tipoIA: "Analítica predictiva",
          propositoPrincipal: "Monitoreo de incidentes y cumplimiento",
          sectorAplicacion: "Servicios legales",
          datosEntrenamiento: "Registros operativos y catálogos regulatorios",
          usuariosEstimados: 180,
          frecuenciaUso: "Diaria",
          nivelAutomatizacion: "Semi-automatizado",
        },
        incident: {
          descripcionIncidente: "Desalineación temporal en la clasificación de alertas regulatorias.",
          fallaDetectada: "Clasificación errónea de prioridad",
          contextoUso: "Monitoreo en producción",
          condicionesEspeciales: "Incremento de volumen por cierre trimestral",
          personasAfectadas: 12,
          tipoPersonasAfectadas: ["Analistas", "Área jurídica"],
          impactoEconomico: "Impacto operativo moderado",
          datosComprometidos: 0,
          serviciosInterrumpidos: "No hubo interrupción",
        },
        response: {
          causaProbable: "Regla de priorización desactualizada",
          analisisCausaRaiz: "Cambio no propagado a ambiente productivo",
          factoresContribuyentes: "Ausencia de validación automática post-despliegue",
          medidasInmediatas: "Rollback y verificación manual",
          medidasCortoPlazo: "Checklist de validación adicional",
          medidasLargoPlazo: "Automatizar pruebas de consistencia",
          sistemaSuspendido: "No",
          mejorasPlanificadas: "Alertas de deriva y validación de reglas",
        },
        compliance: {
          evaluacionRevisada: "Sí",
          evaluacionAdecuada: "Parcialmente",
          nuevosRiesgos: "Deriva de reglas",
          probabilidadRecurrencia: "Media",
          leyesAplicables: ["AI Act", "LFPDPPP"],
          otrosReportes: "Ninguno",
          autoridadesNotificadas: ["Autoridad de Supervisión"],
        },
        declaration: {
          nombreDeclarante: "Alicia Rivera",
          cargoDeclarante: "Directora de Gobernanza IA",
          firmaDigital: "FIRMA-DEMO",
          fechaDeclaracion: isoNow,
          compromisoSeguimiento: "Sí",
          frecuenciaSeguimiento: "Semanal",
          contactoSeguimiento: "equipo.ia@davara.com.mx",
        },
      },
    },
  ]

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
    risksExplanation: "Persisten dudas en datasets heredados.",
    scrapingData: "no",
    protectedOutput: "si",
    typeProtection: ["copyright", "references"],
    explicitLicense: "parcial",
    outputOwnership: "si",
    contentTraceability: "parcial",
    infringementRisk: "medio",
    riskDescription: "Requiere revisión de prompts y fuentes.",
    patentMonitoring: "si",
    technicalControls: ["filtro-contenido", "control-manual"],
    defensibilityEvaluations: "si",
    legalAdvice: "si",
    termsOfUse: "si",
    publicReport: "parcial",
    reportIncludes: ["limitaciones", "uso previsto"],
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
    isHighRisk: "si",
    autonomyLevel: "medio",
    sector: "legaltech",
    sectorSpecific: "cumplimiento",
    documentation: "si",
    qualitySystem: "si_certificado",
    instructions: "si",
    explainability: "parcial",
    privacyImpact: "si",
    legalBasis: "si",
    dataLocation: "ue",
    retentionPolicies: "si",
    securityCertifications: "ISO 27001",
    securityControls: "si",
    incidentManagement: "si",
    biasEvaluation: "parcial",
    dataGovernance: "si",
    contract: "si",
    subprocessors: "parcial",
    slaVersioning: "si",
    reportingFrequency: "mensual",
    specificQuestions: {},
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
      annex: "anexo-ai.pdf",
    },
    score: 41,
    riskLevel: "Medio",
    createdAt: isoNow,
    updatedAt: isoNow,
  }

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
    otherMembers: "",
    rolesDocumented: "fullyDocumented",
    rolesApproved: "si",
    organizationalLevel: "direction",
    missionDefined: "si",
    agendaDetermination: "si",
    meetingFrequency: "mensual",
    committeeFunctions: "strategicSupervision",
    otherFunctions: "",
    reviewsInitiatives: "si",
    validatesDataPolicies: "si",
    definesProcesses: "si",
    promotesCulture: "si",
    establishesKPIs: "si",
    communicatesInternally: "si",
    reportsToManagement: "si",
    formedBasedOnFrameworks: "si",
    periodicReview: "trimestral",
    constitutionDate: "2026-01-15",
    authorizingAuthority: "Consejo Directivo",
    otherAuthority: "",
    foundingMembers: "Alicia Rivera, Carlos Méndez",
    formalDocumentSigned: "si",
    validityDefined: "si",
    documents: {
      charter: "acta-comite.pdf",
    },
    createdAt: isoNow,
  }

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
        status: index < 7 ? "has" : index < 9 ? "notApplicable" : undefined,
        evidence: index < 7 ? { name: `${id}.pdf` } : undefined,
        justification: index >= 7 && index < 9 ? "No aplica por arquitectura actual" : undefined,
      })),
      ...administrativeControls.map((id, index) => ({
        id,
        name: id,
        category: "administrative",
        status: index < 6 ? "has" : index === 6 ? "notApplicable" : undefined,
        evidence: index < 6 ? { name: `${id}.pdf` } : undefined,
        justification: index === 6 ? "Control absorbido por política corporativa" : undefined,
      })),
      ...physicalControls.map((id, index) => ({
        id,
        name: id,
        category: "physical",
        status: index < 5 ? "has" : index === 5 ? "notApplicable" : undefined,
        evidence: index < 5 ? { name: `${id}.pdf` } : undefined,
        justification: index === 5 ? "Aplica solo a sedes con archivo físico" : undefined,
      })),
    ],
    lastUpdated: isoNow,
  }

  const auditReminders = [
    {
      id: "audit-reminder-001",
      title: "Revisar actualización de proveedores críticos",
      description: "Validar documentación y cláusulas del proveedor principal de visión computacional.",
      dueDate: upcomingDate.toISOString(),
      createdAt: isoNow,
      priority: "alta",
      status: "pendiente",
      assignedTo: ["Alicia Rivera", "Carlos Méndez"],
      category: "Proveedores",
      notes: "Prioridad por renovación contractual.",
    },
    {
      id: "audit-reminder-002",
      title: "Cerrar plan de remediación de transparencia",
      description: "Actualizar evidencias del checklist de transparencia previo a auditoría interna.",
      dueDate: overdueDate.toISOString(),
      createdAt: isoNow,
      priority: "media",
      status: "vencida",
      assignedTo: ["Lucía Torres"],
      category: "General",
      notes: "Pendiente desde la revisión anterior.",
    },
  ]

  const storageSeed = {
    isAuthenticated: "true",
    userRole: "admin",
    userName: "Alicia Rivera",
    userEmail: "alicia.rivera@davara.com.mx",
    showPostLoginWelcome: "true",
    language: "es",
    theme: "light",
    sidebarCollapsed: "false",
    users: JSON.stringify(users),
    documents: JSON.stringify([
      { id: "doc-001", name: "Politica IA.pdf" },
      { id: "doc-002", name: "DPIA RRHH.pdf" },
      { id: "doc-003", name: "Checklist transparencia.json" },
    ]),
    completedActivities: JSON.stringify([
      { id: "activity-001", name: "Registro inicial completado" },
      { id: "activity-002", name: "Capacitación Q1 completada" },
      { id: "activity-003", name: "Auditoría interna realizada" },
    ]),
    aiSystemsRegistry: JSON.stringify(aiSystemsRegistry),
    aiTechnicalDocuments: JSON.stringify(aiTechnicalDocuments),
    aiDocumentationQuestionnaires: JSON.stringify(aiDocumentationQuestionnaires),
    highRiskIncidentReports: JSON.stringify(highRiskIncidentReports),
    algorithmicAssessments: JSON.stringify([algorithmicAssessment]),
    algorithmicImpactAssessments: JSON.stringify([algorithmicAssessment]),
    riskAssessments: JSON.stringify([dataProtectionAssessment]),
    dataProtectionAssessments: JSON.stringify([dataProtectionAssessment]),
    ipAssessments: JSON.stringify([ipAssessment]),
    intellectualPropertyAssessments: JSON.stringify([
      {
        id: "ip-audit-001",
        systemName: "Asistente de redacción jurídica",
        riskScore: 8,
        createdAt: isoNow,
      },
    ]),
    supplierAssessments: JSON.stringify([supplierAssessment]),
    supplierRiskAssessments: JSON.stringify([
      {
        id: supplierAssessment.id,
        supplierName: supplierAssessment.supplierName,
        riskScore: supplierAssessment.score,
        createdAt: supplierAssessment.createdAt,
      },
    ]),
    governancePolicies: JSON.stringify([governancePolicy]),
    transparencyExplainabilityChecklists: JSON.stringify([transparencyRecord]),
    aiTrainings: JSON.stringify([training]),
    aiTrainingMaterials: JSON.stringify([trainingMaterial]),
    aiGovernanceCommittees: JSON.stringify([committee]),
    securityControlsData: JSON.stringify(securityControlsData),
    "audit-reminders": JSON.stringify(auditReminders),
  }

  await page.setViewportSize({ width: 1440, height: 1200 })
  await page.context().addInitScript(() => {
    try {
      localStorage.setItem("language", "es")
      localStorage.setItem("theme", "light")
      localStorage.setItem("sidebarCollapsed", "false")
      document.documentElement.classList.remove("dark")
      document.documentElement.style.colorScheme = "light"
    } catch {}
  })

  await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" })
  await wait(1000)
  await page.evaluate((seed) => {
    localStorage.clear()
    sessionStorage.clear()
    Object.entries(seed).forEach(([key, value]) => localStorage.setItem(key, value))
  }, storageSeed)

  if (batch === "A") {
    await gotoAndWait("/registro-sistemas-ia", { text: "Panorama operativo", after: 1500 })
    await screenshot("05-registro-sistemas-ia-resumen.png")

    await gotoAndWait("/registro-sistemas-ia/con-terceros", {
      text: "Registro y seguimiento de sistemas externos",
      after: 1800,
    })
    await screenshot("06-registro-sistemas-ia-con-terceros.png")

    await gotoAndWait("/registro-sistemas-ia/propio", {
      text: "Gestión de desarrollos internos de IA",
      after: 1800,
    })
    await screenshot("07-registro-sistemas-ia-desarrollo-propio.png")

    await gotoAndWait("/incidentes-alto-riesgo", {
      text: ["Reportes de incidentes de alto riesgo", "Guardar reporte"],
      after: 1600,
    })
    await screenshot("08-incidentes-alto-riesgo-registrar.png")

    await clickByLabel("Ver reportes")
    await waitForAnyText(["Total de reportes", "Folio"])
    await wait(1200)
    await screenshot("09-incidentes-alto-riesgo-reportes.png")
    return "batch-a-ok"
  }

  if (batch === "B") {
    await gotoAndWait("/evaluacion-impacto-algoritmico", { text: "Nombre del proyecto", after: 1600 })
    await screenshot("10-evaluacion-impacto-algoritmico-registrar.png")

    await clickByLabel("Evaluaciones registradas")
    await waitForAnyText(["Sistema de scoring crediticio", "Puntuación:"])
    await wait(1200)
    await screenshot("11-evaluacion-impacto-algoritmico-historial.png")

    await gotoAndWait("/evaluacion-riesgos-pdp", { selector: "#systemName", after: 1600 })
    await screenshot("12-evaluacion-datos-personales-registrar.png")

    await clickByLabel("Evaluaciones guardadas")
    await waitForAnyText(["Copiloto de RRHH", "Evaluaciones Guardadas"])
    await wait(1200)
    await screenshot("13-evaluacion-datos-personales-guardadas.png")

    await gotoAndWait("/evaluacion-impacto-pi", { selector: "#projectName", after: 1600 })
    await screenshot("14-evaluacion-propiedad-intelectual-registrar.png")

    await clickByLabel(["Ver Evaluaciones Registradas", "Historial"])
    await waitForAnyText(["Asistente de redacción jurídica", "Evaluaciones Registradas"])
    await wait(1200)
    await screenshot("15-evaluacion-propiedad-intelectual-historial.png")

    await gotoAndWait("/evaluacion-riesgos-proveedores", { selector: "#supplierName", after: 1600 })
    await screenshot("16-evaluacion-proveedores-registrar.png")

    await clickByLabel("Evaluaciones guardadas")
    await waitForAnyText(["Proveedor VisionTech", "Evaluaciones guardadas", "Evaluaciones registradas"])
    await wait(1200)
    await screenshot("17-evaluacion-proveedores-guardadas.png")
    return "batch-b-ok"
  }

  if (batch === "C") {
    await gotoAndWait("/politicas-procesos-gobernanza", { text: "Formulario de Políticas", after: 1600 })
    await screenshot("18-politicas-procesos-gobernanza-registrar.png")

    await clickByLabel("Gestionar políticas")
    await waitForAnyText(["Política corporativa de uso responsable de IA", "Gestionar Políticas"])
    await wait(1200)
    await screenshot("19-politicas-procesos-gobernanza-gestionar.png")

    await gotoAndWait("/transparencia-explicabilidad", {
      text: ["Datos generales de la evaluación", "Checklist unificado de transparencia y explicabilidad"],
      after: 2000,
    })
    await screenshot("20-transparencia-explicabilidad-captura.png")

    await clickByLabel("Historial")
    await waitForAnyText(["Checklist transparencia Q2 2026", "Historial de evaluaciones"])
    await wait(1200)
    await screenshot("21-transparencia-explicabilidad-historial.png")

    await gotoAndWait("/concientizacion-entrenamiento-ia", { selector: "#courseName", after: 1600 })
    await screenshot("22-concientizacion-entrenamiento-ia-registrar.png")

    await clickByLabel("Capacitaciones registradas")
    await waitForAnyText(["Sesgos y decisiones automatizadas", "Capacitaciones registradas"])
    await wait(1200)
    await screenshot("23-concientizacion-entrenamiento-ia-capacitaciones.png")

    await gotoAndWait("/comite-gobernanza-ia", {
      text: ["Producto/Operación", "Registrar comité"],
      after: 1600,
    })
    await screenshot("24-comite-gobernanza-ia-registrar.png")

    await clickByLabel("Comités registrados")
    await waitForAnyText(["committee-001", "Comités registrados"])
    await wait(1200)
    await screenshot("25-comite-gobernanza-ia-comites-registrados.png")
    return "batch-c-ok"
  }

  if (batch === "D") {
    await gotoAndWait("/seguridad-entorno", { text: ["Registro de controles", "Gestión de controles"], after: 1600 })
    await screenshot("26-seguridad-entorno-controles-tecnicos.png")

    await clickByLabel("Gestión de controles")
    await waitForAnyText(["Buscar controles...", "Gestión de controles"])
    await wait(1200)
    await screenshot("27-seguridad-entorno-gestion-controles.png")

    await gotoAndWait("/auditoria", { text: "Indicadores de cumplimiento", after: 1700 })
    await screenshot("28-indicadores-cumplimiento-dashboard.png")

    await scrollTextToCenter("Recordatorios de Auditoría")
    await waitForText("Recordatorios de Auditoría")
    await wait(1200)
    await page.screenshot({ path: `${outDir}/29-indicadores-cumplimiento-recordatorios.png` })
    console.log("saved:29-indicadores-cumplimiento-recordatorios.png")

    await gotoAndWait("/alicia", { text: "Tu asistente legal con IA", after: 1800 })
    await screenshot("30-alicia.png")
    return "batch-d-ok"
  }

  throw new Error(`Batch no reconocido: ${batch}`)
}
