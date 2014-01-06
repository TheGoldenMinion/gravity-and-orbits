// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for vertical scale slider control
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' ),
    inherit = require( 'PHET_CORE/inherit' ),
    Dimension2 = require( 'DOT/Dimension2' ),
    HSlider = require( 'SUN/HSlider' );

  /**
   * @param {Number} x x-coordinate
   * @param {Number} y y-coordinate
   * @param {Property} targetProperty property for updating
   * @param {range} range range for targetProperty
   * @constructor
   */

  function Slider( x, y, targetProperty, range ) {
    Node.call( this, {x: x, y: y} );
    var options = {
      line: {
        width: 3,
        height: 140
      },
      track: {
        width: 28,
        height: 20
      }
    };

    var hslider = new HSlider( targetProperty, range, {
      trackSize: new Dimension2( options.line.height, options.line.width ),
      thumbSize: new Dimension2( options.track.height, options.track.width ),
      // custom thumb
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );
    hslider.rotate( -Math.PI / 2 );
    hslider.y = options.line.height + options.track.height / 2;
    hslider.x = -options.line.width / 2;
    this.addChild( hslider );
  }

  return inherit( Node, Slider );
} );