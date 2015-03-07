var core = require('../../core');

/**
 * The BlurYFilter applies a horizontal Gaussian blur to an object.
 *
 * @class
 * @extends AbstractFilter
 * @memberof PIXI.filters
 */
function BlurYFilter()
{
    core.AbstractFilter.call(this,
        // vertex shader
        require('fs').readFileSync(__dirname + '/blurY.vert', 'utf8'),
        // fragment shader
        require('fs').readFileSync(__dirname + '/blur.frag', 'utf8'),
        // set the uniforms
        {
            strength: { type: '1f', value: 1 }
        }
    );

    this.passes = 1;
    this.stength = 8;
}

BlurYFilter.prototype = Object.create(core.AbstractFilter.prototype);
BlurYFilter.prototype.constructor = BlurYFilter;
module.exports = BlurYFilter;

BlurYFilter.prototype.applyFilter = function (renderer, input, output, clear)
{
    var shader = this.getShader(renderer);

    this.uniforms.strength.value = this.strength / 8 / this.passes * (input.frame.height / input.size.height);

    if(this.passes === 1)
    {
        renderer.filterManager.applyFilter(shader, input, output, clear);
    }
    else
    {
        var renderTarget = renderer.filterManager.getRenderTarget(true);
        var flip = input;
        var flop = renderTarget;

        for(var i = 0; i < this.passes-1; i++)
        {
            renderer.filterManager.applyFilter(shader, flip, flop, clear);

           var temp = flop;
           flop = flip;
           flip = temp;
        }

        renderer.filterManager.applyFilter(shader, flip, output, clear);

        renderer.filterManager.returnRenderTarget(renderTarget);
    }
};


Object.defineProperties(BlurYFilter.prototype, {
    /**
     * Sets the strength of both the blur.
     *
     * @member {number}
     * @memberof BlurYFilter#
     * @default 2
     */
    blur: {
        get: function ()
        {
            return  this.strength;
        },
        set: function (value)
        {
            this.padding = value;
            this.strength = value;
        }
    },
});