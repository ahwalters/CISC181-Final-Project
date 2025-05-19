import { Piece } from "./Piece";
import { Location } from "./Location";

export class PieceKilljoy extends Piece {
    private frozenTargets: Map<string, number> = new Map();
    private numAttacks: number;
    private numFreezes: number;
    private frozen: boolean;

    constructor(
        teamColor: string,
        hidden: boolean,
        original: boolean,
        numAttacks: number = 0,
        numFreezes: number = 0,
    ) {
        super("K", teamColor, hidden, original);
        this.numAttacks = numAttacks;
        this.numFreezes = numFreezes;
        this.frozen = false;
        this.allowableActions = ["attack", "freeze", "move"];
    }

    speak(): string {
        return "You're detained.";
    }

    increaseNumAttacks(): void {
        this.numAttacks += 1;
    }
    increaseNumFreezes(): void {
        this.numFreezes += 1;
    }
    validMovePath(moveFrom: Location, moveTo: Location): boolean {
        const rowDiff: number = moveFrom.getRow() - moveTo.getRow();
        const colDiff: number = moveFrom.getCol() - moveTo.getCol();
        return (
            (rowDiff === 1 || rowDiff === -1) &&
            (colDiff === 1 || colDiff === -1)
        );
    }

    freeze(target: Piece, to: Location): string {
        const key = `${to.getRow()},${to.getCol()}`;
        this.frozenTargets.set(key, 2);
        this.increaseNumFreezes();
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
        if (action === "attack") {
            this.increaseNumAttacks();
        } else if (action === "freeze") {
            this;
        }
    }

    getImageName(): string {
        return `killjoy_${this.teamColor.toLowerCase()}.png`;
    }

    getType(): string {
        return "Killjoy";
    }
}
