// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for scale slider.
 *
 * @author Andrey Zelenkov (Mlearner)
 */


define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SliderLine = require( 'view/scale-slider/SliderLine' );
  var SliderButton = require( 'view/scale-slider/SliderButton' );

  function ScaleSlider( model, x, y ) {
    var options = {
      range: {max: 1.5, min: 0.5},
      step: 0.1
    };
    Node.call( this, {x: x, y: y, scale: 0.63} );

    // add slide line
    this.addChild( new SliderLine( model.scaleProperty, options.range, 17, 0 ) );

    //Add buttons last so their hit areas will be in front for overlapping touch areas on touch devices

    // add plus button
    this.addChild( new SliderButton( 0, 0, model, options.range, options.step, true ) );

    // add minus button
    this.addChild( new SliderButton( 0, 190, model, options.range, options.step, false ) );
  }

  return inherit( Node, ScaleSlider );
} );