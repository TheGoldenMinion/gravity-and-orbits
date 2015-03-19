// Copyright 2002-2014, University of Colorado

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at cartoon or real scale.  It is also draggable, which changes
 * the location of the Body.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   *
   * @param {Body} body
   * @param {ModelViewTransform} modelViewTransform
   * @param {PComponent} parentComponent
   * @param {number} labelAngle
   * @param {boolean} whiteBackgroundProperty
   * @constructor
   */
  function BodyNode( body, modelViewTransform, //Keep track of the mouse position in case a body moves underneath a stationary mouse (in which case the mouse should become a hand cursor)
                     parentComponent, //Angle at which to show the name label, different for different BodyNodes so they don't overlap too much
                     labelAngle, whiteBackgroundProperty ) {

    Node.call( this, { pickable: true, cursor: 'pointer' } );

    // private attributes
    this.modelViewTransform = modelViewTransform;
    this.body = body;
    this.whiteBackgroundProperty = whiteBackgroundProperty;

    var thisNode = this;

    this.body.collidedProperty.link( function( isCollided ) {
      thisNode.visible = !isCollided;
    } );

    this.bodyRenderer = this.body.createRenderer( this.getViewDiameter() );
    this.addChild( this.bodyRenderer );

    // @public
    this.dragHandler = new MovableDragHandler( this.body.positionProperty, {
      modelViewTransform: this.modelViewTransform.get() // TODO: we need to update the MVT of this handler when the property changes
    } );
    this.addInputListener( this.dragHandler );

    this.body.positionProperty.link( function( pos ) {
      thisNode.translation = modelViewTransform.get().modelToViewPosition( pos );
    } );

    this.body.diameterProperty.link( function() {
      thisNode.bodyRenderer.setDiameter( thisNode.getViewDiameter() );
    } );

    //Points to the sphere with a text indicator and line, for when it is too small to see (in modes with realistic units)
    this.addChild( this.createArrowIndicator( this.body, labelAngle ) );
  }

  return inherit( Node, BodyNode, {

    //Points to the sphere with a text indicator and line, for when it is too small to see (in modes with realistic units)
    //private
    createArrowIndicator: function( body, labelAngle ) {
      var thisNode = this;
      var node = new Node();
      var viewCenter = new Vector2( 0, 0 );
      var northEastVector = Vector2.createPolar( 1, labelAngle );
      var tip = northEastVector.times( 10 ).plus( viewCenter );
      var tail = northEastVector.times( 50 ).plus( viewCenter );

      node.addChild( new ArrowNode( tail.x, tail.y, tip.x, tip.y, { fill: 'yellow' } ) );
      var text = new Text( body.getName(), {
        font: new PhetFont( 18 ),
        x: tail.x - this.width / 2 - 5,
        y: tail.y - this.height - 10
      } );
      node.addChild( text );

      this.whiteBackgroundProperty.link( function( whiteBackground ) {
        text.fill = whiteBackground ? Color.black : Color.white;
      } );

      this.body.diameterProperty.link( function() {
        node.visible = thisNode.getViewDiameter() <= 10;
      } );

      return node;
    },

    //private
    getPosition: function( modelViewTransform, body ) {
      return modelViewTransform.get().modelToView( body.getPosition() );
    },

    //private
    getViewDiameter: function() {
      var viewDiameter = this.modelViewTransform.get().modelToViewDeltaX( this.body.getDiameter() );
      return Math.max( viewDiameter, 2 );
    },

    //Create a new image at the specified width. Use body.createRenderer() instead of bodyRenderer since we must specify a new width value
    renderImage: function( width ) {
      return this.body.createRenderer( width ).toImage( width, width, new Color( 0, 0, 0, 0 ) );
    },

    getBody: function() {
      return this.body;
    },

    getBodyRenderer: function() {
      return this.bodyRenderer;
    }
  } );
} );
