import { Piece } from "./Piece";
import { Location } from "./Location";

export class PieceKilljoy extends Piece {
    private frozenTargets: Map<string, number> = new Map();
    private moveFrom?: Location;
    private moveTo?: Location;

    constructor(teamColor: string, hidden: boolean, original: boolean) {
        super("K", teamColor, hidden, original);
        this.allowableActions = ["attack", "freeze"];
    }

    speak(): string {
        return "You're detained.";
    }

    validMovePath(): boolean {
        if (!this.moveFrom || !this.moveTo) return false;

        const rowDiff = Math.abs(this.moveFrom.getRow() - this.moveTo.getRow());
        const colDiff = Math.abs(this.moveFrom.getCol() - this.moveTo.getCol());
        return rowDiff + colDiff === 1;
    }

    freeze(target: Piece, to: Location): string {
        const key = `${to.getRow()},${to.getCol()}`;
        this.frozenTargets.set(key, 2);
        return "Killjoy used Freeze: target is frozen for 1 round.";
    }

    updateFreezeStatus(): void {
        for (const [key, turns] of this.frozenTargets) {
            if (turns <= 1) {
                this.frozenTargets.delete(key);
            } else {
                this.frozenTargets.set(key, turns - 1);
            }
        }
    }

    isFrozen(location: Location): boolean {
        const key = `${location.getRow()},${location.getCol()}`;
        return this.frozenTargets.has(key);
    }

    canSpawn(): boolean {
        return false;
    }

    spawn(): Piece {
        throw new Error("Killjoy cannot spawn.");
    }

    updateAction(action: string): void {
        if (action.includes(",")) {
            const [fromRow, fromCol, toRow, toCol] = action
                .split(",")
                .map(Number);
            this.moveFrom = new Location(fromRow, fromCol);
            this.moveTo = new Location(toRow, toCol);
        }
        // Else ignore, for actions like "attack" or "freeze"
    }

    getImageName(): string {
        return `killjoy_${this.teamColor.toLowerCase()}.png`;
    }

    getType(): string {
        return "Killjoy";
    }
}
