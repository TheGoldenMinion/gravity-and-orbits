// Copyright 2002-2014, University of Colorado

/**
 * Shows the "trail" left behind by a Body as it moves over time, which disappears after about 2 orbits
 * The end of the tail is faded out, which is why we didn't simply use a PPath
 * This is named "Path" instead of "trail" since that is how it is supposed to appear to the students.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );

  // constants
  var STROKE_WIDTH = 3;
  var NUM_FADE_POINTS = 25;

  /**
   *
   * @param {Body} body
   * @param {Property<ModelViewTransform2>} transformProperty
   * @param {Property<boolean>} visibleProperty
   * @param {Color} color
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function PathNode( body, transformProperty, visibleProperty, color, canvasBounds ) {

    CanvasNode.call( this, { canvasBounds: canvasBounds } );
    var thisNode = this;

    //points in view space
    //private
    this.points = [];
    this.body = body;
    this.color = color;

    this.invalidatePaint();

    visibleProperty.link( function( isVisible ) {
      thisNode.visible = isVisible;
      thisNode.body.clearPath();
      thisNode.points = [];
//      thisNode.points.clear();
      thisNode.invalidatePaint();
    } );

    //Update when the Body path changes
    var listener = {
      pointAdded: function( point ) {
        var pt = transformProperty.get().modelToViewPosition( point );
        thisNode.points.push( pt );
        if ( thisNode.visibleProperty ) {
//          thisNode.setBounds( thisNode.getBounds( thisNode.points ) );
          thisNode.invalidatePaint();
        }
      },
      pointRemoved: function() {
        if ( thisNode.points.length > 0 ) {
          thisNode.points.shift();
        }
        if ( visibleProperty.get() ) {
//          thisNode.setBounds( thisNode.getBounds( thisNode.points ) );
          thisNode.invalidatePaint();
        }
      },
      cleared: function() {
        while ( thisNode.points.length ) { thisNode.points.pop(); }
//        thisNode.setBounds( thisNode.getBounds( thisNode.points ) );
        thisNode.invalidatePaint();

      }
    };
    this.body.addPathListener( listener );

    // this was a simpleObserver in Java
    transformProperty.link( function() {
      thisNode.body.clearPath();
    } );

  }

  return inherit( CanvasNode, PathNode, {

    // @param {CanvasContextWrapper} wrapper
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;
      var numSolidPoints = Math.min( this.body.getMaxPathLength() - NUM_FADE_POINTS, this.points.length );
      var numTransparentPoints = this.points.length - numSolidPoints;
      var i;

      context.strokeStyle = this.color.toCSS();
      context.strokeWidth = STROKE_WIDTH;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();

      //Create and render the solid part as a path.  New points are added at the tail of the list, so easiest to render backwards for fade-out.
      if ( this.points.length > 0 ) {
        context.moveTo( this.points[ this.points.length - 1 ].x, this.points[ this.points.length - 1 ].y );
      }
      for ( i = this.points.length - 2; i >= numTransparentPoints; i-- ) {
        context.lineTo( this.points[ i ].x, this.points[ i ].y );
      }
      context.stroke();

      //Draw the faded out part
      context.lineCap = 'butt';

      var faded = this.color;
      for ( i = numTransparentPoints - 1; i >= 0; i-- ) {
        //fade out a little bit each segment
        var a = (faded.a - 1 / NUM_FADE_POINTS);
        faded = new Color( faded.r, faded.g, faded.b, Math.max( 0, a ) );
        context.strokeStyle = faded.toCSS();
        context.beginPath();
        context.moveTo( this.points[ i + 1 ].x, this.points[ i + 1 ].y );
        context.lineTo( this.points[ i ].x, this.points[ i ].y );
        context.stroke();
      }
    },

    step: function( dt ) {
      this.invalidatePaint();
    },

    /**
     * Compute the bounds that contains the path, for repainting
     * TODO is this needed in the JS version?
     *
     * @private
     * @param points
     * @returns {*}
     */
    getBounds: function( points ) {
//      if ( points.length == 0 ) {
//        return new Rectangle();
//      }
//      else {
//        //            long start = System.currentTimeMillis();
//        var rect = new Rectangle.Number( points.get( 0 ).getX(), points.get( 0 ).getY(), 0, 0 );
//        for ( var point in points ) {
//          rect.add( point.getX(), point.getY() );
//        }
//        //            console.log( "elapsed = " + elapsed );
//        return RectangleUtils.expand( rect, STROKE_WIDTH, STROKE_WIDTH );
//      }
    }
  } );
} );
