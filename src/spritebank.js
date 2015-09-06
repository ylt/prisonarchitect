import * as parse from "parse";
import $ from "jquery";
import PIXI from "pixi";

export function fromFile(name, basetextures, callback) {
    console.log("from file");
    $.get("data/" + name + ".spritebank", function (rawdata) {
        var data = parse.load(rawdata);
        var bank = new SpriteBank(name, basetextures, data);
        if (callback) {
            callback(bank);
        }
    });
}

export class SpriteBank {
    constructor(name, basetextures, data) {
        //this.baseTexture = PIXI.BaseTexture.fromImage('data/combined.png');

        this.baseTextures = [];
        for (let i in basetextures) {
            this.baseTextures.push(PIXI.BaseTexture.fromImage('data/'+basetextures[i]+'.png'));
        }

        this.sprites = [];

        console.log(data);

        var sprites = data.nodes.Sprites[0].nodes["i"];
        for(let i in sprites) {
            try {
                this.sprites.push(new SpriteInfo(this, sprites[i].properties));
            }
            catch (e) {
                console.log("fail", sprites[i].properties);
            }
            //console.log("sprite", sprites[sprite]);
        }

    }


    getByName(name) {
        for(let i in this.sprites) {
            let sprite = this.sprites[i];
            if (sprite.Name == name) {
                return sprite;
            }
        }
    }

}

class SpriteInfo {
    constructor(bank, data) {
        this.bank = bank;
        this.data = data;

        /*var size = new PIXI.Rectangle(data.x*32, data.y*32, data.w*32, data.h*32);
         //var texture = new PIXI.Texture(bank.baseTexture, size, size.clone(), null, false);
         //TODO: multiple textures (RotateType: http://devwiki.introversion.co.uk/pa/index.php/RotateTypes_Explained)
         this.texture = this.getTexture(data.x, data.y, data.w, data.h);*/

        this.num = [1,3,2,3,8,8][data.RotateType];

    }
    doTextures() {
        this.textures = [];
        let data = this.data;
        let yOffset = 0;
        if (data.TopAligned == "false") {
            yOffset = data.h-data.w;
        }

        if (data.RotateType == 0) {
            var texture = this.getTexture(data.x, data.y, data.w, data.h);
            this.textures.push(texture);
        }
        else if (data.RotateType == 1) {
            let x = data.x;

            //front
            this.textures.push(this.getTexture(x, data.y, data.w, data.h));
            x += data.w;

            //back
            this.textures.push(this.getTexture(x, data.y, data.w, data.h));
            x += data.w;

            //side
            this.textures.push(this.getTexture(x, data.y+yOffset, data.h, data.w));
        }
        else if (data.RotateType == 2) {
            let x = data.x;

            //front
            this.textures.push(this.getTexture(x, data.y, data.w, data.h));
            x += data.w;

            //side
            this.textures.push(this.getTexture(x, data.y+yOffset, data.h, data.w));
            x += data.w;
        }
        else if (data.RotateType == 3) {
            let x = data.x;
            for(let i = 0; i < 3; i++) {
                var texture = this.getTexture(x, data.y, data.w, data.h);
                this.textures.push(texture);
                x += data.x;
            }
        }
        else if (data.RotateType == 5 || data.RotateType == 6) {
            let x = data.x;
            for(let i = 0; i < 8; i++) {
                var texture = this.getTexture(x, data.y, data.w, data.h);
                this.textures.push(texture);
                x += data.x;
            }
        }

    }

    getTexture(x, y, w, h) {
        let sheet = Math.floor(y/64);
        y = y % 64;

        if (x > 64) {
            console.log("beyond", this.data.Name);
        }
        //console.log("sheet", sheet, y, this.data.Name);

        var size = new PIXI.Rectangle(x*32, y*32, w*32, h*32);
        var texture = new PIXI.Texture(this.bank.baseTextures[sheet], size, size.clone(), null, false);
        return texture;
    }

    get Name() {
        return this.data.Name;
    }

    sprite() {
        this.doTextures();
        return new Sprite(this);
    }
}

class Sprite extends PIXI.Sprite {
    constructor(spriteinfo) {
        super(spriteinfo.textures[0]);
        this.info = spriteinfo;
        this._rot = 0;
        this.anchor = {x: 0.5, y: 0.5}
    }

    get rot() {
        return this._rot;
    }

    set rot(value) {
        this._rot = value;
    }

    setActive(face) {
        if (face < this.info.textures.length) {
            this.texture = this.info.textures[face];
        }
    }
}