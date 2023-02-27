// @ts-ignore
import sqlite from "sqlite3";

class CustomDatabase{
    private readonly db: sqlite.Database;

    constructor() {
        this.db = new sqlite.Database('./database.db');
        // Create a table for each guild, if it doesn't exist
        this.db.run("CREATE TABLE IF NOT EXISTS guilds (id TEXT PRIMARY KEY, canvas_size INTEGER, single_pixel_size INTEGER, separator_size INTEGER, background_color TEXT, separator_color TEXT, canvasBlob TEXT)");
        // Create table for each guild set pixels, with the guild id as a foreign key, a setIndex (for the order of the pixels), the x coordinate, the y coordinate, and the color
        this.db.run("CREATE TABLE IF NOT EXISTS guilds_pixels (guild_id TEXT, setIndex INTEGER, x INTEGER, y INTEGER, color TEXT, FOREIGN KEY(guild_id) REFERENCES guilds(id))");

        // Create a table for storing userIDs to ban users from using the bot
        this.db.run("CREATE TABLE IF NOT EXISTS banned_users (id TEXT PRIMARY KEY)");

        // show all tables
        this.db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, rows) => {
            console.log(rows);
        });
    }

    public async isUserBanned(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM banned_users WHERE id = ?', [userId], (err, row) => {
                if(err){
                    reject(err);
                }else{
                    if(row){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
            });
        });
    }

    public async banUser(userId: string) {
        await this.db.run('INSERT or IGNORE INTO banned_users (id) VALUES (?)', [userId]);
        console.log(`Banned user ${userId} from using the bot`);
    }

    public getDatabase(): sqlite.Database {
        return this.db;
    }

    public addGuild(guildId: string, canvasSize: number, singlePixelSize: number, separatorSize: number, backgroundColor: string, separatorColor: string) {
        this.db.run('INSERT or IGNORE INTO guilds (id, canvas_size, single_pixel_size, separator_size, background_color, separator_color) VALUES (?, ?, ?, ?, ?, ?)', [guildId, canvasSize, singlePixelSize, separatorSize, backgroundColor, separatorColor]);
        console.log(`Added guild ${guildId} to database`);
    }

    public getGuild(guildId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM guilds WHERE id = ?', [guildId], (err, row) => {
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            });
        });
    }

    public getGuildPixels(guildId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM guilds_pixels WHERE guild_id = ?', [guildId], (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        });
    }

    private addGuildPixelPriv(guildId: string, setIndex: number, x: number, y: number, color: string) {
        this.db.run('INSERT INTO guilds_pixels (guild_id, setIndex, x, y, color) VALUES (?, ?, ?, ?, ?)', [guildId, setIndex, x, y, color]);
    }
    public getLatestSetIndex(guildId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT MAX(setIndex) FROM guilds_pixels WHERE guild_id = ?', [guildId], (err, row) => {
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            });
        });
    }
    public addGuildPixel(guildId: string, x: number, y: number, color: string) {
        // Get the last setIndex
        this.getLatestSetIndex(guildId).then((row) => {
            let setIndex = 0;
            if(row['MAX(setIndex)'] != null){
                setIndex = row['MAX(setIndex)'] + 1;
            }
            this.addGuildPixelPriv(guildId, setIndex, x, y, color);
        })
    }

}

export default CustomDatabase;