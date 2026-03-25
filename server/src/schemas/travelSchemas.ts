import { z } from "zod";

export const DestinationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  image: z.string().url().optional(),
  tagline: z.string().optional(),
  budget: z.number().nonnegative(),
  days: z.number().int().positive(),
  weather: z.object({
    temp: z.number(),
    condition: z.string().min(1),
  }),
  crowdLevel: z.enum(["cold", "moderate", "hot"]),
  matchScore: z.number().min(0).max(100),
  highlights: z.array(z.string().min(1)).min(1),
});

export type Destination = z.infer<typeof DestinationSchema>;

export const ItineraryActivitySchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/, "time must be HH:mm"),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["sightseeing", "food", "transport", "rest"]),
});

export type ItineraryActivity = z.infer<typeof ItineraryActivitySchema>;

export const ItineraryDaySchema = z.object({
  day: z.number().int().positive(),
  activities: z.array(ItineraryActivitySchema).min(1),
});

export type ItineraryDay = z.infer<typeof ItineraryDaySchema>;

export const BudgetBreakdownItemSchema = z.object({
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
});

export const PlannerBudgetBreakdownSchema = z.object({
  transport: BudgetBreakdownItemSchema,
  accommodation: BudgetBreakdownItemSchema,
  food: BudgetBreakdownItemSchema,
  activities: BudgetBreakdownItemSchema,
});

export const TravelRouteSchema = z.object({
  destination: z.string().min(1),
  totalBudget: z.number().nonnegative(),
  budgetBreakdown: PlannerBudgetBreakdownSchema,
  days: z.array(ItineraryDaySchema).min(1),
  accommodation: z.string().min(1),
  tips: z.array(z.string().min(1)).min(1),
});

export type TravelRoute = z.infer<typeof TravelRouteSchema>;

export const RecommendResponseSchema = z.object({
  destinations: z.array(DestinationSchema).min(1),
  compareEligible: z.boolean().optional(),
  warnings: z.array(z.string().min(1)).optional(),
  sourcesUsed: z
    .object({
      weather: z.string().optional(),
      routeRules: z.string().optional(),
      crowd: z.string().optional(),
    })
    .optional(),
});

export type RecommendResponse = z.infer<typeof RecommendResponseSchema>;

export const ReverseDestinationSchema = z.object({
  popular: z.string().min(1),
  alternative: z.string().min(1),
  reason: z.string().min(1),
  reverseIndex: z.number().int().min(0).max(100),
  image: z.string().url().optional(),
  highlights: z.array(z.string().min(1)).min(1),
});

export const ReverseResponseSchema = z.object({
  alternatives: z.array(ReverseDestinationSchema).min(1),
  crowdUsed: z.enum(["degraded", "high", "medium", "low"]).optional(),
  warnings: z.array(z.string().min(1)).optional(),
});

export type ReverseResponse = z.infer<typeof ReverseResponseSchema>;

export const DiceVlogShotSchema = z.object({
  scene: z.string().min(1),
  visualDescription: z.string().min(1),
  voiceover: z.string().min(1),
  subtitle: z.string().min(1),
});

export const DiceVlogScriptSchema = z.object({
  hook: z.string().min(1),
  shots: z.array(DiceVlogShotSchema).min(1),
  cta: z.string().min(1),
});

export const DiceVlogResponseSchema = z.object({
  script: DiceVlogScriptSchema,
  locationSuggestions: z.array(z.string().min(1)).min(1).optional(),
  warnings: z.array(z.string().min(1)).optional(),
});

export type DiceVlogResponse = z.infer<typeof DiceVlogResponseSchema>;

export const BlindBoxResponseSchema = z.object({
  clues: z.array(z.string().min(1)).min(1),
  destination: z.string().min(1).optional(),
  itinerary: TravelRouteSchema.optional(),
  warnings: z.array(z.string().min(1)).optional(),
});

export type BlindBoxResponse = z.infer<typeof BlindBoxResponseSchema>;

export const PhotoMissionSchema = z.object({
  title: z.string().min(1),
  task: z.string().min(1),
  example: z.string().min(1),
  whenToShoot: z.string().min(1),
  routeSuggestion: z.string().min(1),
});

export const PhotoChallengePlanSchema = z.object({
  challengePlan: z.object({
    missions: z.array(PhotoMissionSchema).min(1),
    route: z.object({
      order: z.string().min(1).optional(),
      places: z.array(z.string().min(1)).min(1),
    }),
    weatherUsed: z.string().optional(),
    crowdUsed: z.string().optional(),
  }),
});

export type PhotoChallengePlanResponse = z.infer<typeof PhotoChallengePlanSchema>;

