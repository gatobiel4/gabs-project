import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STAT BLOCK — reused across races and classes
// ─────────────────────────────────────────────────────────────────────────────
const StatModifiersSchema = z.object({
    strength: z.number(),
    dexterity: z.number(),
    intelligence: z.number(),
    vitality: z.number(),
    maxHp: z.number(),
    maxMp: z.number(),
    speed: z.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// RACE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
export const RaceSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    bonusDescription: z.string(),
    statModifiers: StatModifiersSchema,
});

export const RacesSchema = z.array(RaceSchema).min(1);

// Inferred TypeScript types — no need to define them manually
export type Race = z.infer<typeof RaceSchema>;
export type StatModifiers = z.infer<typeof StatModifiersSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CLASS SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
const BaseStatsSchema = z.object({
    strength: z.number().min(1),
    dexterity: z.number().min(1),
    intelligence: z.number().min(1),
    vitality: z.number().min(1),
    maxHp: z.number().min(1),
    maxMp: z.number().min(0),
    speed: z.number().positive(),
});

export const ClassSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    bonusDescription: z.string(),
    baseStats: BaseStatsSchema,
    startingSkills: z.array(z.string()),
});

export const ClassesSchema = z.array(ClassSchema).min(1);

export type CharacterClass = z.infer<typeof ClassSchema>;
export type BaseStats = z.infer<typeof BaseStatsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// FINAL COMPUTED CHARACTER STATS
// (result of race modifiers applied on top of class base stats)
// ─────────────────────────────────────────────────────────────────────────────
export interface FinalStats {
    strength: number;
    dexterity: number;
    intelligence: number;
    vitality: number;
    maxHp: number;
    maxMp: number;
    speed: number;
    // Runtime values (start at max)
    hp: number;
    mp: number;
    level: number;
}
