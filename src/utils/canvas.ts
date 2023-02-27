import {Canvas, CanvasRenderingContext2D, createCanvas} from 'canvas'; // sudo pacman -S base-devel cairo pango libjpeg-turbo giflib libsvgtiny - https://github.com/Automattic/node-canvas/wiki
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import GIFEncoder from 'gifencoder';

import CustomDatabase from './database';


class CustomCanvasBuilder {
    private readonly canvasSize: number;
    private readonly singlePixelSize: number;
    private readonly separatorSize: number;
    private readonly backgroundColor: string;
    private readonly separatorColor: string;
    private readonly finalCanvasSize: number;
    private readonly guildID: string;
    private canvas: Canvas;
    private ctx: CanvasRenderingContext2D;

    public constructor(canvasSize: number, singlePixelSize: number, separatorSize: number, backgroundColor: string, separatorColor: string, guildID: string) {
        try {
            // call function to add guild if it doesn't exist
            database.addGuild(guildID, canvasSize, singlePixelSize, separatorSize, backgroundColor, separatorColor);
        } catch (e) {
            console.log('Error while adding guild to database: ')
            console.log(e)
        }

        this.canvasSize = canvasSize;
        this.singlePixelSize = singlePixelSize;
        this.separatorSize = separatorSize;
        this.backgroundColor = backgroundColor;
        this.separatorColor = separatorColor;
        this.guildID = guildID;

        this.finalCanvasSize = (this.singlePixelSize * this.canvasSize) + (this.separatorSize * this.canvasSize) + this.separatorSize

        const {canvas, ctx} = this.initCanvas();
        this.canvas = canvas;
        this.ctx = ctx;
    }

    private initCanvas() {
        const canvas = createCanvas(this.finalCanvasSize, this.finalCanvasSize);
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = this.separatorColor;

        for (let i = 0; i < this.canvasSize + 1; i++) {
            // Horizontal lines
            ctx.fillRect(0, (this.singlePixelSize * i) + (this.separatorSize * i), canvas.width, this.separatorSize)
            // Vertical lines
            ctx.fillRect((this.singlePixelSize * i) + (this.separatorSize * i), 0, this.separatorSize, canvas.height)
        }

        const horizontalOffset = {
            x: 0,
            y: this.singlePixelSize / 5
        }

        const verticalOffset = {
            x: this.singlePixelSize / 2,
            y: -20
        }

        // Set font size
        ctx.font = `${this.singlePixelSize / 2}px Arial`;
        ctx.fillStyle = '#F00';

        for (let i = 1; i < this.canvasSize; i++) {
            const coordIndex = i;
            if (i == 10) {
                verticalOffset.x += 10
                horizontalOffset.x += 10
            }

            // Horizontal Numeration
            ctx.fillText(`${i}`, ((this.singlePixelSize * coordIndex) + (this.separatorSize * coordIndex) + (this.singlePixelSize / 2)) - horizontalOffset.x, this.singlePixelSize - horizontalOffset.y)
            // Vertical Numeration
            ctx.fillText(`${i}`, this.singlePixelSize - verticalOffset.x, ((this.singlePixelSize * coordIndex) + (this.separatorSize * coordIndex) + (this.singlePixelSize / 2) - verticalOffset.y))
        }
        return {canvas: canvas, ctx: ctx}
    }

    public gifFillRectangle(x: number, y: number, color: string) {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const gif = new GIFEncoder(this.finalCanvasSize, this.finalCanvasSize);

        gif.start();
        gif.setRepeat(0);
        gif.setDelay(500);
        gif.setQuality(10);

        // @ts-ignore
        gif.addFrame(canvas.getContext('2d'))
        ctx.fillStyle = color;
        ctx.fillRect((this.singlePixelSize * x) + (this.separatorSize * x) + this.separatorSize, (this.singlePixelSize * y) + (this.separatorSize * y) + this.separatorSize, this.singlePixelSize, this.singlePixelSize)
        // @ts-ignore
        gif.addFrame(canvas.getContext('2d'))
        gif.finish();
        return gif.out.getData();
    }

    public fillRectangle(x: number, y: number, color: string) {
        try {
            database.addGuildPixel(this.guildID, x, y, color);
        } catch (e) {
            console.log('Error while adding guild pixel to database: ')
            console.log(e)
        }

        this.ctx.fillStyle = color;
        this.ctx.fillRect((this.singlePixelSize * x) + (this.separatorSize * x) + this.separatorSize, (this.singlePixelSize * y) + (this.separatorSize * y) + this.separatorSize, this.singlePixelSize, this.singlePixelSize)

        return this.canvas.toBuffer('image/png');
    }

    public async loadGuildPixels() {
        // check if guild has pixels in database
        try {
            const pixels = await database.getGuildPixels(this.guildID);
            if (pixels) {
                for (let i = 0; i < pixels.length; i++) {
                    this.ctx.fillStyle = pixels[i].color;
                    const x = pixels[i].x;
                    const y = pixels[i].y;
                    this.ctx.fillRect((this.singlePixelSize * x) + (this.separatorSize * x) + this.separatorSize, (this.singlePixelSize * y) + (this.separatorSize * y) + this.separatorSize, this.singlePixelSize, this.singlePixelSize)
                }
            }
        } catch (e) {
            console.log('Error while getting guild pixels from database: ')
            console.log(e)
        }
    }

    public getCanvasSize() {
        return this.canvasSize - 1;
    }

    public getCanvasBuffer() {
        return this.canvas.toBuffer('image/png');
    }

    public async getCanvasAnimationBuffer() {
        // Get all pixels placements from database
        const pixels = await database.getGuildPixels(this.guildID);
        const {canvas, ctx} = this.initCanvas();


        if (pixels) {
            const gif = new GIFEncoder(this.finalCanvasSize, this.finalCanvasSize);
            gif.start();
            gif.setRepeat(0);
            gif.setDelay(250);
            gif.setQuality(10);

            for (let i = 0; i < pixels.length; i++) {
                ctx.fillStyle = pixels[i].color;
                const x = pixels[i].x;
                const y = pixels[i].y;
                ctx.fillRect((this.singlePixelSize * x) + (this.separatorSize * x) + this.separatorSize, (this.singlePixelSize * y) + (this.separatorSize * y) + this.separatorSize, this.singlePixelSize, this.singlePixelSize)
                // @ts-ignore
                gif.addFrame(canvas.getContext('2d'));
            }
            gif.finish();
            return gif.out.getData();
        }
    }
}

let canvasArray: CustomCanvasBuilder[] = [];
const database = new CustomDatabase();

async function getCanvas(serverID: any) {
    console.log('Getting canvas for server: ' + serverID)
    if (canvasArray[serverID] == undefined) {
        canvasArray[serverID] = await new CustomCanvasBuilder(16, 64, 6, '#000000', '#222', serverID)
    }

    await canvasArray[serverID].loadGuildPixels();

    return canvasArray[serverID];
}

module.exports = {
    getCanvas,
    database
}
