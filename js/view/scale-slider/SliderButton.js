// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of button scale control.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @param {Number} x x-coordinate
   * @param {Number} y y-coordinate
   * @param {model} model
   * @param {range} range working range
   * @param {Number} step step of scale changes
   * @param {Boolean} isIncrease type of button
   * @constructor
   */
  function SliderButton( x, y, model, range, step, isIncrease ) {
    var callback, sample, width = 25, height = 25;
    Node.call( this, {x: x - width / 2, y: y} );

    // create default view
    sample = new Node( {children: [new Rectangle( 0, 0, width, height, 2, 2, {fill: '#DBD485'} ), new Rectangle( 4, height / 2 - 1, width - 8, 2, {fill: 'black'} )]} );

    // increase or decrease view
    if ( isIncrease ) {
      sample.addChild( new Rectangle( width / 2 - 1, 4, 2, height - 8, {fill: 'black'} ) );
    }

    // callback (can be optimized by splitting to two functions)
    callback = function() {
      model.scale = Math.max( Math.min( model.scale + (isIncrease ? step : -step), range.max ), range.min );
    };

    // create button
    this.addChild( new RectanglePushButton( sample,
      {
        rectangleXMargin: 0,
        rectangleYMargin: 0,
        listener: callback
      } ) );

    //Increase the touch area in all directions except toward the slider knob, so that they won't interfere too much on touch devices
    var dilationSize = 15;
    var dilateLeft = dilationSize;
    var dilateRight = dilationSize;
    var dilateTop = isIncrease ? dilationSize : 0;
    var dilateBottom = isIncrease ? 0 : dilationSize;
    this.touchArea = Shape.bounds( new Bounds2( this.localBounds.minX - dilateLeft, this.localBounds.minY - dilateTop, this.localBounds.maxX + dilateRight, this.localBounds.maxY + dilateBottom ) );
  }

  return inherit( Node, SliderButton );
} );