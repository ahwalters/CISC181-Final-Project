import {
    BindAttribute,
    BindVisibleToBoolean,
    BindStyle,
    BindStyleToNumberAppendPx,
    Click,
    Notifier,
    WebzComponent,
} from "@boots-edu/webz";
import html from "./square-view.component.html";
import css from "./square-view.component.css";
import { BoardSquare } from "../../game/elements/BoardSquare";
import { Location } from "../../game/elements/Location";

export class SquareViewComponent extends WebzComponent {
    private squareData: BoardSquare;
    private location: Location;

    public clickedSquare = new Notifier<Location>();

    // 1) bind the square’s background color
    @BindStyle("square", "backgroundColor")
    private squareColor: string = "black";

    // 2) bind square size (width & height)
    @BindStyleToNumberAppendPx("square", "width")
    @BindStyleToNumberAppendPx("square", "height")
    private squareSize: number = 50;

    // 3) hide/show the <image> tag
    @BindVisibleToBoolean("image")
    private hasImage: boolean = false;

    // 4) bind the image’s src attr
    @BindAttribute("image", "src", (imgName: string) => "assets/" + imgName)
    public imgName: string = "";

    // 5) style the image box
    @BindStyle("image", "backgroundColor")
    private imageColor: string = "green";
    @BindStyleToNumberAppendPx("image", "width")
    @BindStyleToNumberAppendPx("image", "height")
    private imageSize: number = 30;
    @BindStyleToNumberAppendPx("image", "padding")
    private imagePadding: number = 10;

    @BindStyle("square", "outline")
    private outlineStyle: string = "none";

    constructor(squareData: BoardSquare, location: Location) {
        super(html, css); // ← important!
        this.squareData = squareData;
        this.location = location;

        const row = location.getRow();
        const col = location.getCol();
        const isEvenRow = row % 2 === 0;
        const isEvenCol = col % 2 === 0;

        this.squareColor = isEvenRow === isEvenCol ? "white" : "gray";

        // pick the right image (crack, piece, or empty)
        this.setImage(squareData);

        /*
        console.log(
            "Rendering square at",
            this.location.getRow(),
            this.location.getCol(),
        );
        */
    }

    setImage(square: BoardSquare): void {
        if (square.isCracked()) {
            this.imgName = "";
            this.imgName = "cracked_tile.png";
            this.hasImage = true;
            this.imageColor = this.squareColor;
        } else {
            const piece = square.getPiece();

            if (piece !== null) {
                this.imgName = "";
                this.imgName = piece.getImageName();
                this.hasImage = true;
                this.imageColor = "";
            } else {
                this.imgName = "";
                this.hasImage = false;
            }
        }
    }

    public setHighlightStart(loc: Location): void {
        if (this.location.equals(loc)) {
            this.outlineStyle = "3px solid green";
        } else {
            this.outlineStyle = "none";
        }
    }

    public setHighlightEnd(loc: Location): void {
        if (this.location.equals(loc)) {
            this.outlineStyle = "3px solid purple";
        } else if (this.outlineStyle !== "3px solid green") {
            this.outlineStyle = "none";
        }
    }

    @Click("square")
    private onClick() {
        this.clickedSquare.notify(this.location);
    }
}
