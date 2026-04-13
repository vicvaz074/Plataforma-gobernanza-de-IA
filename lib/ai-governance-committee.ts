export const AI_GOVERNANCE_STORAGE_KEY = "aiGovernanceCommittees"
export const AI_GOVERNANCE_AUTOSAVE_KEY = "aiGovernanceCommitteeDraft"
export const AI_GOVERNANCE_STORAGE_VERSION = 2

export type CommitteeStatus = "active" | "inactive"
export type CommitteeViewId =
  | "dashboard"
  | "constitution"
  | "members"
  | "sessions"
  | "oversight"
  | "reports"
  | "repository"

export type CommitteeMemberRole = "president" | "vicePresident" | "secretary" | "vocal" | "observer"
export type CommitteeMemberStatus = "active" | "substitute" | "inactive"
export type CommitteeSessionStatus = "draft" | "convened" | "held" | "cancelled"
export type CommitteeAgreementStatus = "pending" | "in_progress" | "overdue" | "completed"
export type CommitteePriority = "critical" | "high" | "medium" | "low"
export type CommitteeDocumentClassification = "internal" | "confidential" | "public"

export interface CommitteeStoredDocument {
  name: string
  data: string
}

export interface CommitteeLegacyDocuments {
  formalDocument?: CommitteeStoredDocument
  foundingDocument?: CommitteeStoredDocument
  frameworkDocument?: CommitteeStoredDocument
  rolesDocument?: CommitteeStoredDocument
  rolesApprovedDocument?: CommitteeStoredDocument
  missionDocument?: CommitteeStoredDocument
}

export interface CommitteeMember {
  id: string
  fullName: string
  position: string
  area: string
  email: string
  phone: string
  company: string
  membershipType: CommitteeMemberRole
  mandateStart: string
  mandateEnd: string
  status: CommitteeMemberStatus
  isExternal: boolean
}

export interface CommitteeSession {
  id: string
  title: string
  type: "ordinary" | "extraordinary"
  date: string
  time: string
  modality: string
  venue: string
  quorumRequired: string
  quorumAchieved: boolean
  status: CommitteeSessionStatus
  minutesSigned: boolean
}

export interface CommitteeAgreement {
  id: string
  title: string
  description: string
  responsible: string[]
  dueDate: string
  priority: CommitteePriority
  status: CommitteeAgreementStatus
  relatedSystemId?: string
}

export interface CommitteeReport {
  id: string
  type: string
  frequency: string
  generatedAt: string
  generatedBy: string
  format: "pdf" | "xlsx"
}

export interface CommitteeRepositoryDocument {
  id: string
  type: string
  name: string
  version: string
  classification: CommitteeDocumentClassification
  uploadedAt: string
  uploadedBy: string
  retentionUntil: string
  sourceField?: keyof CommitteeLegacyDocuments
  data?: string
}

export interface CommitteeOrganizationProfile {
  legalName: string
  address: string
  city: string
  country: string
  taxId: string
  legalRepresentative: string
}

export interface CommitteeDocumentMeta {
  committeeName: string
  classification: CommitteeDocumentClassification
  referenceCode: string
  documentVersion: string
  constitutionDate: string
  author: string
  owner: string
}

export interface CommitteeSessionRegime {
  meetingFrequency: string
  noticeDays: string
  agendaLeadDays: string
  modalities: string[]
  quorumRequired: string
}

export interface CommitteeModuleRecord {
  id: string
  version: number
  status: CommitteeStatus
  storageVersion: number
  committeeName: string
  createdAt: string
  lastModified: string

  committeeMembers: string[]
  otherMembers: string
  rolesDocumented: string
  rolesApproved: string
  organizationalLevel: string
  missionDefined: string
  agendaDetermination: string
  meetingFrequency: string
  committeeFunctions: string
  otherFunctions: string
  reviewsInitiatives: string
  validatesDataPolicies: string
  definesProcesses: string
  promotesCulture: string
  establishesKPIs: string
  communicatesInternally: string
  reportsToManagement: string
  formedBasedOnFrameworks: string
  periodicReview: string
  constitutionDate: string
  authorizingAuthority: string
  otherAuthority: string
  foundingMembers: string
  formalDocumentSigned: string
  validityDefined: string
  documents: CommitteeLegacyDocuments

  organization: CommitteeOrganizationProfile
  documentMeta: CommitteeDocumentMeta
  legalBasis: string[]
  functionCategories: string[]
  sessionRegime: CommitteeSessionRegime
  members: CommitteeMember[]
  sessions: CommitteeSession[]
  agreements: CommitteeAgreement[]
  reports: CommitteeReport[]
  repository: CommitteeRepositoryDocument[]
}

export interface CommitteeDraftSnapshot {
  record: CommitteeModuleRecord
  wizardStep: number
  editingCommitteeId: string | null
  activeCommitteeId: string | null
}

type UnknownRecord = Record<string, unknown>

const LEGACY_DOCUMENT_TYPES: Record<keyof CommitteeLegacyDocuments, string> = {
  formalDocument: "Acta formal",
  foundingDocument: "Acta de constitucion",
  frameworkDocument: "Marco normativo",
  rolesDocument: "Roles documentados",
  rolesApprovedDocument: "Aprobacion de roles",
  missionDocument: "Mision del comite",
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function asObject(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {}
}

function normalizeLegacyDocuments(value: unknown): CommitteeLegacyDocuments {
  const obj = asObject(value)
  const documents: CommitteeLegacyDocuments = {}

  for (const key of Object.keys(LEGACY_DOCUMENT_TYPES) as Array<keyof CommitteeLegacyDocuments>) {
    const candidate = asObject(obj[key])
    if (candidate.name && candidate.data) {
      documents[key] = {
        name: asString(candidate.name),
        data: asString(candidate.data),
      }
    }
  }

  return documents
}

function normalizeMemberRole(value: unknown): CommitteeMemberRole {
  const role = asString(value).toLowerCase()
  if (role === "president" || role === "secretary" || role === "vocal" || role === "observer") {
    return role as CommitteeMemberRole
  }
  if (role === "vicepresident") return "vicePresident"
  return "vocal"
}

function normalizeMemberStatus(value: unknown): CommitteeMemberStatus {
  const status = asString(value).toLowerCase()
  if (status === "active" || status === "substitute" || status === "inactive") return status as CommitteeMemberStatus
  return "active"
}

function normalizeCommitteeMember(value: unknown, index: number): CommitteeMember {
  const obj = asObject(value)
  return {
    id: asString(obj.id, `member-${index + 1}`),
    fullName: asString(obj.fullName),
    position: asString(obj.position),
    area: asString(obj.area),
    email: asString(obj.email),
    phone: asString(obj.phone),
    company: asString(obj.company),
    membershipType: normalizeMemberRole(obj.membershipType),
    mandateStart: asString(obj.mandateStart),
    mandateEnd: asString(obj.mandateEnd),
    status: normalizeMemberStatus(obj.status),
    isExternal: Boolean(obj.isExternal),
  }
}

function normalizeSessionStatus(value: unknown): CommitteeSessionStatus {
  const status = asString(value).toLowerCase()
  if (status === "draft" || status === "convened" || status === "held" || status === "cancelled") {
    return status as CommitteeSessionStatus
  }
  return "draft"
}

function normalizeSession(value: unknown, index: number): CommitteeSession {
  const obj = asObject(value)
  return {
    id: asString(obj.id, `session-${index + 1}`),
    title: asString(obj.title),
    type: asString(obj.type) === "extraordinary" ? "extraordinary" : "ordinary",
    date: asString(obj.date),
    time: asString(obj.time),
    modality: asString(obj.modality),
    venue: asString(obj.venue),
    quorumRequired: asString(obj.quorumRequired),
    quorumAchieved: Boolean(obj.quorumAchieved),
    status: normalizeSessionStatus(obj.status),
    minutesSigned: Boolean(obj.minutesSigned),
  }
}

function normalizePriority(value: unknown): CommitteePriority {
  const priority = asString(value).toLowerCase()
  if (priority === "critical" || priority === "high" || priority === "medium" || priority === "low") {
    return priority as CommitteePriority
  }
  return "medium"
}

function normalizeAgreementStatus(value: unknown): CommitteeAgreementStatus {
  const status = asString(value).toLowerCase()
  if (status === "pending" || status === "in_progress" || status === "overdue" || status === "completed") {
    return status as CommitteeAgreementStatus
  }
  return "pending"
}

function normalizeAgreement(value: unknown, index: number): CommitteeAgreement {
  const obj = asObject(value)
  return {
    id: asString(obj.id, `agreement-${index + 1}`),
    title: asString(obj.title),
    description: asString(obj.description),
    responsible: asStringArray(obj.responsible),
    dueDate: asString(obj.dueDate),
    priority: normalizePriority(obj.priority),
    status: normalizeAgreementStatus(obj.status),
    relatedSystemId: asString(obj.relatedSystemId),
  }
}

function normalizeReport(value: unknown, index: number): CommitteeReport {
  const obj = asObject(value)
  const format = asString(obj.format).toLowerCase() === "xlsx" ? "xlsx" : "pdf"

  return {
    id: asString(obj.id, `report-${index + 1}`),
    type: asString(obj.type),
    frequency: asString(obj.frequency),
    generatedAt: asString(obj.generatedAt),
    generatedBy: asString(obj.generatedBy),
    format,
  }
}

function normalizeClassification(value: unknown): CommitteeDocumentClassification {
  const classification = asString(value).toLowerCase()
  if (classification === "internal" || classification === "confidential" || classification === "public") {
    return classification as CommitteeDocumentClassification
  }
  return "confidential"
}

function normalizeRepositoryDocument(value: unknown, index: number): CommitteeRepositoryDocument {
  const obj = asObject(value)
  return {
    id: asString(obj.id, `repository-${index + 1}`),
    type: asString(obj.type),
    name: asString(obj.name),
    version: asString(obj.version, "v1.0"),
    classification: normalizeClassification(obj.classification),
    uploadedAt: asString(obj.uploadedAt),
    uploadedBy: asString(obj.uploadedBy, "Plataforma"),
    retentionUntil: asString(obj.retentionUntil),
    sourceField: asString(obj.sourceField) as keyof CommitteeLegacyDocuments | undefined,
    data: asString(obj.data),
  }
}

function upsertRepositoryFromLegacyDocuments(
  repository: CommitteeRepositoryDocument[],
  legacyDocuments: CommitteeLegacyDocuments,
  classification: CommitteeDocumentClassification,
  documentVersion: string,
  uploadedAt: string,
): CommitteeRepositoryDocument[] {
  const existingByField = new Map(repository.map((document) => [document.sourceField, document]))
  const merged = [...repository]

  for (const key of Object.keys(LEGACY_DOCUMENT_TYPES) as Array<keyof CommitteeLegacyDocuments>) {
    const legacyDocument = legacyDocuments[key]

    if (!legacyDocument) continue

    const normalizedDocument: CommitteeRepositoryDocument = {
      id: existingByField.get(key)?.id || `repo-${key}`,
      type: LEGACY_DOCUMENT_TYPES[key],
      name: legacyDocument.name,
      version: documentVersion || "v1.0",
      classification,
      uploadedAt,
      uploadedBy: "Plataforma",
      retentionUntil: "",
      sourceField: key,
      data: legacyDocument.data,
    }

    const existingIndex = merged.findIndex((document) => document.sourceField === key)
    if (existingIndex >= 0) {
      merged[existingIndex] = normalizedDocument
    } else {
      merged.push(normalizedDocument)
    }
  }

  return merged
}

export function createEmptyCommitteeMember(role: CommitteeMemberRole = "vocal"): CommitteeMember {
  return {
    id: `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fullName: "",
    position: "",
    area: "",
    email: "",
    phone: "",
    company: "",
    membershipType: role,
    mandateStart: "",
    mandateEnd: "",
    status: "active",
    isExternal: role === "observer",
  }
}

export function createEmptyCommitteeRecord(): CommitteeModuleRecord {
  const now = new Date().toISOString()

  return {
    id: `${Date.now()}`,
    version: AI_GOVERNANCE_STORAGE_VERSION,
    status: "active",
    storageVersion: AI_GOVERNANCE_STORAGE_VERSION,
    committeeName: "Comite de Gobernanza de IA",
    createdAt: now,
    lastModified: now,

    committeeMembers: [],
    otherMembers: "",
    rolesDocumented: "",
    rolesApproved: "",
    organizationalLevel: "",
    missionDefined: "",
    agendaDetermination: "",
    meetingFrequency: "",
    committeeFunctions: "",
    otherFunctions: "",
    reviewsInitiatives: "",
    validatesDataPolicies: "",
    definesProcesses: "",
    promotesCulture: "",
    establishesKPIs: "",
    communicatesInternally: "",
    reportsToManagement: "",
    formedBasedOnFrameworks: "",
    periodicReview: "",
    constitutionDate: "",
    authorizingAuthority: "",
    otherAuthority: "",
    foundingMembers: "",
    formalDocumentSigned: "",
    validityDefined: "",
    documents: {},

    organization: {
      legalName: "",
      address: "",
      city: "",
      country: "Mexico",
      taxId: "",
      legalRepresentative: "",
    },
    documentMeta: {
      committeeName: "Comite de Gobernanza de IA",
      classification: "confidential",
      referenceCode: "",
      documentVersion: "v1.0",
      constitutionDate: "",
      author: "",
      owner: "",
    },
    legalBasis: [],
    functionCategories: [],
    sessionRegime: {
      meetingFrequency: "",
      noticeDays: "7",
      agendaLeadDays: "3",
      modalities: ["hybrid"],
      quorumRequired: "50%",
    },
    members: [],
    sessions: [],
    agreements: [],
    reports: [],
    repository: [],
  }
}

export function normalizeCommitteeRecord(value: unknown): CommitteeModuleRecord {
  const base = createEmptyCommitteeRecord()
  const obj = asObject(value)
  const createdAt = asString(obj.createdAt, base.createdAt)
  const lastModified = asString(obj.lastModified, asString(obj.updatedAt, createdAt))
  const documentMetaCandidate = asObject(obj.documentMeta)
  const organizationCandidate = asObject(obj.organization)
  const sessionRegimeCandidate = asObject(obj.sessionRegime)
  const legacyDocuments = normalizeLegacyDocuments(obj.documents)
  const members = Array.isArray(obj.members) ? obj.members.map((member, index) => normalizeCommitteeMember(member, index)) : []
  const committeeName =
    asString(obj.committeeName) ||
    asString(documentMetaCandidate.committeeName) ||
    base.committeeName
  const functionCategories = asStringArray(obj.functionCategories).length
    ? asStringArray(obj.functionCategories)
    : asStringArray(obj.committeeFunctions)
  const legalBasis = asStringArray(obj.legalBasis)
  const repositorySeed = Array.isArray(obj.repository)
    ? obj.repository.map((document, index) => normalizeRepositoryDocument(document, index))
    : []

  const normalized: CommitteeModuleRecord = {
    ...base,
    id: asString(obj.id, base.id),
    version:
      typeof obj.version === "number"
        ? obj.version
        : typeof obj.storageVersion === "number"
          ? (obj.storageVersion as number)
          : AI_GOVERNANCE_STORAGE_VERSION,
    storageVersion: AI_GOVERNANCE_STORAGE_VERSION,
    status: asString(obj.status) === "inactive" ? "inactive" : "active",
    committeeName,
    createdAt,
    lastModified,

    committeeMembers: asStringArray(obj.committeeMembers),
    otherMembers: asString(obj.otherMembers),
    rolesDocumented: asString(obj.rolesDocumented),
    rolesApproved: asString(obj.rolesApproved),
    organizationalLevel: asString(obj.organizationalLevel),
    missionDefined: asString(obj.missionDefined),
    agendaDetermination: asString(obj.agendaDetermination),
    meetingFrequency: asString(obj.meetingFrequency),
    committeeFunctions: asString(obj.committeeFunctions),
    otherFunctions: asString(obj.otherFunctions),
    reviewsInitiatives: asString(obj.reviewsInitiatives),
    validatesDataPolicies: asString(obj.validatesDataPolicies),
    definesProcesses: asString(obj.definesProcesses),
    promotesCulture: asString(obj.promotesCulture),
    establishesKPIs: asString(obj.establishesKPIs),
    communicatesInternally: asString(obj.communicatesInternally),
    reportsToManagement: asString(obj.reportsToManagement),
    formedBasedOnFrameworks: asString(obj.formedBasedOnFrameworks),
    periodicReview: asString(obj.periodicReview),
    constitutionDate: asString(obj.constitutionDate),
    authorizingAuthority: asString(obj.authorizingAuthority),
    otherAuthority: asString(obj.otherAuthority),
    foundingMembers: asString(obj.foundingMembers),
    formalDocumentSigned: asString(obj.formalDocumentSigned),
    validityDefined: asString(obj.validityDefined),
    documents: legacyDocuments,

    organization: {
      legalName: asString(organizationCandidate.legalName),
      address: asString(organizationCandidate.address),
      city: asString(organizationCandidate.city),
      country: asString(organizationCandidate.country, base.organization.country),
      taxId: asString(organizationCandidate.taxId),
      legalRepresentative: asString(organizationCandidate.legalRepresentative),
    },
    documentMeta: {
      committeeName,
      classification: normalizeClassification(documentMetaCandidate.classification),
      referenceCode: asString(documentMetaCandidate.referenceCode),
      documentVersion: asString(documentMetaCandidate.documentVersion, base.documentMeta.documentVersion),
      constitutionDate: asString(documentMetaCandidate.constitutionDate, asString(obj.constitutionDate)),
      author: asString(documentMetaCandidate.author),
      owner: asString(documentMetaCandidate.owner),
    },
    legalBasis,
    functionCategories,
    sessionRegime: {
      meetingFrequency: asString(sessionRegimeCandidate.meetingFrequency, asString(obj.meetingFrequency)),
      noticeDays: asString(sessionRegimeCandidate.noticeDays, base.sessionRegime.noticeDays),
      agendaLeadDays: asString(sessionRegimeCandidate.agendaLeadDays, base.sessionRegime.agendaLeadDays),
      modalities: asStringArray(sessionRegimeCandidate.modalities).length
        ? asStringArray(sessionRegimeCandidate.modalities)
        : base.sessionRegime.modalities,
      quorumRequired: asString(sessionRegimeCandidate.quorumRequired, base.sessionRegime.quorumRequired),
    },
    members,
    sessions: Array.isArray(obj.sessions) ? obj.sessions.map((session, index) => normalizeSession(session, index)) : [],
    agreements: Array.isArray(obj.agreements) ? obj.agreements.map((agreement, index) => normalizeAgreement(agreement, index)) : [],
    reports: Array.isArray(obj.reports) ? obj.reports.map((report, index) => normalizeReport(report, index)) : [],
    repository: repositorySeed,
  }

  normalized.repository = upsertRepositoryFromLegacyDocuments(
    normalized.repository,
    normalized.documents,
    normalized.documentMeta.classification,
    normalized.documentMeta.documentVersion,
    normalized.lastModified,
  )

  normalized.documentMeta.committeeName = normalized.committeeName
  normalized.constitutionDate = normalized.documentMeta.constitutionDate || normalized.constitutionDate
  normalized.meetingFrequency = normalized.sessionRegime.meetingFrequency || normalized.meetingFrequency
  normalized.committeeFunctions = normalized.functionCategories.join(",")
  normalized.committeeMembers =
    normalized.committeeMembers.length > 0
      ? normalized.committeeMembers
      : normalized.members.map((member) => member.membershipType)
  normalized.foundingMembers =
    normalized.foundingMembers || normalized.members.map((member) => member.fullName).filter(Boolean).join(", ")
  normalized.committeeName = normalized.documentMeta.committeeName || normalized.committeeName

  if (!normalized.rolesDocumented && normalized.documents.rolesDocument) {
    normalized.rolesDocumented = "fullyDocumented"
  }

  if (!normalized.missionDefined && normalized.documents.missionDocument) {
    normalized.missionDefined = "yes"
  }

  return normalized
}

export function migrateCommitteeCollection(value: unknown): CommitteeModuleRecord[] {
  if (!Array.isArray(value)) return []
  return value.map((record) => normalizeCommitteeRecord(record))
}

export function cloneCommitteeRecord(record: CommitteeModuleRecord): CommitteeModuleRecord {
  return JSON.parse(JSON.stringify(record)) as CommitteeModuleRecord
}
