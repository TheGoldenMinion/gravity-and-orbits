// Copyright 2015, University of Colorado Boulder

/**
 * Shows the "trail" left behind by a Body as it moves over time, which disappears after about 2 orbits
 * This is named "Path" instead of "trail" since that is how it is supposed to appear to the students.
 *
 * Note: In the Java sim this was PathNode and there was one Node for each body. For performance reasons, it
 * has been changed so that there is just one CanvasNode shared between all of the bodies.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var STROKE_WIDTH = 3;

  /**
   *
   * @param {Body} bodies
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} canvasBounds
   * @param {Object} [options]
   * @constructor
   */
  function PathsCanvasNode( bodies, transformProperty, visibleProperty, canvasBounds, options ) {

    options = _.extend( {
      maxPathLength: 1150 // max path length for the trace that follows the planets
    }, options );

    assert && assert( canvasBounds, 'Paths canvas must define bounds' );
    CanvasNode.call( this, {
      canvasBounds: canvasBounds,
      preventFit: true
    } );
    var self = this;
    var i;

    // @private
    this.canvasBounds = canvasBounds;

    // @private - a map tracking each body and its associated points
    this.namedPoints = {}; // @private
    for ( i = 0; i < bodies.length; i++ ) {
      this.namedPoints[ bodies[ i ].name ] = new NamedPoints( bodies[ i ].name );
    }

    // @private
    this.transformProperty = transformProperty;

    // when transform changes, update max path length so that the length is ~85% of the orbit,
    // relative to the center of the canvas bounds (and therefore the central body) and
    // transform all body points and re paint the canvas
    // disposal unnecessary, the canvas node exists for life of sim
    transformProperty.link( function( transform ) {
      for ( var i = 0; i < bodies.length; i++ ) {
        var body = bodies[ i ];
        // var initialPosition = transform.modelToViewPosition( body.positionProperty.initialValue );
        // var distToCenter = canvasBounds.center.minus( initialPosition ).magnitude();

        // // if the initial position is too close to the center,
        // // default path length is the width of the bounds
        // if ( distToCenter < 1 ) {
        //   body.maxPathLength = canvasBounds.width;
        // }
        // else {
        //   var pathLengthBuffer = 0;
        //   if ( body.pathLengthBuffer > 0 ) {
        //     pathLengthBuffer = transform.modelToViewDeltaX( body.pathLengthBuffer );
        //   }
        //   var maxPathLength = 2 * Math.PI * distToCenter * 0.85 + pathLengthBuffer;
        //   body.maxPathLength = maxPathLength;
        // }

        // when the transform changes, we want to re-transform all points in a body
        // path and then re paint the canvas
        self.namedPoints[ body.name ].points = [];

        for ( var j = 0; j < body.path.length; j++ ) {
          var point = body.path[ j ];
          var pt = transformProperty.get().modelToViewPosition( point );
          self.namedPoints[ body.name ].points.push( pt );
        }
      }

      self.invalidatePaint();
    } );

    this.bodies = bodies; // @private

    visibleProperty.link( function( isVisible ) {
      self.visible = isVisible;
      for ( i = 0; i < bodies.length; i++ ) {
        self.namedPoints[ bodies[ i ].name ].points = [];
        self.bodies[ i ].clearPath();
      }
      self.invalidatePaint();
    } );

    // @private - listener for when a point is added, bound by thisNode
    // created to avoid excess closures every time a point is removed
    // @param {string} bodyName - used to look up points associated with the desired body's trail
    this.pointAddedListener = function( point, bodyName ) {
      var pt = transformProperty.get().modelToViewPosition( point );

      // 'this' is defined by bind in addListener
      var namedPoints = this.namedPoints[ bodyName ];
      namedPoints.points.push( pt );
      if ( visibleProperty.get() ) {
        this.invalidatePaint();
      }
    };

    // @private - listener for when a point is removed, bound by thisNode
    // created to avoid excess closures every time a point is removed
    // @param {string} bodyName - used to look up points associated with the desired body's trail
    this.pointRemovedListener = function( bodyName ) {

      // 'this' defined by bind in addListener
      var namedPoints = this.namedPoints[ bodyName ];
      if ( namedPoints.points.length > 0 ) {
        namedPoints.points.shift();
      }
      if ( visibleProperty.get() ) {
        this.invalidatePaint();
      }
    };

    // @private - listener for when date is cleared, bound by thisNode
    // created to avoid excess closures every time date is cleared
    // @param {string} bodyName - used to look up points associated with the desired body's trail
    this.clearedListener = function( bodyName ) {

      // 'this' is defined by bind
      var namedPoints = this.namedPoints[ bodyName ];
      while ( namedPoints.points.length ) { namedPoints.points.pop(); }
      this.invalidatePaint();
    };

    // add listeners to each body
    for ( i = 0; i < bodies.length; i++ ) {
      var body = bodies[ i ];

      body.pointAddedEmitter.addListener( self.pointAddedListener.bind( self ) );
      body.pointRemovedEmitter.addListener( self.pointRemovedListener.bind( self ) );
      body.clearedEmitter.addListener( self.clearedListener.bind( self ) );
    }
  }

  gravityAndOrbits.register( 'PathsCanvasNode', PathsCanvasNode );

  inherit( CanvasNode, PathsCanvasNode, {

    /**
     * @private
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      // var j;

      var bounds = this.canvasBounds;
      context.clearRect( bounds.getX(), bounds.getY(), bounds.getWidth(), bounds.getHeight() );

      // draw the path for each body one by one
      for ( var i = 0; i < this.bodies.length; i++ ) {
        var body = this.bodies[ i ];
        var points = this.namedPoints[ body.name ].points;

        // var maxPathLength = body.maxPathLength;
        // var fadePathLength = body.maxPathLength * 0.15; // fade length is ~15% of the path

        // context.strokeStyle = body.color.toCSS();
        // context.lineWidth = STROKE_WIDTH;
        // context.lineCap = 'round';
        // context.lineJoin = 'round';

        if ( points.length > 0 ) {
          context.moveTo( points[ 0 ].x, points[ 0 ].y );
        }

        var j = 0;
        // if ( body.modelPathLength > body.maxPathLength * 0.90 ) {

        //   // fade out the percentLarger portion of the path
        //   var percentLarger = 1 - ( body.maxPathLength * 0.90 ) / body.modelPathLength;

        //   // index where the path should be fully opaque
        //   var opaquePoint = Math.floor( percentLarger * body.path.length );

        //   // index where the path should be fully transparent
        //   var transparentPoint = 0;

        //   for ( var k = 0; k < opaquePoint; k++ ) {

        //     // fade out a little bit each segment
        //     var alpha = Util.linear( opaquePoint, transparentPoint, 1, 0, k );

        //     // format without Color to avoid unnecessary allocation
        //     var baseColor = body.color;
        //     var fade = 'rgba( ' + baseColor.r + ', ' + baseColor.g + ', ' + baseColor.b + ', ' + alpha + ' )';

        //     context.beginPath();
        //     context.strokeStyle = fade;
        //     context.lineWidth = STROKE_WIDTH;
        //     context.lineCap = 'round';
        //     context.lineJoin = 'round';
        //     context.moveTo( points[ k ].x, points[ k ].y );
        //     context.lineTo( points[ k + 1 ].x, points[ k + 1 ].y );
        //     context.stroke();

        //     // incrememnt the path counter as we step through transparent segments
        //     j++
        //   }
        // }


        // draw the remaining path in whight
        context.beginPath();
        context.strokeStyle = body.color.toCSS();
        context.lineWidth = STROKE_WIDTH;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        while( j < points.length - 1 ) {
          context.lineTo( points[ j ].x, points[ j ].y );
          j++;
        }
        context.stroke();

        console.log( points.length );

        // j = points.length - 1;
        // body.pathLength = 0;
        // var segDifX;
        // var segDifY;
        // var segLength;
        // while ( body.pathLength < maxPathLength - fadePathLength && j > 0 ) {
        //   context.lineTo( points[ j ].x, points[ j ].y );
        //   if ( j > 1 ) {
        //     // increment the path length by the length of the added segment
        //     segDifX = points[ j ].x - points[ j - 1 ].x;
        //     segDifY = points[ j ].y - points[ j - 1 ].y;

        //     // avoid using vector2 to prevent excess object allocation
        //     segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
        //     body.pathLength += segLength;
        //   }
        //   j--;
        // }
        // context.stroke();

        // // Draw the faded out part
        // context.lineCap = 'butt';
        // var faded = body.color;

        // while ( body.pathLength < maxPathLength && j > 0 ) {
        //   assert && assert( body.pathLength > maxPathLength - fadePathLength, 'the path length is too small to start fading' );

        //   // fade out a little bit each segment
        //   var alpha = Util.linear( maxPathLength - fadePathLength, maxPathLength, 1 , 0, body.pathLength );

        //   // format without Color to avoid unnecessary allocation
        //   var fade = 'rgba( ' + faded.r + ', ' + faded.g + ', ' + faded.b + ', ' + alpha + ' )';

        //   context.beginPath();
        //   context.strokeStyle = fade;
        //   context.moveTo( points[ j + 1 ].x, points[ j + 1 ].y );
        //   context.lineTo( points[ j ].x, points[ j ].y );
        //   context.stroke();

        //   // increment the path length by the length of the added segment
        //   segDifX = points[ j ].x - points[ j - 1 ].x;
        //   segDifY = points[ j ].y - points[ j - 1 ].y;

        //   // avoid using vector2 to prevent excess object allocation
        //   segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
        //   body.pathLength += segLength;
        //   j--;
        // }

        // if ( body.pathLength > maxPathLength ) {
        //   while ( j >= 0 ) {
        //     body.path.shift();
        //     points.shift();
        //     j--;
        //   }
        // }
      }
    }
  } );

  /**
   * Constructor.  Named points assigns an array of points a name so
   * that it can be looked up outside of a closure.
   *
   * @param  {string} name
   * @constructor
   */
  function NamedPoints( name ) {
    this.name = name;
    this.points = [];
  }

  gravityAndOrbits.register( 'NamedPoints', NamedPoints );

  inherit( Object, NamedPoints );

  return PathsCanvasNode;

} );
