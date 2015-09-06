
import PIXI from "pixi";
import * as parse from "parse";
import * as spritebank from "spritebank";
import $ from "jquery";

$(function() {
    var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor: 0x1099bb});
    document.body.appendChild(renderer.view);




    // create the root of the scene graph
    var stage = new PIXI.Container();

    var sprites = [];
    spritebank.fromFile("objects", ["objects", "people"], function(bank) {
        function randomSprite() {
            //var sprites = bank.sprites;
            var rand = Math.floor(Math.random()*bank.sprites.length);

            for (let s in sprites) {
                stage.removeChild(sprites[s]);
            }
            sprites = [];

            //let spriteinfo = bank.sprites[rand];
            let spriteinfo = bank.getByName("Bed");

            console.log(spriteinfo.Name);

            let posx = 200;
            let posy = 150;



            for(let i = 0; i < spriteinfo.num; i++) {
                let sprite = spriteinfo.sprite();
                //console.log(sprite);
                sprite.setActive(i);

                sprite.position.x = posx;
                sprite.position.y = posy;

                posx += 100;
                posy += 100;

                stage.addChild(sprite);

                sprites.push(sprite);
            }





            //sprite.rotation = -(Math.PI/2)*3;
        }
        randomSprite();
        //setInterval(randomSprite, 1000);
    });


    var scalex = 32;
    var scaley = 32;
    var size = new PIXI.Rectangle(14*scalex, 28*scaley, 6*scalex, 2*scaley);
    var basetexture = PIXI.BaseTexture.fromImage('data/objects.png');

    var texture = new PIXI.Texture(basetexture, size, size.clone(), null, false);
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);

    // center the sprite's anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // move the sprite to the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;

    //stage.addChild(sprite);

    // start animating
    animate();
    function animate() {
        requestAnimationFrame(animate);

        // just for fun, let's rotate mr rabbit a little
        //bunny.rotation += 0.1;

        //sprite._rot += 1;

        for (let s in sprites) {
            let sprite = sprites[s];
            sprite.rotation += 0.1;
        }

        // render the container
        renderer.render(stage);
    }
});