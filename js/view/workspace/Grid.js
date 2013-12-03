// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of grid lines.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function Grid( model ) {
    var self = this;
    Node.call( this );

    var options = [
      {
        x0: -587.5,
        y0: -671,
        x1: 1200,
        y1: 500,
        delta: 84
      },
      {
        x0: -587.5,
        y0: -671,
        x1: 1200,
        y1: 500,
        delta: 84
      },
      {
        x0: -580,
        y0: -725,
        x1: 1200,
        y1: 500,
        delta: 72.5
      },
      {
        x0: -542,
        y0: -681,
        x1: 1200,
        y1: 500,
        delta: 136
      }
    ];

    var drawGrid = function() {
      self.removeAllChildren(); // remove previous grid

      // add grid if it's visible
      if ( model.grid ) {
        var opt = options[model.planetMode];
        for ( var i = 0; opt.x0 + i * opt.delta < opt.x1; i++ ) {
          self.addChild( new Path( Shape.lineSegment( opt.x0 + i * opt.delta, opt.y0, opt.x0 + i * opt.delta, opt.y1 ), {stroke: 'gray', lineWidth: 1} ) );
        }
        for ( i = 0; opt.y0 + i * opt.delta < opt.y1; i++ ) {
          self.addChild( new Path( Shape.lineSegment( opt.x0, opt.y0 + i * opt.delta, opt.x1, opt.y0 + i * opt.delta ), {stroke: 'gray', lineWidth: 1} ) );
        }
      }
    };

    model.planetModeProperty.link( function() {
      drawGrid();
    } );

    model.gridProperty.link( function() {
      drawGrid();
    } );
  }

  return inherit( Node, Grid );
} );