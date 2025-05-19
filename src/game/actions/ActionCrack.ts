/*Problem 14: [5 points]
Represents a 'crack' action.

Create a class named ActionCrack that extends Action.It has the following:
- constructor with three parameters that get passed to the super's constructor
- implementation for method validAction 
    call checkValidCrack from your rules class and return
    whether this move is valid 
- implement method performAction
    on crack:
    - the End Square is cracked 
    - if the End Square is occupied
        - the Piece on the End Square is removed from the board and the opponent's team
    - the Start Square's Piece speaks
    - the turn of the game is changed to the other player
*/

import { Action } from "./Action";
import { GameS25 } from "../elements/GameS25";
import { Location } from "../elements/Location";

export class ActionCrack extends Action {
    constructor(game: GameS25, startLocation: Location, endLocation: Location) {
        super(game, startLocation, endLocation);
    }

    validAction(): boolean {
        return this.game
            .getRules()
            .checkValidCrack(this.startLocation, this.endLocation);
    }

    performAction(): void {
        const board = this.game.getGameBoard();
        const startSquare = board.getSquare(this.startLocation);
        const endSquare = board.getSquare(this.endLocation);

        const piece = startSquare.getPiece();
        const target = endSquare.getPiece();

        if (!piece) return;

        console.log(piece.speak());

        // Crack the end square
        endSquare.crackThisSquare();

        // If occupied, remove the piece from board and opponent team
        if (target) {
            endSquare.removePiece();
            this.game.getOpponentTeam().removePieceFromTeam(target);
        }

        // Change turn
        this.game.changeTurn();
    }
}
