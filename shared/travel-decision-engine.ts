import { z } from "zod";

/**
 * AdventureConnect — explainable travel recommendation core.
 *
 * This module is deliberately pure: it does not fetch destinations, quote prices,
 * persist searches, or claim real-time availability. It ranks only the candidate
 * data supplied by a caller and returns the factors behind every score.
 */

export const travelStyles = ["nature", "adventure", "culture", "relax"] as const;

export type TravelStyle = (typeof travelStyles)[number];
export type PriceStatus = "verified" | "estimate" | "unknown";

const positiveMoney = z.number().finite().positive().max(1_000_000_000_000);
const travelRequestSchema = z.object({
  origin: z.string().trim().min(2, "Indica una ciudad de origen válida.").max(100),
  days: z.number().int().min(1).max(60),
  budgetCop: positiveMoney,
  travelers: z.number().int().min(1).max(20),
  styles: z.array(z.enum(travelStyles)).min(1).max(travelStyles.length)
    .refine((styles) => new Set(styles).size === styles.length, "No repitas estilos de viaje."),
}).strict();

const destinationSchema = z.object({
  id: z.string().trim().min(1).max(120),
  name: z.string().trim().min(2).max(160),
  region: z.string().trim().min(2).max(160),
  styles: z.array(z.enum(travelStyles)).max(travelStyles.length),
  estimatedCostPerPersonCop: positiveMoney.nullable().optional(),
  minDays: z.number().int().min(1).max(60).nullable().optional(),
  maxDays: z.number().int().min(1).max(60).nullable().optional(),
  priceStatus: z.enum(["verified", "estimate", "unknown"]).default("unknown"),
  priceSource: z.string().trim().min(1).max(500).nullable().optional(),
  priceVerifiedAt: z.string().datetime({ offset: true }).nullable().optional(),
}).strict().superRefine((destination, context) => {
  if (destination.minDays != null && destination.maxDays != null && destination.minDays > destination.maxDays) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxDays"],
      message: "maxDays no puede ser menor que minDays.",
    });
  }
  if (destination.priceStatus === "verified" && !destination.priceSource) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["priceSource"],
      message: "Un precio marcado como verificado necesita una fuente identificable.",
    });
  }
  if (destination.priceStatus === "verified" && !destination.priceVerifiedAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["priceVerifiedAt"],
      message: "Un precio marcado como verificado necesita fecha de verificación.",
    });
  }
});

export type TravelRequest = z.infer<typeof travelRequestSchema>;
export type DestinationCandidate = z.input<typeof destinationSchema>;

export type ScoreFactor = {
  score: number;
  weight: number;
  explanation: string;
};

export type RecommendationReason = {
  code: "BUDGET_FIT" | "BUDGET_CLOSE" | "BUDGET_OVER" | "BUDGET_UNKNOWN"
    | "DURATION_FIT" | "DURATION_CLOSE" | "DURATION_UNKNOWN"
    | "STYLE_MATCH" | "STYLE_PARTIAL" | "STYLE_MISMATCH"
    | "PRICE_ESTIMATE" | "PRICE_SOURCE_MISSING" | "PRICE_STALE";
  message: string;
};

export type TravelRecommendation = {
  destination: z.infer<typeof destinationSchema>;
  score: number;
  confidence: number;
  estimatedGroupCostCop: number | null;
  factors: {
    budget: ScoreFactor;
    duration: ScoreFactor;
    style: ScoreFactor;
  };
  reasons: RecommendationReason[];
  caveats: string[];
};

export type DecisionResult =
  | {
      ok: false;
      errors: Array<{ field: string; message: string }>;
      recommendations: [];
      excluded: [];
    }
  | {
      ok: true;
      request: TravelRequest;
      recommendations: TravelRecommendation[];
      excluded: Array<{ id: string; name: string; errors: Array<{ field: string; message: string }> }>;
      diagnostics: {
        candidatesReceived: number;
        candidatesRanked: number;
        candidatesExcluded: number;
        rankingVersion: "colombia-v1";
      };
    };

const WEIGHTS = { budget: 0.45, duration: 0.3, style: 0.25 } as const;
const MAX_CANDIDATES = 500;
const PRICE_FRESHNESS_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

function zodErrors(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "input",
    message: issue.message,
  }));
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function budgetFactor(
  request: TravelRequest,
  destination: z.infer<typeof destinationSchema>,
): { factor: ScoreFactor; groupCost: number | null; reason: RecommendationReason } {
  const cost = destination.estimatedCostPerPersonCop;
  if (cost == null || destination.priceStatus === "unknown") {
    return {
      factor: { score: 50, weight: WEIGHTS.budget, explanation: "No hay un coste utilizable para comparar con el presupuesto." },
      groupCost: null,
      reason: { code: "BUDGET_UNKNOWN", message: "No hay una estimación de coste fiable; el presupuesto no se puede confirmar." },
    };
  }

  const groupCost = cost * request.travelers;
  if (!Number.isFinite(groupCost)) {
    return {
      factor: { score: 0, weight: WEIGHTS.budget, explanation: "El coste total excede el rango numérico admitido." },
      groupCost: null,
      reason: { code: "BUDGET_OVER", message: "El coste calculado no se puede representar con seguridad." },
    };
  }

  const ratio = groupCost / request.budgetCop;
  if (ratio <= 0.8) {
    return {
      factor: { score: 100, weight: WEIGHTS.budget, explanation: "La estimación ocupa como máximo el 80 % del presupuesto del grupo." },
      groupCost,
      reason: { code: "BUDGET_FIT", message: "La estimación deja un margen presupuestario amplio." },
    };
  }
  if (ratio <= 1) {
    return {
      factor: { score: 85, weight: WEIGHTS.budget, explanation: "La estimación cabe dentro del presupuesto del grupo." },
      groupCost,
      reason: { code: "BUDGET_FIT", message: "La estimación cabe en el presupuesto indicado, antes de gastos no incluidos." },
    };
  }
  if (ratio <= 1.15) {
    return {
      factor: { score: 60, weight: WEIGHTS.budget, explanation: "La estimación supera el presupuesto hasta en un 15 %." },
      groupCost,
      reason: { code: "BUDGET_CLOSE", message: "El destino queda cerca del presupuesto, pero requeriría ajustar gastos o presupuesto." },
    };
  }
  if (ratio <= 1.35) {
    return {
      factor: { score: 30, weight: WEIGHTS.budget, explanation: "La estimación supera el presupuesto entre un 15 % y un 35 %." },
      groupCost,
      reason: { code: "BUDGET_CLOSE", message: "El coste estimado está sensiblemente por encima del presupuesto." },
    };
  }
  return {
    factor: { score: 0, weight: WEIGHTS.budget, explanation: "La estimación supera el presupuesto en más del 35 %." },
    groupCost,
    reason: { code: "BUDGET_OVER", message: "El destino excede ampliamente el presupuesto indicado." },
  };
}

function durationFactor(
  days: number,
  destination: z.infer<typeof destinationSchema>,
): { factor: ScoreFactor; reason: RecommendationReason } {
  const { minDays, maxDays } = destination;
  if (minDays == null && maxDays == null) {
    return {
      factor: { score: 50, weight: WEIGHTS.duration, explanation: "No hay una duración recomendada registrada." },
      reason: { code: "DURATION_UNKNOWN", message: "No se ha definido una duración de referencia para este destino." },
    };
  }

  const minimum = minDays ?? 1;
  const maximum = maxDays ?? 60;
  if (days >= minimum && days <= maximum) {
    return {
      factor: { score: 100, weight: WEIGHTS.duration, explanation: "Los días disponibles están dentro del rango recomendado." },
      reason: { code: "DURATION_FIT", message: "La duración disponible encaja con el rango recomendado." },
    };
  }

  const distance = days < minimum ? minimum - days : days - maximum;
  if (distance === 1) {
    return {
      factor: { score: 65, weight: WEIGHTS.duration, explanation: "La duración disponible se aparta un día del rango recomendado." },
      reason: { code: "DURATION_CLOSE", message: "Podría encajar con un ajuste pequeño en el itinerario." },
    };
  }
  return {
    factor: { score: 20, weight: WEIGHTS.duration, explanation: "La duración disponible se aparta del rango recomendado." },
    reason: { code: "DURATION_CLOSE", message: "El tiempo disponible no coincide bien con la duración recomendada." },
  };
}

function styleFactor(
  requested: TravelStyle[],
  available: TravelStyle[],
): { factor: ScoreFactor; reason: RecommendationReason } {
  if (available.length === 0) {
    return {
      factor: { score: 50, weight: WEIGHTS.style, explanation: "El destino no tiene estilos clasificados; no se presume compatibilidad." },
      reason: { code: "STYLE_PARTIAL", message: "Faltan etiquetas de estilo para evaluar la afinidad." },
    };
  }

  const matched = requested.filter((style) => available.includes(style));
  const score = clampScore((matched.length / requested.length) * 100);
  if (matched.length === requested.length) {
    return {
      factor: { score, weight: WEIGHTS.style, explanation: "Coinciden todos los estilos solicitados." },
      reason: { code: "STYLE_MATCH", message: "El destino coincide con todos los estilos elegidos." },
    };
  }
  if (matched.length > 0) {
    return {
      factor: { score, weight: WEIGHTS.style, explanation: `Coinciden ${matched.length} de ${requested.length} estilos solicitados.` },
      reason: { code: "STYLE_PARTIAL", message: `Coincide con: ${matched.join(", ")}.` },
    };
  }
  return {
    factor: { score: 0, weight: WEIGHTS.style, explanation: "No coincide ningún estilo solicitado." },
    reason: { code: "STYLE_MISMATCH", message: "El destino no coincide con los estilos elegidos." },
  };
}

function priceCaveats(
  destination: z.infer<typeof destinationSchema>,
  referenceDate: Date,
): { confidence: number; reasons: RecommendationReason[]; caveats: string[] } {
  const reasons: RecommendationReason[] = [];
  const caveats: string[] = [];
  let confidence = 45;

  if (destination.priceStatus === "verified" && destination.priceSource && destination.priceVerifiedAt) {
    const verifiedAt = Date.parse(destination.priceVerifiedAt);
    const ageDays = (referenceDate.getTime() - verifiedAt) / DAY_MS;
    if (!Number.isFinite(verifiedAt) || ageDays < 0) {
      confidence = 35;
      caveats.push("La fecha de verificación del precio es inválida o futura; no se considera evidencia vigente.");
      reasons.push({ code: "PRICE_SOURCE_MISSING", message: "No se pudo validar temporalmente la fecha de la fuente." });
    } else if (ageDays <= PRICE_FRESHNESS_DAYS) {
      confidence = 90;
      caveats.push("El precio tiene fuente y fecha recientes, pero debe reconfirmarse con el proveedor antes de comprar.");
    } else {
      confidence = 60;
      caveats.push("La fuente del precio tiene más de 30 días; confirma el importe antes de decidir.");
      reasons.push({ code: "PRICE_STALE", message: "La fecha de verificación del precio supera los 30 días." });
    }
  } else if (destination.priceStatus === "estimate") {
    confidence = 55;
    caveats.push("El coste es orientativo y no constituye una cotización ni confirma disponibilidad.");
    reasons.push({ code: "PRICE_ESTIMATE", message: "El coste se identifica como estimación, no como precio confirmado." });
  } else {
    confidence = 25;
    caveats.push("No existe evidencia suficiente para confirmar el precio ni la disponibilidad.");
    reasons.push({ code: "PRICE_SOURCE_MISSING", message: "Faltan fuente, fecha o estado verificable del precio." });
  }

  if (destination.priceStatus === "verified" && !destination.priceSource) {
    confidence = Math.min(confidence, 25);
    caveats.push("El dato está marcado como verificado, pero no incluye una fuente identificable.");
  }
  return { confidence, reasons, caveats };
}

/**
 * Validates the request and ranks supplied destination candidates deterministically.
 * Invalid candidates are excluded individually; an invalid request rejects the run.
 */
export function rankColombiaDestinations(
  requestInput: unknown,
  candidateInputs: unknown,
  referenceDateInput: string | Date = new Date(),
): DecisionResult {
  const parsedRequest = travelRequestSchema.safeParse(requestInput);
  if (!parsedRequest.success) {
    return { ok: false, errors: zodErrors(parsedRequest.error), recommendations: [], excluded: [] };
  }

  if (!Array.isArray(candidateInputs)) {
    return {
      ok: false,
      errors: [{ field: "candidates", message: "Las opciones de destino deben enviarse como una lista." }],
      recommendations: [],
      excluded: [],
    };
  }
  if (candidateInputs.length > MAX_CANDIDATES) {
    return {
      ok: false,
      errors: [{ field: "candidates", message: `Se admiten como máximo ${MAX_CANDIDATES} destinos por evaluación.` }],
      recommendations: [],
      excluded: [],
    };
  }

  const referenceDate = referenceDateInput instanceof Date
    ? new Date(referenceDateInput.getTime())
    : new Date(referenceDateInput);
  if (!Number.isFinite(referenceDate.getTime())) {
    return {
      ok: false,
      errors: [{ field: "referenceDate", message: "La fecha de referencia no es válida." }],
      recommendations: [],
      excluded: [],
    };
  }

  const request = parsedRequest.data;
  const excluded: Array<{ id: string; name: string; errors: Array<{ field: string; message: string }> }> = [];
  const validDestinations: Array<z.infer<typeof destinationSchema>> = [];
  const seenIds = new Set<string>();

  candidateInputs.forEach((candidate, index) => {
    const parsed = destinationSchema.safeParse(candidate);
    if (!parsed.success) {
      const fallback = candidate && typeof candidate === "object" ? candidate as Record<string, unknown> : {};
      excluded.push({
        id: typeof fallback.id === "string" ? fallback.id : `candidate-${index + 1}`,
        name: typeof fallback.name === "string" ? fallback.name : "Destino sin nombre válido",
        errors: zodErrors(parsed.error),
      });
      return;
    }
    if (seenIds.has(parsed.data.id)) {
      excluded.push({
        id: parsed.data.id,
        name: parsed.data.name,
        errors: [{ field: "id", message: "El identificador del destino está duplicado." }],
      });
      return;
    }
    seenIds.add(parsed.data.id);
    validDestinations.push(parsed.data);
  });

  const recommendations = validDestinations.map((destination): TravelRecommendation => {
    const budget = budgetFactor(request, destination);
    const duration = durationFactor(request.days, destination);
    const style = styleFactor(request.styles, destination.styles);
    const quality = priceCaveats(destination, referenceDate);
    const score = clampScore(
      budget.factor.score * budget.factor.weight
      + duration.factor.score * duration.factor.weight
      + style.factor.score * style.factor.weight,
    );
    return {
      destination,
      score,
      confidence: quality.confidence,
      estimatedGroupCostCop: budget.groupCost,
      factors: { budget: budget.factor, duration: duration.factor, style: style.factor },
      reasons: [budget.reason, duration.reason, style.reason, ...quality.reasons],
      caveats: quality.caveats,
    };
  });

  recommendations.sort((a, b) =>
    b.score - a.score
    || b.confidence - a.confidence
    || (a.estimatedGroupCostCop ?? Number.POSITIVE_INFINITY) - (b.estimatedGroupCostCop ?? Number.POSITIVE_INFINITY)
    || a.destination.name.localeCompare(b.destination.name, "es"),
  );

  return {
    ok: true,
    request,
    recommendations,
    excluded,
    diagnostics: {
      candidatesReceived: candidateInputs.length,
      candidatesRanked: recommendations.length,
      candidatesExcluded: excluded.length,
      rankingVersion: "colombia-v1",
    },
  };
}
