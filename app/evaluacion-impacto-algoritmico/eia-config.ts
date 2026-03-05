// Section definitions for the EIA form
export const sectionDefinitions = [
    {
        id: "descripcion",
        number: 1,
        title: "DESCRIPCIÓN DEL PROYECTO Y DEL SISTEMA DE IA",
        subtitle: "Contexto general, objetivo, alcance y entorno de implementación",
    },
    {
        id: "identificacion",
        number: 2,
        title: "IDENTIFICACIÓN Y CLASIFICACIÓN",
        subtitle: "Fase del ciclo de vida, alcance de despliegue e interacción",
    },
    {
        id: "proposito",
        number: 3,
        title: "PROPÓSITO Y ALCANCE",
        subtitle: "Objetivo principal, casos de uso y poblaciones afectadas",
    },
    {
        id: "datos",
        number: 4,
        title: "DATOS Y PRIVACIDAD",
        subtitle: "Tipos de datos, origen, minimización y pseudonimización",
    },
    {
        id: "legitimacion",
        number: 5,
        title: "LEGITIMACIÓN Y DERECHOS",
        subtitle: "Base jurídica, transparencia y mecanismos de derechos",
    },
    {
        id: "modelo",
        number: 6,
        title: "MODELO Y CALIDAD TÉCNICA",
        subtitle: "Tipo de sistema, métricas de rendimiento, sesgo y explicabilidad",
    },
    {
        id: "supervision",
        number: 7,
        title: "SUPERVISIÓN Y GOBERNANZA",
        subtitle: "Nivel de autonomía, supervisión humana y registro de decisiones",
    },
    {
        id: "seguridad",
        number: 8,
        title: "SEGURIDAD",
        subtitle: "Controles de seguridad, vulnerabilidades y riesgos de fuga",
    },
    {
        id: "terceros",
        number: 9,
        title: "TERCEROS Y PROVEEDORES",
        subtitle: "Rol de terceros y cláusulas contractuales",
    },
    {
        id: "monitoreo",
        number: 10,
        title: "MONITOREO Y REPORTING",
        subtitle: "KPIs, frecuencia de revisión e informes al comité",
    },
    {
        id: "transparencia",
        number: 11,
        title: "TRANSPARENCIA Y REGISTRO",
        subtitle: "Registro de transparencia y contenido publicado",
    },
    {
        id: "impacto",
        number: 12,
        title: "EVALUACIÓN DE IMPACTO Y EVIDENCIAS",
        subtitle: "Nivel de impacto, razones, acciones de mitigación y documentación",
    },
]

export const standardsBadges = [
    { label: "ISO/IEC 42001:2023", desc: "Gobernanza de IA" },
    { label: "EU AI Act", desc: "Regulamento Europeo" },
    { label: "NIST AI RMF", desc: "Risk Mgmt. Framework" },
    { label: "OCDE / UNESCO", desc: "IA Responsable" },
]

export const usageInstructions = [
    "Responda cada pregunta con la información más precisa posible. La calidad de la EIA depende de la exactitud y honestidad de las respuestas.",
    'Las preguntas marcadas con asterisco naranja son **obligatorias** para la validez de la evaluación.',
    "Adjunte la documentación de soporte pertinente (arquitectura técnica, resultados de pruebas, políticas de datos, contratos).",
    'Si alguna pregunta no resulta aplicable, indique "N/A" y explique brevemente el motivo.',
    "Esta EIA debe revisarse ante cambios significativos en el sistema o en la normatividad aplicable, y como mínimo una vez al año.",
    "El símbolo 📋 Ref. indica el estándar o marco normativo que sustenta cada pregunta.",
]

export const useCaseOptions = [
    { value: "atencion-cliente", label: "Atención al cliente" },
    { value: "rrhh", label: "Recursos Humanos" },
    { value: "marketing", label: "Marketing / personalización" },
    { value: "riesgo-finanzas", label: "Riesgo / Finanzas" },
    { value: "salud", label: "Salud" },
    { value: "seguridad-fraude", label: "Seguridad / Fraude" },
    { value: "servicios-publicos", label: "Servicios públicos" },
    { value: "legal-compliance", label: "Legal / Compliance" },
    { value: "operaciones-logistica", label: "Operaciones / Logística" },
    { value: "otro", label: "Otro" },
]

export const populationOptions = [
    { value: "empleados", label: "Empleados" },
    { value: "clientes-usuarios", label: "Clientes / Usuarios" },
    { value: "publico-general", label: "Público general" },
    { value: "proveedores", label: "Proveedores" },
    { value: "otro", label: "Otro" },
]

export const personalDataCategoryOptions = [
    { value: "identificativos", label: "Identificativos" },
    { value: "contacto", label: "Contacto" },
    { value: "financieros", label: "Financieros" },
    { value: "salud", label: "Salud" },
    { value: "biometricos", label: "Biométricos" },
    { value: "menores", label: "Menores" },
    { value: "comportamiento", label: "Comportamiento/uso" },
    { value: "geolocalizacion", label: "Geolocalización" },
    { value: "otro", label: "Otro" },
]

export const dataOriginOptions = [
    { value: "recogidos-interesado", label: "Recogidos del interesado" },
    { value: "generados-internamente", label: "Generados internamente" },
    { value: "proveedores-externos", label: "Proveedores externos" },
    { value: "datos-publicos", label: "Datos públicos/abiertos" },
    { value: "sinteticos", label: "Sintéticos" },
    { value: "otro", label: "Otro" },
]

export const explainabilityOptions = [
    { value: "shap-lime", label: "SHAP / LIME" },
    { value: "interpretabilidad-inherente", label: "Interpretabilidad inherente" },
    { value: "paneles-explicacion", label: "Paneles de explicación" },
    { value: "documentacion-tecnica", label: "Documentación técnica" },
    { value: "otro", label: "Otro" },
]

export const securityControlOptions = [
    { value: "cifrado", label: "Cifrado en tránsito y reposo" },
    { value: "control-acceso", label: "Control de acceso basado en roles" },
    { value: "logs-auditoria", label: "Logs de auditoría" },
    { value: "pentesting", label: "Pentesting periódico" },
    { value: "adversarial-robustness", label: "Robustez adversarial" },
    { value: "otro", label: "Otro" },
]

export const thirdPartyRoleOptions = [
    { value: "desarrollo", label: "Desarrollo del modelo" },
    { value: "infraestructura", label: "Infraestructura / hosting" },
    { value: "datos", label: "Proveedor de datos" },
    { value: "integracion", label: "Integración" },
    { value: "otro", label: "Otro" },
]

export const registryContentOptions = [
    { value: "proposito", label: "Propósito del sistema" },
    { value: "datos-utilizados", label: "Datos utilizados" },
    { value: "logica-decisional", label: "Lógica decisional (alto nivel)" },
    { value: "metricas", label: "Métricas de rendimiento" },
    { value: "contacto", label: "Contacto del responsable" },
    { value: "otro", label: "Otro" },
]

export const impactReasonOptions = [
    { value: "datos-sensibles", label: "Datos sensibles/biométricos" },
    { value: "menores-vulnerables", label: "Menores/grupos vulnerables" },
    { value: "efectos-legales", label: "Decisiones con efectos legales" },
    { value: "escala", label: "Escala (volumen/frecuencia)" },
    { value: "entorno-sensible", label: "Entorno sensible (salud/finanzas/empleo/público)" },
    { value: "otro", label: "Otro" },
]

export const mitigationActionOptions = [
    { value: "eipd-dpia", label: "EIPD/DPIA completa" },
    { value: "pruebas-sesgo", label: "Pruebas de sesgo reforzadas" },
    { value: "supervision-humana", label: "Aumentar supervisión humana" },
    { value: "explicabilidad", label: "Mejorar explicabilidad" },
    { value: "seguridad", label: "Fortalecer seguridad/response" },
    { value: "contratos", label: "Revisar contratos" },
    { value: "otro", label: "Otro" },
]

export const documentationOptions = [
    { value: "politicas", label: "Políticas" },
    { value: "model-dataset-cards", label: "Model/Dataset cards" },
    { value: "arquitectura", label: "Arquitectura" },
    { value: "manual-usuario", label: "Manual de usuario" },
    { value: "resultados-pruebas", label: "Resultados de pruebas (sesgo/robustez)" },
    { value: "plan-incidentes", label: "Plan de incidentes" },
    { value: "contratos-dpa", label: "Contratos/DPA" },
    { value: "otro", label: "Otro" },
]
