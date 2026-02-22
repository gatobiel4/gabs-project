import { type Race, type CharacterClass, type FinalStats } from '../../types/schemas';

/**
 * CharacterFactory — combines a chosen Race + Class into final computed stats.
 * This is the single source of truth for how a new player character is built.
 *
 * Formula:
 *   finalStat = classStat + raceModifier
 *   (clamped to a minimum of 1 for all stats except speed)
 */
export class CharacterFactory {
    /**
     * Compute final stats by layering race modifiers on top of class base stats.
     *
     * @param race  — the chosen race (from races.json)
     * @param cls   — the chosen class (from classes.json)
     * @returns     — FinalStats object ready to be passed into the Player entity
     */
    public static build(race: Race, cls: CharacterClass): FinalStats {
        const b = cls.baseStats;
        const m = race.statModifiers;

        const maxHp = Math.max(1, b.maxHp + m.maxHp);
        const maxMp = Math.max(0, b.maxMp + m.maxMp);

        const finalStats: FinalStats = {
            strength: Math.max(1, b.strength + m.strength),
            dexterity: Math.max(1, b.dexterity + m.dexterity),
            intelligence: Math.max(1, b.intelligence + m.intelligence),
            vitality: Math.max(1, b.vitality + m.vitality),
            maxHp,
            maxMp,
            speed: Math.max(1, b.speed + m.speed),
            // Runtime values — start at full
            hp: maxHp,
            mp: maxMp,
            level: 1,
        };

        console.log(
            `[CharacterFactory] Built ${race.name} ${cls.name}:`,
            `HP=${finalStats.maxHp}`,
            `MP=${finalStats.maxMp}`,
            `STR=${finalStats.strength}`,
            `DEX=${finalStats.dexterity}`,
            `INT=${finalStats.intelligence}`,
        );

        return finalStats;
    }

    /**
     * Preview helper — returns a human-readable stat comparison string.
     * Used by the Character Creation UI to show stat breakdowns.
     */
    public static preview(race: Race, cls: CharacterClass): Record<string, string> {
        const stats = this.build(race, cls);
        return {
            'HP': `${stats.maxHp}`,
            'MP': `${stats.maxMp}`,
            'Strength': `${stats.strength}`,
            'Dexterity': `${stats.dexterity}`,
            'Intelligence': `${stats.intelligence}`,
            'Vitality': `${stats.vitality}`,
            'Speed': `${stats.speed.toFixed(1)}`,
        };
    }
}
