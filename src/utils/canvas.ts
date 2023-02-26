import {Canvas, CanvasRenderingContext2D, createCanvas} from 'canvas'; // sudo pacman -S base-devel cairo pango libjpeg-turbo giflib libsvgtiny - https://github.com/Automattic/node-canvas/wiki
// @ts-ignore
import fs from 'fs';



class CustomCanvasBuilder {
    private readonly canvasSize: number;
    private readonly singlePixelSize: number;
    private readonly separatorSize: number;
    private readonly backgroundColor: string;
    private readonly separatorColor: string;
    private canvas: Canvas;
    private ctx: CanvasRenderingContext2D;

    public constructor(canvasSize: number, singlePixelSize: number, separatorSize: number, backgroundColor: string, separatorColor: string) {
        this.canvasSize = canvasSize;
        this.singlePixelSize = singlePixelSize;
        this.separatorSize = separatorSize;
        this.backgroundColor = backgroundColor;
        this.separatorColor = separatorColor;

        const finalCanvasSize = (this.singlePixelSize * this.canvasSize) + (this.separatorSize * this.canvasSize) + this.separatorSize

        this.canvas = createCanvas(finalCanvasSize, finalCanvasSize);
        this.ctx = this.canvas.getContext('2d')

        this.ctx.fillStyle = this.separatorColor;

        for (let i = 0; i < this.canvasSize+1; i++) {
            // Horizontal lines
            this.ctx.fillRect(0, (singlePixelSize * i) + (separatorSize * i), this.canvas.width, separatorSize)
            // Vertical lines
            this.ctx.fillRect((singlePixelSize * i) + (separatorSize * i), 0, separatorSize, this.canvas.height)

        }

        const horizontalOffset = {
            x: 0,
            y: singlePixelSize / 5
        }

        const verticalOffset = {
            x: singlePixelSize / 2,
            y: -20
        }

        // Set font size
        this.ctx.font = `${this.singlePixelSize/2}px Arial`;
        this.ctx.fillStyle = '#F00';

        for (let i = 1; i < canvasSize; i++) {
            const coordIndex = i;
            if (i == 10) {
                verticalOffset.x += 10
                horizontalOffset.x += 10
            }

            // Horizontal Numeration
            this.ctx.fillText(`${i}`, ((singlePixelSize * coordIndex) + (separatorSize * coordIndex) + (singlePixelSize / 2)) - horizontalOffset.x,  singlePixelSize - horizontalOffset.y)
            // Vertical Numeration
            this.ctx.fillText(`${i}`, singlePixelSize - verticalOffset.x, ((singlePixelSize * coordIndex) + (separatorSize * coordIndex) + (singlePixelSize / 2) - verticalOffset.y))
        }

    }

    public fillRectangle(x: number, y: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect((this.singlePixelSize * x) + (this.separatorSize * x) + this.separatorSize, (this.singlePixelSize * y) + (this.separatorSize * y) + this.separatorSize, this.singlePixelSize, this.singlePixelSize)

        return this.canvas.toBuffer('image/png');
    }

    public getCanvasSize() {
        return this.canvasSize - 1;
    }
}

let canvasArray: CustomCanvasBuilder[] = [];

function getCanvas(serverID: string){
    console.log(canvasArray)
    if (canvasArray[serverID] == undefined) {
        canvasArray[serverID] = new CustomCanvasBuilder(16, 64, 8, '#000000', '#444444')
    }
    return canvasArray[serverID];
}

module.exports = {
    getCanvas
}
