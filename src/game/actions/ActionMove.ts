/*Problem 10: [5 points]
Represents a 'move' action.

Create a class named ActionMove that extends Action.It has the following:
- constructor with three parameters that get passed to the super's constructor
- implement method validAction 
    call checkValidMove from your rules class and return
    whether this move is valid 
- implement method performAction
    on a move:
    - if the end square is not cracked
        the Piece on the Start Square is moved to the End Square   
    - if the end square is cracked 
       the current team loses this piece (removed from board and team)   
    - the Piece speaks
    - the turn of the game is changed to the other player
*/

import { Action } from "./Action";
import { GameS25 } from "../elements/GameS25";
import { Location } from "../elements/Location";

export class ActionMove extends Action {
    constructor(game: GameS25, startLocation: Location, endLocation: Location) {
        super(game, startLocation, endLocation);
    }

    validAction(): boolean {
        return this.game
            .getRules()
            .checkValidMove(this.startLocation, this.endLocation);
    }

    performAction(): void {
        const board = this.game.getGameBoard();
        const startSquare = board.getSquare(this.startLocation);
        const endSquare = board.getSquare(this.endLocation);
        const piece = startSquare.getPiece();

        if (!piece) return;

        if (!endSquare.isCracked()) {
            // Move piece to end square
            endSquare.setPiece(piece);
        } else {
            // Square is cracked - remove from team
            this.game.getCurrentTeam().removePieceFromTeam(piece);
        }

        // Remove from start square in either case
        startSquare.removePiece();

        // Piece speaks
        console.log(piece.speak());

        // Change turn
        this.game.changeTurn();
    }
}
