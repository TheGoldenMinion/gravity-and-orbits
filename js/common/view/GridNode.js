// Copyright 2014-2015, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * Constructor for GridNode
   * @param {Property.<ModelViewTransform>} transformProperty
   * @param {number} spacing - spacing between grid lines
   * @param {Vector2} center - center of the grid
   * @param {number} numGridLines - number grid lines on each side of the center
   * @param {Obejct} [options]
   * @constructor
   */
  function GridNode( transformProperty, spacing, center, numGridLines, options ) {

    options = _.extend( {
      lineWidth: 1,
      stroke: 'gray'
    }, options );

    Node.call( this );
    var path = new Path( null, options );
    this.addChild( path );

    transformProperty.link( function() {
      var i;
      var shape = new Shape();

      // horizontal lines
      for ( i = -numGridLines; i <= numGridLines; i++ ) {
        var y = i * spacing + center.y;
        var x1 = numGridLines * spacing + center.x;
        var x2 = -numGridLines * spacing + center.x;
        shape.moveTo( x1, y ).lineTo( x2, y );
      }

      // vertical lines
      for ( i = -numGridLines; i <= numGridLines; i++ ) {
        var x = i * spacing + center.x;
        var y1 = numGridLines * spacing + center.y;
        var y2 = -numGridLines * spacing + center.y;
        shape.moveTo( x, y1 ).lineTo( x, y2 );
      }

      path.shape = transformProperty.get().modelToViewShape( shape );
    } );

  }

  return inherit( Node, GridNode );
} );
