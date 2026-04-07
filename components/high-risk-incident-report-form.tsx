"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  HighRiskIncidentReport,
  IncidentReportStatus,
  MEXICAN_STATES,
} from "@/lib/high-risk-incident"

const autoridadOptions = [
  { value: "secretaria-anticorrupcion", label: "Secretaría Anticorrupción y Buen Gobierno (INAI)" },
  { value: "otro", label: "Otra autoridad" },
]

const tipoReporteOptions = [
  "Reporte Inicial",
  "Reporte de Seguimiento",
  "Reporte Final",
  "Reporte de Cierre (No Procedente)",
]

const gravedadOptions = [
  { value: "critico", label: "Riesgo inmediato a la vida humana" },
  { value: "grave_salud", label: "Daño significativo a la salud física o mental" },
  { value: "grave_derechos", label: "Violación a derechos fundamentales" },
  { value: "infraestructura_critica", label: "Afectación a servicios esenciales" },
  { value: "datos_personales", label: "Exposición o mal uso de datos personales sensibles" },
  { value: "impacto_economico", label: "Pérdidas económicas significativas" },
  { value: "medio_ambiente", label: "Daño ambiental" },
  { value: "otros", label: "Otros impactos reportables" },
]

const tipoResponsableOptions = [
  "Desarrollador/Proveedor del Sistema de IA",
  "Operador/Usuario del Sistema de IA",
  "Distribuidor/Comercializador",
  "Prestador de Servicios Tecnológicos",
  "Institución Gubernamental",
  "Institución Educativa/Investigación",
]

const tipoIAOptions = [
  "Aprendizaje Automático Supervisado",
  "Aprendizaje Automático No Supervisado",
  "Aprendizaje Profundo/Redes Neuronales",
  "Procesamiento de Lenguaje Natural",
  "Visión por Computadora",
  "Sistemas Expertos",
  "Robótica Inteligente",
  "Sistemas Híbridos",
  "Otros",
]

const sectorAplicacionOptions = [
  "Salud y Medicina",
  "Servicios Financieros",
  "Educación",
  "Seguridad Pública",
  "Transporte",
  "Comercio Electrónico",
  "Recursos Humanos",
  "Agricultura",
  "Manufactura",
  "Gobierno y Administración Pública",
  "Otros",
]

const frecuenciaUsoOptions = [
  "Uso Continuo (24/7)",
  "Uso Diario",
  "Uso Semanal",
  "Uso Mensual",
  "Uso Esporádico",
]

const nivelAutomatizacionOptions = [
  "Totalmente Automatizado",
  "Semi-automatizado con Supervisión Humana",
  "Asistencia a Decisión Humana",
  "Solo Recomendaciones",
]

const fallaDetectadaOptions = [
  "Resultado Incorrecto/Inexacto",
  "Decisión Discriminatoria o Sesgada",
  "Violación de Privacidad/Confidencialidad",
  "Falla de Seguridad/Ciberseguridad",
  "Comportamiento Impredecible",
  "Falla en Mecanismos de Control",
  "Manipulación o Uso Malicioso",
  "Error en Procesamiento de Datos",
  "Otros",
]

const tipoPersonasOptions = [
  "Menores de Edad",
  "Adultos Mayores",
  "Personas con Discapacidad",
  "Poblaciones Vulnerables",
  "Usuarios Finales Generales",
  "Empleados/Personal Interno",
  "Terceros/Público en General",
]

const causaProbableOptions = [
  "Datos de Entrenamiento Inadecuados/Sesgados",
  "Falla en el Algoritmo/Modelo",
  "Error en Implementación/Configuración",
  "Falta de Supervisión Humana Adecuada",
  "Uso Fuera del Propósito Diseñado",
  "Ataque Malicioso/Adversarial",
  "Falla de Hardware/Infraestructura",
  "Error Humano en Operación",
  "Cambios en el Entorno de Operación",
  "Causa Externa (no relacionada con IA)",
  "En Investigación",
]

const probabilidadRecurrenciaOptions = [
  "Muy Alta (>75%)",
  "Alta (50-75%)",
  "Media (25-50%)",
  "Baja (5-25%)",
  "Muy Baja (<5%)",
  "Nula (medidas implementadas lo previenen)",
]

const leyesAplicablesOptions = [
  "Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)",
  "Ley en Materia de Telecomunicaciones y Radiodifusión",
  "Ley Federal de Competencia Económica",
  "Ley Federal del Trabajo",
  "Código de Comercio",
  "Normas del Sector Salud",
  "Normatividad Financiera (CNBV)",
  "Ley de Protección a la Propiedad Industrial.",
  "Ley del Derecho de Autor",
  "Otras",
]

const frecuenciaSeguimientoOptions = [
  "Semanal",
  "Quincenal",
  "Mensual",
  "Trimestral",
  "Al completarse medidas correctivas",
]

const workflowStatus: IncidentReportStatus[] = ["Borrador", "Enviado", "En Revisión", "Cerrado"]

const generateHash = async (report: HighRiskIncidentReport) => {
  const data = JSON.stringify({
    ...report,
    metadata: { ...report.metadata, hashIntegridad: "" },
  })

  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(data)
    const digest = await window.crypto.subtle.digest("SHA-256", encoded)
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  let hash = 0
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(16)
}

interface HighRiskIncidentReportFormProps {
  report: HighRiskIncidentReport
  onChange: (report: HighRiskIncidentReport) => void
}

export default function HighRiskIncidentReportForm({ report, onChange }: HighRiskIncidentReportFormProps) {
  useEffect(() => {
    let isMounted = true
    const updateHash = async () => {
      const hash = await generateHash(report)
      if (isMounted && hash !== report.metadata.hashIntegridad) {
        onChange({ ...report, metadata: { ...report.metadata, hashIntegridad: hash } })
      }
    }

    updateHash()
    return () => {
      isMounted = false
    }
  }, [report, onChange])

  const updateAdministrative = (updates: Partial<HighRiskIncidentReport["administrative"]>) => {
    onChange({ ...report, administrative: { ...report.administrative, ...updates } })
  }

  const updateResponsible = (updates: Partial<HighRiskIncidentReport["responsible"]>) => {
    onChange({ ...report, responsible: { ...report.responsible, ...updates } })
  }

  const updateSystem = (updates: Partial<HighRiskIncidentReport["system"]>) => {
    onChange({ ...report, system: { ...report.system, ...updates } })
  }

  const updateIncident = (updates: Partial<HighRiskIncidentReport["incident"]>) => {
    onChange({ ...report, incident: { ...report.incident, ...updates } })
  }

  const updateResponse = (updates: Partial<HighRiskIncidentReport["response"]>) => {
    onChange({ ...report, response: { ...report.response, ...updates } })
  }

  const updateCompliance = (updates: Partial<HighRiskIncidentReport["compliance"]>) => {
    onChange({ ...report, compliance: { ...report.compliance, ...updates } })
  }

  const updateDeclaration = (updates: Partial<HighRiskIncidentReport["declaration"]>) => {
    onChange({ ...report, declaration: { ...report.declaration, ...updates } })
  }

  const toggleArrayValue = <T extends keyof HighRiskIncidentReport>(
    section: T,
    field: keyof HighRiskIncidentReport[T],
    value: string,
    checked: boolean,
  ) => {
    const currentValues = (report[section][field] as string[]) || []
    const updatedValues = checked
      ? Array.from(new Set([...currentValues, value]))
      : currentValues.filter((item) => item !== value)

    onChange({
      ...report,
      [section]: {
        ...report[section],
        [field]: updatedValues,
      },
    })
  }

  const handleFileUpload = (file: File | null) => {
    if (!file) {
      updateDeclaration({ firmaDigital: undefined, firmaDigitalNombre: undefined })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      updateDeclaration({ firmaDigital: base64, firmaDigitalNombre: file.name })
    }
    reader.readAsDataURL(file)
  }

  const followUpRequired = ["Reporte Inicial", "Reporte de Seguimiento"].includes(report.administrative.tipoReporte)
  const requiresDataExposure = report.administrative.clasificacionGravedad.includes("datos_personales")

  return (
    <div className="space-y-6">
      <Card className="border-[#01A79E]/40">
        <CardHeader>
          <CardTitle>Informe de Incidentes para Sistemas de IA de Alto Riesgo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-600">
          <p>
            Este formulario se activa para sistemas clasificados como de alto riesgo. Completa la información requerida
            para reportar incidentes que involucren impactos significativos.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1. Información Administrativa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Autoridad receptora *</Label>
              <select
                value={report.administrative.autoridadReceptora}
                onChange={(event) => updateAdministrative({ autoridadReceptora: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una autoridad</option>
                {autoridadOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Número de expediente</Label>
              <Input value={report.administrative.numeroExpediente} readOnly className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Entidad federativa *</Label>
              <select
                value={report.administrative.entidadFederativa}
                onChange={(event) => updateAdministrative({ entidadFederativa: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una entidad</option>
                {MEXICAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Fecha de reporte *</Label>
              <Input
                type="date"
                value={report.administrative.fechaReporte}
                onChange={(event) => updateAdministrative({ fechaReporte: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de inicio del incidente *</Label>
              <Input
                type="date"
                value={report.administrative.fechaIncidenteInicio}
                onChange={(event) => updateAdministrative({ fechaIncidenteInicio: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de finalización del incidente</Label>
              <Input
                type="date"
                value={report.administrative.fechaIncidenteFin || ""}
                onChange={(event) => updateAdministrative({ fechaIncidenteFin: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha y hora de detección *</Label>
              <Input
                type="datetime-local"
                value={report.administrative.fechaDeteccion}
                onChange={(event) => updateAdministrative({ fechaDeteccion: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de notificación interna *</Label>
              <Input
                type="date"
                value={report.administrative.fechaNotificacionInterna}
                onChange={(event) => updateAdministrative({ fechaNotificacionInterna: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de reporte *</Label>
              <select
                value={report.administrative.tipoReporte}
                onChange={(event) => updateAdministrative({ tipoReporte: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona un tipo de reporte</option>
                {tipoReporteOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {followUpRequired && (
              <div className="space-y-2">
                <Label>Fecha esperada del siguiente reporte *</Label>
                <Input
                  type="date"
                  value={report.administrative.fechaSeguimiento || ""}
                  onChange={(event) => updateAdministrative({ fechaSeguimiento: event.target.value })}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Clasificación de gravedad *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {gravedadOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gravedad-${option.value}`}
                    checked={report.administrative.clasificacionGravedad.includes(option.value)}
                    onCheckedChange={(checked) =>
                      toggleArrayValue("administrative", "clasificacionGravedad", option.value, checked === true)
                    }
                  />
                  <Label htmlFor={`gravedad-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Información del Responsable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de organización responsable *</Label>
              <select
                value={report.responsible.tipoResponsable}
                onChange={(event) => updateResponsible({ tipoResponsable: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona un tipo de organización</option>
                {tipoResponsableOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Razón social *</Label>
              <Input
                value={report.responsible.razonSocial}
                onChange={(event) => updateResponsible({ razonSocial: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>RFC *</Label>
              <Input
                value={report.responsible.rfc}
                onChange={(event) => updateResponsible({ rfc: event.target.value.toUpperCase() })}
                maxLength={13}
              />
            </div>
            <div className="space-y-2">
              <Label>Sector económico *</Label>
              <Input
                value={report.responsible.sectorEconomico}
                onChange={(event) => updateResponsible({ sectorEconomico: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Giro empresarial *</Label>
              <Input
                value={report.responsible.giroEmpresarial}
                onChange={(event) => updateResponsible({ giroEmpresarial: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre del responsable técnico *</Label>
              <Input
                value={report.responsible.responsableNombre}
                onChange={(event) => updateResponsible({ responsableNombre: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo del responsable técnico *</Label>
              <Input
                value={report.responsible.responsableCargo}
                onChange={(event) => updateResponsible({ responsableCargo: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Correo electrónico principal *</Label>
              <Input
                type="email"
                value={report.responsible.emailPrincipal}
                onChange={(event) => updateResponsible({ emailPrincipal: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Correo electrónico secundario</Label>
              <Input
                type="email"
                value={report.responsible.emailSecundario || ""}
                onChange={(event) => updateResponsible({ emailSecundario: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono de contacto *</Label>
              <Input
                type="tel"
                value={report.responsible.telefono}
                onChange={(event) => updateResponsible({ telefono: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Dirección completa *</Label>
              <Textarea
                value={report.responsible.direccionCompleta}
                onChange={(event) => updateResponsible({ direccionCompleta: event.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Sistema de Inteligencia Artificial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre del sistema *</Label>
              <Input
                value={report.system.nombreSistema}
                onChange={(event) => updateSystem({ nombreSistema: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Versión del sistema *</Label>
              <Input
                value={report.system.versionSistema}
                onChange={(event) => updateSystem({ versionSistema: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de IA *</Label>
              <select
                value={report.system.tipoIA}
                onChange={(event) => updateSystem({ tipoIA: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona un tipo</option>
                {tipoIAOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Sector de aplicación *</Label>
              <select
                value={report.system.sectorAplicacion}
                onChange={(event) => updateSystem({ sectorAplicacion: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona un sector</option>
                {sectorAplicacionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Propósito principal *</Label>
              <Textarea
                value={report.system.propositoPrincipal}
                onChange={(event) => updateSystem({ propositoPrincipal: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Datos de entrenamiento *</Label>
              <Textarea
                value={report.system.datosEntrenamiento}
                onChange={(event) => updateSystem({ datosEntrenamiento: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Usuarios estimados *</Label>
              <Input
                type="number"
                min={0}
                value={report.system.usuariosEstimados ?? ""}
                onChange={(event) =>
                  updateSystem({ usuariosEstimados: event.target.value === "" ? null : Number(event.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Frecuencia de uso *</Label>
              <select
                value={report.system.frecuenciaUso}
                onChange={(event) => updateSystem({ frecuenciaUso: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona la frecuencia</option>
                {frecuenciaUsoOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Nivel de automatización *</Label>
              <select
                value={report.system.nivelAutomatizacion}
                onChange={(event) => updateSystem({ nivelAutomatizacion: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona el nivel</option>
                {nivelAutomatizacionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Descripción del Incidente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Descripción del incidente *</Label>
            <Textarea
              value={report.incident.descripcionIncidente}
              onChange={(event) => updateIncident({ descripcionIncidente: event.target.value.slice(0, 2000) })}
              rows={5}
              maxLength={2000}
            />
          </div>
          <div className="space-y-2">
            <Label>Falla detectada *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {fallaDetectadaOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`falla-${option}`}
                    checked={report.incident.fallaDetectada.includes(option)}
                    onCheckedChange={(checked) =>
                      toggleArrayValue("incident", "fallaDetectada", option, checked === true)
                    }
                  />
                  <Label htmlFor={`falla-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Contexto de uso *</Label>
              <Textarea
                value={report.incident.contextoUso}
                onChange={(event) => updateIncident({ contextoUso: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Condiciones especiales</Label>
              <Textarea
                value={report.incident.condicionesEspeciales || ""}
                onChange={(event) => updateIncident({ condicionesEspeciales: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Personas afectadas *</Label>
              <Input
                type="number"
                min={0}
                value={report.incident.personasAfectadas ?? ""}
                onChange={(event) =>
                  updateIncident({ personasAfectadas: event.target.value === "" ? null : Number(event.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de personas afectadas *</Label>
              <div className="space-y-2">
                {tipoPersonasOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`personas-${option}`}
                      checked={report.incident.tipoPersonasAfectadas.includes(option)}
                      onCheckedChange={(checked) =>
                        toggleArrayValue("incident", "tipoPersonasAfectadas", option, checked === true)
                      }
                    />
                    <Label htmlFor={`personas-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Impacto económico (MXN)</Label>
              <Input
                type="number"
                min={0}
                value={report.incident.impactoEconomico ?? ""}
                onChange={(event) =>
                  updateIncident({ impactoEconomico: event.target.value === "" ? null : Number(event.target.value) })
                }
              />
            </div>
            {requiresDataExposure && (
              <div className="space-y-2">
                <Label>Datos comprometidos (registros) *</Label>
                <Input
                  type="number"
                  min={0}
                  value={report.incident.datosComprometidos ?? ""}
                  onChange={(event) =>
                    updateIncident({ datosComprometidos: event.target.value === "" ? null : Number(event.target.value) })
                  }
                />
              </div>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label>Servicios interrumpidos</Label>
              <Textarea
                value={report.incident.serviciosInterrumpidos || ""}
                onChange={(event) => updateIncident({ serviciosInterrumpidos: event.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Análisis de Causas y Medidas Correctivas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Causa probable *</Label>
              <select
                value={report.response.causaProbable}
                onChange={(event) => updateResponse({ causaProbable: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona la causa probable</option>
                {causaProbableOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Análisis de causa raíz *</Label>
              <Textarea
                value={report.response.analisisCausaRaiz}
                onChange={(event) => updateResponse({ analisisCausaRaiz: event.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Factores contribuyentes</Label>
              <Textarea
                value={report.response.factoresContribuyentes || ""}
                onChange={(event) => updateResponse({ factoresContribuyentes: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Medidas inmediatas implementadas *</Label>
              <Textarea
                value={report.response.medidasInmediatas}
                onChange={(event) => updateResponse({ medidasInmediatas: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Medidas a corto plazo (1-3 meses)</Label>
              <Textarea
                value={report.response.medidasCortoPlazo || ""}
                onChange={(event) => updateResponse({ medidasCortoPlazo: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Medidas a largo plazo (&gt;3 meses)</Label>
              <Textarea
                value={report.response.medidasLargoPlazo || ""}
                onChange={(event) => updateResponse({ medidasLargoPlazo: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>¿Se suspendió temporalmente el sistema? *</Label>
              <select
                value={report.response.sistemaSuspendido}
                onChange={(event) => updateResponse({ sistemaSuspendido: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Mejoras planificadas</Label>
              <Textarea
                value={report.response.mejorasPlanificadas || ""}
                onChange={(event) => updateResponse({ mejorasPlanificadas: event.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Evaluación de Riesgos y Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>¿Se revisó la evaluación de riesgos? *</Label>
              <select
                value={report.compliance.evaluacionRevisada}
                onChange={(event) => updateCompliance({ evaluacionRevisada: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            {report.compliance.evaluacionRevisada === "si" && (
              <div className="space-y-2">
                <Label>¿La evaluación sigue siendo adecuada? *</Label>
                <select
                  value={report.compliance.evaluacionAdecuada || ""}
                  onChange={(event) => updateCompliance({ evaluacionAdecuada: event.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Probabilidad de recurrencia *</Label>
              <select
                value={report.compliance.probabilidadRecurrencia}
                onChange={(event) => updateCompliance({ probabilidadRecurrencia: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una opción</option>
                {probabilidadRecurrenciaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Nuevos riesgos identificados</Label>
              <Textarea
                value={report.compliance.nuevosRiesgosIdentificados || ""}
                onChange={(event) => updateCompliance({ nuevosRiesgosIdentificados: event.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Leyes o normas aplicables *</Label>
              <div className="space-y-2">
                {leyesAplicablesOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ley-${option}`}
                      checked={report.compliance.leyesAplicables.includes(option)}
                      onCheckedChange={(checked) =>
                        toggleArrayValue("compliance", "leyesAplicables", option, checked === true)
                      }
                    />
                    <Label htmlFor={`ley-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>¿Se reportó a otras autoridades? *</Label>
              <select
                value={report.compliance.otrosReportes}
                onChange={(event) => updateCompliance({ otrosReportes: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            {report.compliance.otrosReportes === "si" && (
              <div className="space-y-2 md:col-span-2">
                <Label>Autoridades notificadas *</Label>
                <Textarea
                  value={report.compliance.autoridadesNotificadas || ""}
                  onChange={(event) => updateCompliance({ autoridadesNotificadas: event.target.value })}
                  rows={3}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Declaración y Compromisos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre del declarante *</Label>
              <Input
                value={report.declaration.nombreDeclarante}
                onChange={(event) => updateDeclaration({ nombreDeclarante: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo del declarante *</Label>
              <Input
                value={report.declaration.cargoDeclarante}
                onChange={(event) => updateDeclaration({ cargoDeclarante: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Firma electrónica avanzada (FIEL) *</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  type="file"
                  accept=".cer,.key,.pfx,.pdf,.zip"
                  onChange={(event) => handleFileUpload(event.target.files?.[0] || null)}
                />
                {report.declaration.firmaDigital && report.declaration.firmaDigitalNombre && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = report.declaration.firmaDigital || ""
                      link.download = report.declaration.firmaDigitalNombre || "firma"
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                  >
                    Descargar firma
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Fecha de declaración</Label>
              <Input value={report.declaration.fechaDeclaracion} readOnly className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>¿Se compromete a dar seguimiento? *</Label>
              <select
                value={report.declaration.compromisoSeguimiento}
                onChange={(event) => updateDeclaration({ compromisoSeguimiento: event.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            {report.declaration.compromisoSeguimiento === "si" && (
              <>
                <div className="space-y-2">
                  <Label>Frecuencia de seguimiento *</Label>
                  <select
                    value={report.declaration.frecuenciaSeguimiento || ""}
                    onChange={(event) => updateDeclaration({ frecuenciaSeguimiento: event.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecciona una frecuencia</option>
                    {frecuenciaSeguimientoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Contacto para seguimiento *</Label>
                  <Input
                    value={report.declaration.contactoSeguimiento || ""}
                    onChange={(event) => updateDeclaration({ contactoSeguimiento: event.target.value })}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Número de folio</Label>
            <Input value={report.metadata.folioNumber} readOnly className="bg-gray-100" />
          </div>
          <div className="space-y-2">
            <Label>Fecha de generación</Label>
            <Input
              value={new Date(report.metadata.fechaGeneracion).toLocaleString()}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label>Estado del reporte</Label>
            <select
              value={report.metadata.estadoReporte}
              onChange={(event) =>
                onChange({
                  ...report,
                  metadata: { ...report.metadata, estadoReporte: event.target.value as IncidentReportStatus },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {workflowStatus.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Hash de integridad</Label>
            <Textarea value={report.metadata.hashIntegridad} readOnly rows={2} className="bg-gray-100" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
