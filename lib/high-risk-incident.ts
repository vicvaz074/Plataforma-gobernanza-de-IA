export type IncidentReportStatus = "Borrador" | "Enviado" | "En Revisión" | "Cerrado"

export interface HighRiskIncidentReport {
  administrative: {
    autoridadReceptora: string
    numeroExpediente: string
    entidadFederativa: string
    fechaReporte: string
    fechaIncidenteInicio: string
    fechaIncidenteFin?: string
    fechaDeteccion: string
    fechaNotificacionInterna: string
    tipoReporte: string
    fechaSeguimiento?: string
    clasificacionGravedad: string[]
  }
  responsible: {
    tipoResponsable: string
    razonSocial: string
    rfc: string
    sectorEconomico: string
    giroEmpresarial: string
    responsableNombre: string
    responsableCargo: string
    emailPrincipal: string
    emailSecundario?: string
    telefono: string
    direccionCompleta: string
  }
  system: {
    nombreSistema: string
    versionSistema: string
    tipoIA: string
    propositoPrincipal: string
    sectorAplicacion: string
    datosEntrenamiento: string
    usuariosEstimados: number | null
    frecuenciaUso: string
    nivelAutomatizacion: string
  }
  incident: {
    descripcionIncidente: string
    fallaDetectada: string[]
    contextoUso: string
    condicionesEspeciales?: string
    personasAfectadas: number | null
    tipoPersonasAfectadas: string[]
    impactoEconomico?: number | null
    datosComprometidos?: number | null
    serviciosInterrumpidos?: string
  }
  response: {
    causaProbable: string
    analisisCausaRaiz: string
    factoresContribuyentes?: string
    medidasInmediatas: string
    medidasCortoPlazo?: string
    medidasLargoPlazo?: string
    sistemaSuspendido: string
    mejorasPlanificadas?: string
  }
  compliance: {
    evaluacionRevisada: string
    evaluacionAdecuada?: string
    nuevosRiesgosIdentificados?: string
    probabilidadRecurrencia: string
    leyesAplicables: string[]
    otrosReportes: string
    autoridadesNotificadas?: string
  }
  declaration: {
    nombreDeclarante: string
    cargoDeclarante: string
    firmaDigital?: string
    firmaDigitalNombre?: string
    fechaDeclaracion: string
    compromisoSeguimiento: string
    frecuenciaSeguimiento?: string
    contactoSeguimiento?: string
  }
  metadata: {
    folioNumber: string
    fechaGeneracion: string
    estadoReporte: IncidentReportStatus
    hashIntegridad: string
  }
}

const mexicanStates = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Coahuila",
  "Colima",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
]

export const MEXICAN_STATES = mexicanStates

export const createEmptyHighRiskIncidentReport = (): HighRiskIncidentReport => {
  const timestamp = Date.now()
  const isoNow = new Date(timestamp).toISOString()

  return {
    administrative: {
      autoridadReceptora: "",
      numeroExpediente: `EXP-${timestamp}`,
      entidadFederativa: "",
      fechaReporte: "",
      fechaIncidenteInicio: "",
      fechaIncidenteFin: "",
      fechaDeteccion: "",
      fechaNotificacionInterna: "",
      tipoReporte: "",
      fechaSeguimiento: "",
      clasificacionGravedad: [],
    },
    responsible: {
      tipoResponsable: "",
      razonSocial: "",
      rfc: "",
      sectorEconomico: "",
      giroEmpresarial: "",
      responsableNombre: "",
      responsableCargo: "",
      emailPrincipal: "",
      emailSecundario: "",
      telefono: "",
      direccionCompleta: "",
    },
    system: {
      nombreSistema: "",
      versionSistema: "",
      tipoIA: "",
      propositoPrincipal: "",
      sectorAplicacion: "",
      datosEntrenamiento: "",
      usuariosEstimados: null,
      frecuenciaUso: "",
      nivelAutomatizacion: "",
    },
    incident: {
      descripcionIncidente: "",
      fallaDetectada: [],
      contextoUso: "",
      condicionesEspeciales: "",
      personasAfectadas: null,
      tipoPersonasAfectadas: [],
      impactoEconomico: null,
      datosComprometidos: null,
      serviciosInterrumpidos: "",
    },
    response: {
      causaProbable: "",
      analisisCausaRaiz: "",
      factoresContribuyentes: "",
      medidasInmediatas: "",
      medidasCortoPlazo: "",
      medidasLargoPlazo: "",
      sistemaSuspendido: "",
      mejorasPlanificadas: "",
    },
    compliance: {
      evaluacionRevisada: "",
      evaluacionAdecuada: "",
      nuevosRiesgosIdentificados: "",
      probabilidadRecurrencia: "",
      leyesAplicables: [],
      otrosReportes: "",
      autoridadesNotificadas: "",
    },
    declaration: {
      nombreDeclarante: "",
      cargoDeclarante: "",
      firmaDigital: undefined,
      firmaDigitalNombre: undefined,
      fechaDeclaracion: isoNow.split("T")[0],
      compromisoSeguimiento: "",
      frecuenciaSeguimiento: "",
      contactoSeguimiento: "",
    },
    metadata: {
      folioNumber: `FOL-${timestamp}`,
      fechaGeneracion: isoNow,
      estadoReporte: "Borrador",
      hashIntegridad: "",
    },
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/

const sanitizeNumber = (value: number | null | undefined) =>
  typeof value === "number" && !Number.isNaN(value) ? value : null

export const validateHighRiskIncidentReport = (report: HighRiskIncidentReport): string[] => {
  const errors: string[] = []

  const followUpRequired = ["Reporte Inicial", "Reporte de Seguimiento"].includes(report.administrative.tipoReporte)
  const severityRequiresData = report.administrative.clasificacionGravedad.includes("datos_personales")

  if (!report.administrative.autoridadReceptora) {
    errors.push("Selecciona la autoridad receptora responsable.")
  }
  if (!report.administrative.entidadFederativa) {
    errors.push("Selecciona la entidad federativa del incidente.")
  }
  if (!report.administrative.fechaReporte) {
    errors.push("Indica la fecha de presentación del reporte.")
  }
  if (!report.administrative.fechaIncidenteInicio) {
    errors.push("Indica la fecha de inicio del incidente.")
  }
  if (!report.administrative.fechaDeteccion) {
    errors.push("Registra la fecha y hora de detección del incidente.")
  }
  if (!report.administrative.fechaNotificacionInterna) {
    errors.push("Registra la fecha de notificación interna.")
  }
  if (!report.administrative.tipoReporte) {
    errors.push("Selecciona el tipo de reporte que se presenta.")
  }
  if (followUpRequired && !report.administrative.fechaSeguimiento) {
    errors.push("Define la fecha esperada del siguiente reporte.")
  }
  if (report.administrative.clasificacionGravedad.length === 0) {
    errors.push("Selecciona al menos una clasificación de gravedad.")
  }

  const startDate = report.administrative.fechaIncidenteInicio
    ? new Date(`${report.administrative.fechaIncidenteInicio}T00:00:00`)
    : null
  const detectionDate = report.administrative.fechaDeteccion
    ? new Date(report.administrative.fechaDeteccion)
    : null
  if (startDate && detectionDate && startDate > detectionDate) {
    errors.push("La fecha de inicio del incidente no puede ser posterior a la fecha de detección.")
  }
  const endDate = report.administrative.fechaIncidenteFin
    ? new Date(`${report.administrative.fechaIncidenteFin}T00:00:00`)
    : null
  if (startDate && endDate && endDate < startDate) {
    errors.push("La fecha de finalización no puede ser anterior al inicio del incidente.")
  }

  if (!report.responsible.tipoResponsable) {
    errors.push("Selecciona el tipo de organización responsable.")
  }
  if (!report.responsible.razonSocial) {
    errors.push("Indica la razón social completa de la organización responsable.")
  }
  if (!report.responsible.rfc || !rfcRegex.test(report.responsible.rfc.toUpperCase())) {
    errors.push("Proporciona un RFC válido conforme al formato del SAT.")
  }
  if (!report.responsible.sectorEconomico) {
    errors.push("Selecciona el sector económico de la organización.")
  }
  if (!report.responsible.giroEmpresarial) {
    errors.push("Describe el giro empresarial de la organización.")
  }
  if (!report.responsible.responsableNombre) {
    errors.push("Indica el nombre completo del responsable técnico.")
  }
  if (!report.responsible.responsableCargo) {
    errors.push("Indica el cargo del responsable técnico.")
  }
  if (!report.responsible.emailPrincipal || !emailRegex.test(report.responsible.emailPrincipal)) {
    errors.push("Proporciona un correo electrónico principal válido.")
  }
  if (report.responsible.emailSecundario && !emailRegex.test(report.responsible.emailSecundario)) {
    errors.push("El correo electrónico secundario no tiene un formato válido.")
  }
  const phoneDigits = report.responsible.telefono.replace(/\D/g, "")
  if (!report.responsible.telefono || phoneDigits.length < 10) {
    errors.push("Registra un teléfono de contacto con al menos 10 dígitos.")
  }
  if (!report.responsible.direccionCompleta) {
    errors.push("Captura la dirección completa de la organización.")
  }

  if (!report.system.nombreSistema) {
    errors.push("Indica el nombre del sistema de IA involucrado.")
  }
  if (!report.system.versionSistema) {
    errors.push("Indica la versión del sistema de IA.")
  }
  if (!report.system.tipoIA) {
    errors.push("Selecciona el tipo de sistema de IA.")
  }
  if (!report.system.propositoPrincipal) {
    errors.push("Describe el propósito principal del sistema.")
  }
  if (!report.system.sectorAplicacion) {
    errors.push("Selecciona el sector de aplicación del sistema.")
  }
  if (!report.system.datosEntrenamiento) {
    errors.push("Describe los datos de entrenamiento utilizados.")
  }
  const usuarios = sanitizeNumber(report.system.usuariosEstimados)
  if (usuarios === null || usuarios < 0) {
    errors.push("Indica el número estimado de usuarios del sistema.")
  }
  if (!report.system.frecuenciaUso) {
    errors.push("Selecciona la frecuencia de uso del sistema.")
  }
  if (!report.system.nivelAutomatizacion) {
    errors.push("Selecciona el nivel de automatización del sistema.")
  }

  if (!report.incident.descripcionIncidente) {
    errors.push("Describe el incidente ocurrido.")
  }
  if (report.incident.fallaDetectada.length === 0) {
    errors.push("Selecciona al menos un tipo de falla detectada.")
  }
  if (!report.incident.contextoUso) {
    errors.push("Describe el contexto de uso durante el incidente.")
  }
  const personas = sanitizeNumber(report.incident.personasAfectadas)
  if (personas === null || personas < 0) {
    errors.push("Indica el número de personas afectadas.")
  }
  if (report.incident.tipoPersonasAfectadas.length === 0) {
    errors.push("Selecciona el tipo de personas afectadas.")
  }
  const datosComprometidos = sanitizeNumber(report.incident.datosComprometidos)
  if (severityRequiresData && (datosComprometidos === null || datosComprometidos < 0)) {
    errors.push("Indica el número de registros comprometidos por la exposición de datos personales.")
  }
  const impactoEconomico = sanitizeNumber(report.incident.impactoEconomico)
  if (impactoEconomico !== null && impactoEconomico < 0) {
    errors.push("El impacto económico no puede ser negativo.")
  }

  if (!report.response.causaProbable) {
    errors.push("Selecciona la causa probable del incidente.")
  }
  if (!report.response.analisisCausaRaiz) {
    errors.push("Proporciona el análisis de causa raíz.")
  }
  if (!report.response.medidasInmediatas) {
    errors.push("Describe las medidas correctivas inmediatas.")
  }
  if (!report.response.sistemaSuspendido) {
    errors.push("Indica si el sistema fue suspendido temporalmente.")
  }

  if (!report.compliance.evaluacionRevisada) {
    errors.push("Indica si se revisó la evaluación de riesgos.")
  }
  if (
    report.compliance.evaluacionRevisada === "si" &&
    !report.compliance.evaluacionAdecuada
  ) {
    errors.push("Confirma si la evaluación actual sigue siendo adecuada tras la revisión.")
  }
  if (!report.compliance.probabilidadRecurrencia) {
    errors.push("Selecciona la probabilidad estimada de recurrencia.")
  }
  if (report.compliance.leyesAplicables.length === 0) {
    errors.push("Selecciona al menos una ley o norma aplicable.")
  }
  if (!report.compliance.otrosReportes) {
    errors.push("Indica si se notificó a otras autoridades.")
  }
  if (report.compliance.otrosReportes === "si" && !report.compliance.autoridadesNotificadas) {
    errors.push("Especifica las autoridades a las que se notificó.")
  }

  if (!report.declaration.nombreDeclarante) {
    errors.push("Proporciona el nombre completo del declarante.")
  }
  if (!report.declaration.cargoDeclarante) {
    errors.push("Proporciona el cargo del declarante.")
  }
  if (!report.declaration.firmaDigital) {
    errors.push("Adjunta la firma electrónica avanzada del declarante.")
  }
  if (!report.declaration.compromisoSeguimiento) {
    errors.push("Indica si se compromete a enviar reportes de seguimiento.")
  }
  if (
    report.declaration.compromisoSeguimiento === "si" &&
    (!report.declaration.frecuenciaSeguimiento || !report.declaration.contactoSeguimiento)
  ) {
    errors.push("Define la frecuencia y persona de contacto para el seguimiento.")
  }

  return errors
}
