import {Canvas, CanvasRenderingContext2D, createCanvas} from 'canvas'; // sudo pacman -S base-devel cairo pango libjpeg-turbo giflib libsvgtiny - https://github.com/Automattic/node-canvas/wiki
// @ts-ignore
import fs from 'fs';



class CustomCanvasBuilder {
    canvasSize: number;
    singlePixelSize: number;
    separatorSize: number;
    backgroundColor: string;
    separatorColor: string;
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;

    public constructor(canvasSize: number, singlePixelSize: number, separatorSize: number, backgroundColor: string, separatorColor: string) {
        this.canvasSize = canvasSize;
        this.singlePixelSize = singlePixelSize;
        this.separatorSize = separatorSize;
        this.backgroundColor = backgroundColor;
        this.separatorColor = separatorColor;

        const finalCanvasSize = (this.singlePixelSize * this.canvasSize) + (this.separatorSize * this.canvasSize) + this.separatorSize

        this.canvas = createCanvas(finalCanvasSize, finalCanvasSize);
        this.ctx = this.canvas.getContext('2d')

        for (let i = 0; i < this.canvasSize+1; i++) {
            // Horizontal lines
            this.ctx.fillRect(0, (singlePixelSize * i) + (separatorSize * i), this.canvas.width, separatorSize)
            // Vertical lines
            this.ctx.fillRect((singlePixelSize * i) + (separatorSize * i), 0, separatorSize, this.canvas.height)
        }

        this.ctx.fillStyle = this.backgroundColor;

        const horizontalOffset = {
            x: 0,
            y: singlePixelSize / 5
        }

        const verticalOffset = {
            x: singlePixelSize / 2,
            y: -20
        }

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
}
//
// let canvasSize = 16;
// // Adding one field, so we can have a 16x16 grid
// canvasSize += 1;
//
// // Each pixel is 64x64
// const singlePixelSize = 64;
// // Each separator is 16px thiccc
// const separatorSize = 8;
//
// // 32 pixels wide, 32 pixels tall
// // 32 * 64 = 2048
// // 32 * 8 = 256
// // 2048 + 256 = 2304

// const finalCanvasSize = (singlePixelSize * canvasSize) + (separatorSize * canvasSize) + separatorSize

// console.log(`Canvas size: ${finalCanvasSize}x${finalCanvasSize}`)



// ctx.fillStyle = '#777'
// Fill out the seperator lines, so there is a canvasSize, grid
// for (let i = 0; i < canvasSize+1; i++) {
//     // Horizontal lines
//     ctx.fillRect(0, (singlePixelSize * i) + (separatorSize * i), canvas.width, separatorSize)
//     // Vertical lines
//     ctx.fillRect((singlePixelSize * i) + (separatorSize * i), 0, separatorSize, canvas.height)
// }

// Write x and y coordinates inside the first boxes
// ctx.font = singlePixelSize/2+'px Arial';
// ctx.fillStyle = '#F00';
//
// const horizontalOffset = {
//     x: 0,
//     y: singlePixelSize / 5
// }
//
// const verticalOffset = {
//     x: singlePixelSize / 2,
//     y: -20
// }
//
// for (let i = 1; i < canvasSize; i++) {
//     const coordIndex = i;
//     if (i == 10) {
//         verticalOffset.x += 10
//         horizontalOffset.x += 10
//     }
//
//     // Horizontal Numeration
//     ctx.fillText(`${i}`, ((singlePixelSize * coordIndex) + (separatorSize * coordIndex) + (singlePixelSize / 2)) - horizontalOffset.x,  singlePixelSize - horizontalOffset.y)
//     // Vertical Numeration
//     ctx.fillText(`${i}`, singlePixelSize - verticalOffset.x, ((singlePixelSize * coordIndex) + (separatorSize * coordIndex) + (singlePixelSize / 2) - verticalOffset.y))
// }

// function getCanvasInfo(){
//     return canvasSize-1;
// }
//
// function fillRectangle(x: number, y: number, color: string) {
//     ctx.fillStyle = color;
//     ctx.fillRect((singlePixelSize * x) + (separatorSize * x) + separatorSize, (singlePixelSize * y) + (separatorSize * y) + separatorSize, singlePixelSize, singlePixelSize);
//
//     return canvas.toBuffer('image/jpeg');
// }

const canvas = new CustomCanvasBuilder(16, 64, 8, '#777', '#F00')

module.exports = {
    canvas
}
