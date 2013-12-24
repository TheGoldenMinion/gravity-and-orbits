// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for Sun.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    RadialGradient = require( 'SCENERY/util/RadialGradient' ),
    Node = require( 'SCENERY/nodes/Node' ),
    Circle = require( 'SCENERY/nodes/Circle' );

  function Sun( coords, radius ) {
    Node.call( this, coords );

    this.view = new Circle( radius, {
      fill: new RadialGradient( radius * 0.3, -radius * 0.3, 1, radius * 0.3, -radius * 0.3, radius / 1.5 )
        .addColorStop( 0, '#fff' )
        .addColorStop( 1, '#ff0' )
    } );

    this.addChild( this.view );
  }

  return inherit( Node, Sun, {
    setRadius: function( r ) {
      this.view.setRadius( r );
    }
  } );
} );