/* HW10 Problem 3

In the constructor, add "move", "recruit" and "spawn"
to the allowable actions array.

Override the updateAction method with the following
logic:
-  if the action is "recruit", then call increaseNumRecruits
*/

import { Piece } from "./Piece";
import { Location } from "./Location";

export class PieceMinion extends Piece {
    private numRecruits: number;

    public static readonly MAX_NUM_SPAWNED: number = 3;

    constructor(
        symbol: string = "M",
        teamColor: string = "NON",
        hidden: boolean = false,
        original: boolean = true,
        numRecruits: number = 0,
    ) {
        super(symbol, teamColor, hidden, original);
        this.numRecruits = numRecruits;
        this.allowableActions = ["move", "recruit", "spawn"];
    }

    getNumRecruits(): number {
        return this.numRecruits;
    }

    increaseNumRecruits(): void {
        this.numRecruits += 1;
    }

    canSpawn(): boolean {
        return this.original && this.numSpawns <= PieceMinion.MAX_NUM_SPAWNED;
    }

    speak(): string {
        return "Bello!";
    }

    validMovePath(moveFrom: Location, moveTo: Location): boolean {
        const rowDiff: number = moveFrom.getRow() - moveTo.getRow();
        const colDiff: number = moveFrom.getCol() - moveTo.getCol();
        return (
            (rowDiff === 1 || rowDiff === -1) &&
            (colDiff === 1 || colDiff === -1)
        );
    }

    spawn(): PieceMinion {
        this.numSpawns += 1;
        return new PieceMinion(
            this.symbol.toLowerCase(),
            this.teamColor,
            this.hidden,
            false,
            0,
        );
    }

    updateAction(action: string): void {
        if (action === "recruit") {
            this.increaseNumRecruits();
        }
    }

    getImageName(): string {
        return `minion_${this.teamColor.toLowerCase()}.png`;
    }

    getType(): string {
        return "Minion";
    }
    increaseNumAttacks(): void {}
}
