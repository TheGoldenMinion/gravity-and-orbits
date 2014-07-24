// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for single space object, such as a moon, earth or satellite.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var FONT = new PhetFont( 12 );

  function SpaceObjectModel( SpaceObject ) {
    this.label = new Node( {visible: true, cursor: 'pointer'} ); // node for label
    this.massText = new Text( '', { visible: true, font: FONT, fontWeight: 'bold', textAlign: 'center', fill: 'white', pickable: false} ); // node for mass text
    this.view = new Node(); // node for view of space object

    SpaceObject = _.extend( {
      mass: 0,
      radius: 0,
      velocity: new Vector2( 0, 0 ),
      acceleration: new Vector2( 0, 0 ),
      positionStart: new Vector2( 0, 0 ),
      position: new Vector2( 0, 0 )
    }, SpaceObject );

    PropertySet.call( this, {
      mass: SpaceObject.mass, // mass of space object in kg
      massCoeff: 1, // mass coefficient
      radius: SpaceObject.radius, // radius of space object
      radiusCoeff: 1, // radius coefficient
      exploded: false, // explode flag
      velocity: SpaceObject.velocity, // velocity of space object
      acceleration: SpaceObject.acceleration, // acceleration of space object
      positionStart: SpaceObject.positionStart, // initial position of space object
      position: SpaceObject.position, // position of space object
      initDrag: false // trigger for drag initialization
    } );
  }

  return inherit( PropertySet, SpaceObjectModel );
} );
