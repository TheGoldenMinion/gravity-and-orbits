// Copyright 2002-2014, University of Colorado

/**
 * This is the PNode that renders the content of a physical body, such as a planet or space station.  This component is separate from
 * BodyNode since it is used to create icons.  It is also used to be able to switch between rendering types (i.e. image vs cartoon sphere) without
 * changing any other characteristics of the PNode.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Vector2 = require( 'DOT/Vector2' );
//  var GravityAndOrbitsApplication = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsApplication' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var Node = require( 'SCENERY/nodes/Node' );

  // static class: SwitchableBodyRenderer
  /**
   * This SwitchableBodyRenderer displays one representation when the object is at a specific mass, and a different renderer
   * otherwise.  This is so that (e.g.) the planet can be drawn with an earth image when its mass is equal to earth mass
   * or otherwise drawn as a sphere with a gradient paint.
   *
   * @param body
   * @param targetMass
   * @param targetBodyRenderer
   * @param defaultBodyRenderer
   * @constructor
   */
  function SwitchableBodyRenderer( body, targetMass, targetBodyRenderer, defaultBodyRenderer ) {

    BodyRenderer.call( this, body );
    var thisRenderer = this;

    this.targetBodyRenderer = targetBodyRenderer;

    //private
    this.defaultBodyRenderer = defaultBodyRenderer;

    body.massProperty().link( function() {
      thisRenderer.removeAllChildren();
      thisRenderer.addChild( ( body.getMass() == targetMass ) ? targetBodyRenderer : defaultBodyRenderer );
    } );
  }

  inherit( BodyRenderer, SwitchableBodyRenderer, {
    setDiameter: function( viewDiameter ) {
      this.targetBodyRenderer.setDiameter( viewDiameter );
      this.defaultBodyRenderer.setDiameter( viewDiameter );
    }
  } );

  // static class: SphereRenderer
  /**
   * Render a SphericalNode for the body.
   *
   * Constructor 1:
   * @param color
   * @param highlight
   * @param viewDiameter
   * @constructor
   *
   * Construcotr 2:
   * @param body
   * @param viewDiameter
   * @constructor
   */
  function SphereRenderer( color, highlight, viewDiameter ) {

    if ( viewDiameter ) {
      this.color = color;
      this.highlight = highlight;
    }

    else {
      var body = color;
      viewDiameter = highlight;

      BodyRenderer.call( this, body );
      //Buffer the sphere node for improved performance (JProfiler reported 80% time spent in rendering before buffering, 15% after)
//      this.sphereNode = new SphericalNode( viewDiameter, createPaint( viewDiameter ), true );
      this.sphereNode = new Circle( viewDiameter );
      this.addChild( this.sphereNode );
    }

  }

  inherit( BodyRenderer, SphereRenderer, {
    setDiameter: function( viewDiameter ) {
      //TODO: figure out how to speed this up or ignore irrelevant calls
      if ( !GravityAndOrbitsApplication.teacherMode ) {
        this.sphereNode.radius = viewDiameter;
        this.sphereNode.fill = this.createPaint( viewDiameter );
      }
    },
//The sim runs out of memory on Mac OS X 10.4 if you use a gradient here, see #2913

    //private
    createPaint: function( diameter ) {
      // Create the gradient paint for the sphere in order to give it a 3D look.
//      if ( PhetUtilities.isMacintosh() ) {
//        return this.body.getColor();
//      }
//      else {
        return new RoundGradientPaint( diameter / 8, -diameter / 8, this.body.getHighlight(), new Vector2( diameter / 4, diameter / 4 ), this.body.getColor() );
//      }
    }
  } );


  // static class: SunRenderer
  /**
   * Adds triangle edges to the sun to make it look more recognizable
   *
   * @param body
   * @param viewDiameter
   * @param numSegments
   * @param twinkleRadius
   * @constructor
   */
  function SunRenderer( body, viewDiameter, numSegments, twinkleRadius ) {

    //private
//    this.twinkles = new PhetPPath( Color.yellow );

    SphereRenderer.call( this, body, viewDiameter );
    this.numSegments = numSegments;
    this.twinkleRadius = twinkleRadius;
    this.addChild( twinkles );
//    this.twinkles.moveToBack();
    this.setDiameter( viewDiameter );
  }

  inherit( SphereRenderer, SunRenderer, {
    setDiameter: function( viewDiameter ) {
//      super.setDiameter( viewDiameter );
      SphereRenderer.prototype.setDiameter.call(this, viewDiameter );
      var angle = 0;
      var deltaAngle = Math.PI * 2 / numSegments;
      var radius = viewDiameter / 2;
      var path = new DoubleGeneralPath();
      path.moveTo( 0, 0 );
      for ( var i = 0; i < numSegments + 1; i++ ) {
        var myRadius = i % 2 == 0 ? twinkleRadius.apply( radius ) : radius;
        var target = Vector2.createPolar( myRadius, angle );
        path.lineTo( target );
        angle += deltaAngle;
      }
      twinkles.setPathTo( path.getGeneralPath() );
    }
  } );

  // static class: ImageRenderer
  /**
   * Renders the body using the specified image and the specified diameter in view coordinates.
   */
  function ImageRenderer( body, viewDiameter, imageName ) {

    BodyRenderer.call( this, body );

    this.imageNode = new Image( imageName );
    this.viewDiameter = viewDiameter;
    this.addChild( this.imageNode );

    this.updateViewDiameter();
  }

  inherit( BodyRenderer, ImageRenderer, {
    setDiameter: function( viewDiameter ) {
      this.viewDiameter = viewDiameter;
      this.updateViewDiameter();
    },

    //private
    updateViewDiameter: function() {
      this.imageNode.setTransform( new AffineTransform() );
      var scale = this.viewDiameter / this.imageNode.width;
      this.imageNode.setScale( scale );
      //Make sure the image is centered on the body's center
      this.imageNode.translate( -this.imageNode.width / 2 / scale, -this.imageNode.height / 2 / scale );
    }
  } );

  function BodyRenderer( body ) {

    //private
    this.body = body;
  }

  return inherit( Node, BodyRenderer, {
    getBody: function() {
      return this.body;
    },
    setDiameter: function( viewDiameter ) {},
  } );
} );

