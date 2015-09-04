
import PIXI from "pixi";
import * as parse from "parse";
import * as spritebank from "spritebank";
import $ from "jquery";

$(function() {
    var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor: 0x1099bb});
    document.body.appendChild(renderer.view);




    // create the root of the scene graph
    var stage = new PIXI.Container();

    var sprite;
    spritebank.fromFile("interface", function(bank) {
        function randomSprite() {
            var sprites = bank.sprites;
            var rand = Math.floor(Math.random()*sprites.length);

            stage.removeChild(sprite);

            sprite = new PIXI.Sprite(sprites[rand].texture);

            sprite.position.x = 200;
            sprite.position.y = 150;

            stage.addChild(sprite);
        }
        randomSprite();
        setInterval(randomSprite, 1000);
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

        // render the container
        renderer.render(stage);
    }
});