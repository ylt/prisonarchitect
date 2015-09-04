import * as parse from "parse";
import $ from "jquery";
import PIXI from "pixi";

export function fromFile(name, callback) {
    console.log("from file");
    $.get("data/" + name + ".spritebank", function (rawdata) {
        var data = parse.load(rawdata);
        var bank = new SpriteBank(name, data);
        if (callback) {
            callback(bank);
        }
    });
}

export class SpriteBank {
    constructor(name, data) {
        this.baseTexture = PIXI.BaseTexture.fromImage('data/ui.png');
        this.sprites = [];

        console.log(data);

        var sprites = data.nodes.Sprites[0].nodes["i"];
        for(let i in sprites) {
            try {
                this.sprites.push(new Sprite(this, sprites[i].properties));
            }
            catch (e) {
                console.log("fail", sprites[i].properties);
            }
            //console.log("sprite", sprites[sprite]);
        }

    }


}

class Sprite {
    constructor(bank, data) {
        this.bank = bank;
        this.data = data;

        var size = new PIXI.Rectangle(data.x*32, data.y*32, data.w*32, data.h*32);
        var texture = new PIXI.Texture(bank.baseTexture, size, size.clone(), null, false);
        //TODO: multiple textures (RotateType: http://devwiki.introversion.co.uk/pa/index.php/RotateTypes_Explained)
        this.texture = texture;
    }

    get Name() {
        return this.data.Name;
    }
}