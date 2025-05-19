/* 
Problem 8: [20 points]
Create a class named Rules.  
This will represent the set of rules for each type of Piece we have in the game.
- member field for a string message
- member field for game (which should be of type GameS25)  // already done for you
- constructor with one game parameter that sets this field // already done for you
- accessors 
    - getMessage
- methods below - all have two Location parameters and return a boolean
    checkValidMove
    checkValidAttack
    checkValidRecruit
    checkValidSpawn
    checkValidCrack
    These methods should check the rules described in the HW10 Canvas assignment
    and return true if the action can be taken and false otherwise. If the action
    is not valid - the message field should be updated with a message to the player
    explaining why the action is not valid.  
    For example: "The piece you are moving does not belong to your team."

Tips:  
Implement the code for a valid move first. 
*/
import { GameS25 } from "./GameS25";
import { Location } from "./Location";
import { Piece } from "./Piece";
import { PieceScrat } from "./PieceScrat";

export class Rules {
    private message: string = "";

    constructor(protected game: GameS25) {}

    private isInBounds(loc: Location): boolean {
        return this.game.getGameBoard().inBounds(loc.getRow(), loc.getCol());
    }

    getMessage(): string {
        return this.message;
    }

    /**
     * Type-guard: true if piece is a Scrat (duck-typing on canCrack method)
     */
    private isScrat(piece: Piece): piece is PieceScrat {
        return typeof (piece as PieceScrat).canCrack === "function";
    }

    checkValidMove(startLocation: Location, endLocation: Location): boolean {
        if (!this.isInBounds(startLocation) || !this.isInBounds(endLocation)) {
            this.message = "One or both locations are out of bounds.";
            return false;
        }

        const startSquare = this.game.getGameBoard().getSquare(startLocation);
        const endSquare = this.game.getGameBoard().getSquare(endLocation);
        const piece = startSquare.getPiece();

        if (!piece) {
            this.message = "There is no piece at the start location.";
            return false;
        }

        if (
            piece.getTeamColor() !== this.game.getCurrentTeam().getTeamColor()
        ) {
            this.message =
                "The piece you are moving does not belong to your team.";
            return false;
        }

        // 🔒 Check if the piece is frozen
        if (
            "isFrozen" in piece &&
            typeof piece.isFrozen === "function" &&
            piece.isFrozen(startLocation)
        ) {
            this.message = "This piece is frozen and cannot move this turn.";
            return false;
        }

        if (!piece.allowableAction("move")) {
            this.message = "This piece cannot move.";
            return false;
        }

        if (!piece.validMovePath(startLocation, endLocation)) {
            this.message = "The move path is not valid for this piece.";
            return false;
        }

        if (!endSquare.isEmpty()) {
            this.message = "The destination square is not empty.";
            return false;
        }

        return true;
    }

    checkValidSpawn(startLocation: Location, endLocation: Location): boolean {
        if (!this.isInBounds(startLocation) || !this.isInBounds(endLocation)) {
            this.message = "One or both locations are out of bounds.";
            return false;
        }
        const startSquare = this.game.getGameBoard().getSquare(startLocation);
        const endSquare = this.game.getGameBoard().getSquare(endLocation);
        const piece = startSquare.getPiece();

        if (!piece) {
            this.message =
                "There is no piece to spawn from at the start location.";
            return false;
        }

        if (
            piece.getTeamColor() !== this.game.getCurrentTeam().getTeamColor()
        ) {
            this.message = "You can only spawn from your own pieces.";
            return false;
        }

        if (!piece.allowableAction("spawn")) {
            this.message = "This piece is not allowed to spawn.";
            return false;
        }

        if (!piece.canSpawn()) {
            this.message = "This piece has exceeded its spawn limit.";
            return false;
        }

        if (!endSquare.isEmpty()) {
            this.message = "The spawn destination is not empty.";
            return false;
        }

        return true;
    }

    checkValidAttack(startLocation: Location, endLocation: Location): boolean {
        if (!this.isInBounds(startLocation) || !this.isInBounds(endLocation)) {
            this.message = "One or both locations are out of bounds.";
            return false;
        }
        const startSquare = this.game.getGameBoard().getSquare(startLocation);
        const endSquare = this.game.getGameBoard().getSquare(endLocation);
        const piece = startSquare.getPiece();
        const target = endSquare.getPiece();

        if (!piece) {
            this.message = "There is no piece at the start location.";
            return false;
        }

        if (
            piece.getTeamColor() !== this.game.getCurrentTeam().getTeamColor()
        ) {
            this.message = "You can only attack with your own pieces.";
            return false;
        }

        if (!piece.allowableAction("attack")) {
            this.message = "This piece cannot attack.";
            return false;
        }

        if (!target || target.getTeamColor() === piece.getTeamColor()) {
            this.message = "You can only attack enemy pieces.";
            return false;
        }

        return true;
    }

    checkValidRecruit(startLocation: Location, endLocation: Location): boolean {
        if (!this.isInBounds(startLocation) || !this.isInBounds(endLocation)) {
            this.message = "One or both locations are out of bounds.";
            return false;
        }
        const startSquare = this.game.getGameBoard().getSquare(startLocation);
        const endSquare = this.game.getGameBoard().getSquare(endLocation);
        const piece = startSquare.getPiece();
        const target = endSquare.getPiece();

        if (!piece) {
            this.message =
                "There is no piece to recruit from at the start location.";
            return false;
        }

        if (
            piece.getTeamColor() !== this.game.getCurrentTeam().getTeamColor()
        ) {
            this.message = "You can only recruit with your own pieces.";
            return false;
        }

        if (!piece.allowableAction("recruit")) {
            this.message = "This piece cannot recruit.";
            return false;
        }

        if (!target || target.getTeamColor() === piece.getTeamColor()) {
            this.message = "You can only recruit enemy pieces.";
            return false;
        }

        return true;
    }

    checkValidCrack(startLocation: Location, endLocation: Location): boolean {
        // 1) both must be on the board
        if (!this.isInBounds(startLocation) || !this.isInBounds(endLocation)) {
            this.message = "One or both locations are out of bounds.";
            return false;
        }

        const startSquare = this.game.getGameBoard().getSquare(startLocation);
        const endSquare = this.game.getGameBoard().getSquare(endLocation);
        const piece = startSquare.getPiece();

        // 2) need a piece to crack from
        if (!piece) {
            this.message =
                "There is no piece to crack from at the start location.";
            return false;
        }

        // 3) must be your piece
        if (
            piece.getTeamColor() !== this.game.getCurrentTeam().getTeamColor()
        ) {
            this.message = "You can only crack with your own pieces.";
            return false;
        }

        const target = endSquare.getPiece();

        // 4) Scrat branch via type-guard
        if (this.isScrat(piece)) {
            // only forbid self-cracking
            if (target && target.getTeamColor() === piece.getTeamColor()) {
                this.message = "You cannot crack your own piece.";
                return false;
            }
            // Scrat may crack empty OR enemy-occupied
            return true;
        }

        // 5) non-Scrats must be allowed to crack
        if (!piece.allowableAction("crack")) {
            this.message = "This piece cannot crack.";
            return false;
        }

        // 6) must have a valid path (stubbed true for now)
        if (!piece.validMovePath(startLocation, endLocation)) {
            this.message = "The crack path is not valid for this piece.";
            return false;
        }

        // 7) non-Scrats may only crack empty squares
        if (target) {
            this.message = "Only Scrat can crack occupied squares.";
            return false;
        }

        return true;
    }

    checkValidFreeze(from: Location, to: Location): boolean {
        if (!this.isInBounds(from) || !this.isInBounds(to)) {
            this.message = "One or both locations are out of bounds.";
            return false;
        }

        const board = this.game.getGameBoard();
        const fromSquare = board.getSquare(from);
        const toSquare = board.getSquare(to);

        const fromPiece = fromSquare.getPiece();
        const toPiece = toSquare.getPiece();

        if (!fromPiece) {
            this.message = "There is no piece at the origin location.";
            return false;
        }

        if (
            fromPiece.getTeamColor() !==
            this.game.getCurrentTeam().getTeamColor()
        ) {
            this.message = "You can only use Freeze with your own piece.";
            return false;
        }

        if (!fromPiece.allowableAction("freeze")) {
            this.message = "This piece cannot use Freeze.";
            return false;
        }

        if (!toPiece) {
            this.message = "There is no enemy to freeze.";
            return false;
        }

        if (toPiece.getTeamColor() === fromPiece.getTeamColor()) {
            this.message = "You cannot freeze your own team.";
            return false;
        }

        // ✅ Check if adjacent (orthogonally)
        const rowDiff = Math.abs(from.getRow() - to.getRow());
        const colDiff = Math.abs(from.getCol() - to.getCol());
        if (Math.max(rowDiff, colDiff) !== 1) {
            this.message = "You can only freeze an adjacent enemy.";
            return false;
        }

        this.message = "Freeze is valid.";
        return true;
    }
}
