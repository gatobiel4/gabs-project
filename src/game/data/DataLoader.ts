import { RacesSchema, ClassesSchema, type Race, type CharacterClass } from '../../types/schemas';

/**
 * DataLoader — fetches and validates game data JSON files at startup.
 * Uses Zod to validate the shape of every file. Throws on invalid data.
 */
export class DataLoader {
    private static _races: Race[] | null = null;
    private static _classes: CharacterClass[] | null = null;

    /** Load and validate races.json. Results are cached after first load. */
    public static async loadRaces(): Promise<Race[]> {
        if (this._races) return this._races;

        const res = await fetch('/assets/data/races.json');
        if (!res.ok) throw new Error(`Failed to fetch races.json: ${res.status}`);

        const raw = await res.json();
        const data = RacesSchema.parse(raw); // Zod validates + throws on error
        this._races = data;

        console.log(`[DataLoader] Loaded ${data.length} races ✅`);
        return data;
    }

    /** Load and validate classes.json. Results are cached after first load. */
    public static async loadClasses(): Promise<CharacterClass[]> {
        if (this._classes) return this._classes;

        const res = await fetch('/assets/data/classes.json');
        if (!res.ok) throw new Error(`Failed to fetch classes.json: ${res.status}`);

        const raw = await res.json();
        const data = ClassesSchema.parse(raw);
        this._classes = data;

        console.log(`[DataLoader] Loaded ${data.length} classes ✅`);
        return data;
    }

    /** Load both in parallel — call this once at app startup */
    public static async loadAll(): Promise<{ races: Race[]; classes: CharacterClass[] }> {
        const [races, classes] = await Promise.all([
            this.loadRaces(),
            this.loadClasses(),
        ]);
        return { races, classes };
    }

    /** Get a race by id (must call loadRaces first) */
    public static getRaceById(id: string): Race | undefined {
        return this._races?.find(r => r.id === id);
    }

    /** Get a class by id (must call loadClasses first) */
    public static getClassById(id: string): CharacterClass | undefined {
        return this._classes?.find(c => c.id === id);
    }

    /** Clear cache (useful for hot-reload in dev) */
    public static clearCache(): void {
        this._races = null;
        this._classes = null;
    }
}
