/** This class represents the location
 * of the BoardSqare within the 2D
 * array of the GameBoard.
 */

export class Location {
    constructor(
        private row: number,
        private col: number,
    ) {}

    getRow(): number {
        return this.row;
    }

    getCol(): number {
        return this.col;
    }

    setRow(row: number): void {
        this.row = row;
    }

    setCol(col: number): void {
        this.col = col;
    }

    public equals(other: Location): boolean {
        return this.row === other.row && this.col === other.col;
    }
}
