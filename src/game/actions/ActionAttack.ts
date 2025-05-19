/*Problem 11: [5 points]
Represents a 'attack' action.

Create a class named ActionAttack that extends Action.It has the following:
- constructor with three parameters that get passed to the super's constructor
- implement method validAction 
    call checkValidAttack from your rules class and return
    whether this move is valid 
- implement method performAction
    on an attack:
    - the Piece on the End Square is removed from the board
    - the Piece on the End Square is removed from the opponent's team
    - Piece on the Start Square is moved to the End Square
    - the Piece being attacked speaks
    - the turn of the game is changed to the other player
*/

import { Action } from "./Action";
import { GameS25 } from "../elements/GameS25";
import { Location } from "../elements/Location";

export class ActionAttack extends Action {
    constructor(game: GameS25, startLocation: Location, endLocation: Location) {
        super(game, startLocation, endLocation);
    }

    validAction(): boolean {
        return this.game
            .getRules()
            .checkValidAttack(this.startLocation, this.endLocation);
    }

    performAction(): void {
        const board = this.game.getGameBoard();
        const startSquare = board.getSquare(this.startLocation);
        const endSquare = board.getSquare(this.endLocation);

        const attacker = startSquare.getPiece();
        const target = endSquare.getPiece();

        if (!attacker || !target) return;

        // Remove target from board and opponent team
        endSquare.removePiece();
        this.game.getOpponentTeam().removePieceFromTeam(target);

        // Move attacker to end square
        endSquare.setPiece(attacker);
        startSquare.removePiece();
        attacker.increaseNumAttacks();

        // Target speaks
        console.log(target.speak());

        // Change turn
        this.game.changeTurn();
    }
}
