/* HW 10 Problem 3 
Update Piece class to include the following members:
- a string array containing the allowable actions this
    - type of piece can make
    - initialize it to an empty array
    - do NOT add it to the constructor 
- method named allowableAction with one parameter representing an action
    and returns a boolean
    this method checks that the action string passed to this method is in the
    list of allowable actions this piece can make
    if the action is "spawn" - the method must check canSpawn instead
- abstract method name updateAction that has one parameter representing an action
    and doesn't return anything

Update PieceBlueHen,PieceMinion, PieceScrat classes before testing.
Test them by using: npm run test PieceClasses
*/

import { Location } from "./Location";

export abstract class Piece {
    protected numSpawns: number;
    protected allowableActions: string[] = [];

    constructor(
        protected symbol: string,
        protected teamColor: string,
        protected hidden: boolean,
        protected original: boolean,
    ) {
        this.numSpawns = 0;
    }

    getSymbol(): string {
        return this.symbol;
    }
    getTeamColor(): string {
        return this.teamColor;
    }
    isHidden(): boolean {
        return this.hidden;
    }
    isOriginal(): boolean {
        return this.original;
    }
    getNumSpawns() {
        return this.numSpawns;
    }
    setSymbol(symbol: string): void {
        this.symbol = symbol;
    }
    setTeamColor(teamColor: string): void {
        this.teamColor = teamColor;
    }
    setHidden(hidden: boolean): void {
        this.hidden = hidden;
    }
    setOriginal(original: boolean): void {
        this.original = original;
    }

    allowableAction(action: string): boolean {
        if (action === "spawn") {
            return this.canSpawn();
        }
        return this.allowableActions.includes(action);
    }

    abstract updateAction(action: string): void;
    abstract speak(): string;
    abstract validMovePath(moveFrom: Location, moveTo: Location): boolean;
    abstract spawn(): Piece;
    abstract canSpawn(): boolean;
    abstract increaseNumAttacks(): void;

    toString(): string {
        return this.teamColor.slice(0, 3) + " " + this.symbol;
    }
    public abstract getImageName(): string;

    getType(): string {
        return this.symbol;
    }
}
