/* PieceScrat - Problem 4

Create a PieceScrat class that extends the Piece class.
It should have the following:
- constant MAX_CRACKS to represent the maximum number of squares it can crack and 
  set it to 2
- member field to represent whether this piece can crack a square or not  (true/false)
- member field to represent the number of attacks its made
- member field to represent the number of recruits its made
- member field to reprsent the number of cracks its made

- constructor with the parameters required by the superclass plus two
    new paratmeters: one for number of attacks and number of recruits (in that order)
     - calls the super class' constructor (symbol should be set to 'S' by default)     -
     - sets the number of attacks 
     - sets the number of recruits
     - sets the number of squares it cracked to 0
     - adds add "move", "attack" ,"recruit", "spawn", and "crack"
        to the allowable actions array.
- accessors 
    - getNumAttacks, getNumRecruits, getNumCracks
- mutator 
    – increaseNumAttacks - increments number of attacks by 1   
- mutator
    - increaseNumRecruits - increments number of recruits by 1
- mutator
    - increaseNumCracks - increments number of cracks by 1
- implement the speak method:
    - scrat should yell "Aaaahhhh!"
- implement the validMovePath method
    - for now it will return true
- implement the spawn method 
    - it should increase the number of spawns for 
    the object doing the spawning and then return a new PieceScrat
    with the following:
        - symbol - should match values of spawned object but should be lowercase
        - teamColor - should match values of spawned object
        - hidden - should match values of spawned object
        - original - should be set to false
- implement the canSpawn method
    - the piece can spawn as long as it is original and has
    - less than the maximum cracks allowed
- implement the updateAction method
    
*/

import { Location } from "./Location";
import { Piece } from "./Piece";

export class PieceScrat extends Piece {
    public static readonly MAX_CRACKS: number = 2;
    private numAttacks: number;
    private numRecruits: number;
    private numCracks: number;
    private moveFrom?: Location;
    private moveTo?: Location;
    public allowableAction(action: string): boolean {
        if (action === "spawn") {
            // only allow spawn while original & under MAX_CRACKS
            return this.canSpawn();
        }
        // other four actions are always fine
        return ["move", "attack", "recruit", "crack"].includes(action);
    }

    constructor(
        symbol: string = "S",
        teamColor: string = "NON",
        hidden: boolean = false,
        original: boolean = true,
        numAttacks: number = 0,
        numRecruits: number = 0,
    ) {
        super(symbol, teamColor, hidden, original);
        this.numAttacks = numAttacks;
        this.numRecruits = numRecruits;
        this.numCracks = 0;
        // ✅ Ensure superclass field is set, not shadowed
    }

    getNumAttacks(): number {
        return this.numAttacks;
    }

    getNumRecruits(): number {
        return this.numRecruits;
    }

    getNumCracks(): number {
        return this.numCracks;
    }

    increaseNumAttacks(): void {
        this.numAttacks += 1;
    }

    increaseNumRecruits(): void {
        this.numRecruits += 1;
    }

    increaseNumCracks(): void {
        this.numCracks += 1;
    }

    canCrack(): boolean {
        return this.numCracks < PieceScrat.MAX_CRACKS;
    }

    speak(): string {
        return "Aaaahhhh!";
    }

    validMovePath(moveFrom: Location, moveTo: Location): boolean {
        const rowDiff: number = moveFrom.getRow() - moveTo.getRow();
        const colDiff: number = moveFrom.getCol() - moveTo.getCol();

        return (
            (rowDiff === 2 && colDiff === 0) ||
            (rowDiff === 0 && colDiff === 2) ||
            (rowDiff === 2 && colDiff === 2)
        );
    }

    spawn(): PieceScrat {
        this.numSpawns += 1;
        return new PieceScrat(
            this.symbol.toLowerCase(),
            this.teamColor,
            this.hidden,
            false,
            0,
            0,
        );
    }

    canSpawn(): boolean {
        return this.original && this.numCracks < PieceScrat.MAX_CRACKS;
    }

    updateAction(action: string): void {
        if (action === "attack") {
            this.increaseNumAttacks();
        } else if (action === "recruit") {
            this.increaseNumRecruits();
        } else if (action === "crack") {
            this.increaseNumCracks();
        }
    }

    getImageName(): string {
        return `scrat_${this.teamColor.toLowerCase()}.png`;
    }

    getType(): string {
        return "Scrat";
    }
}
