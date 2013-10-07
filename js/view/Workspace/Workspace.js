// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var SpaceObjects = require( 'view/Workspace/Components/SpaceObjects' );
  var ForceArrows = require( 'view/Workspace/Components/ForceArrows' );
  var VelocityArrows = require( 'view/Workspace/Components/VelocityArrows' );
  var PlanetPath = require( 'view/Workspace/Components/PlanetPath' );
  var Grid = require( 'view/Workspace/Components/Grid' );
  var MeasuringTape = require( 'view/Workspace/Components/MeasuringTape' );
  var MassText = require( 'view/Workspace/Components/MassText' );
  var Tooltips = require( 'view/Workspace/Components/Tooltips' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function Workspace( model ) {
    var self = this;
    this.toScale = new Node();
    Node.call( this );

    // add space objects
    this.toScale.addChild( new SpaceObjects( model ) );

    // add force arrows
    this.toScale.addChild( new ForceArrows( model ) );

    // add velocity arrows
    this.toScale.addChild( new VelocityArrows( model ) );

    // add planet path
    this.toScale.addChild( new PlanetPath( model ) );

    // add grids
    this.toScale.addChild( new Grid( model ) );

    // add tooltips
    this.toScale.addChild( new Tooltips( model ) );
    this.addChild( this.toScale );

    // add measuring tape
    this.addChild( new MeasuringTape( model ) );

    // add mass text
    this.addChild( new MassText( model ) );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale, oldScale ) {
      self.toScale.scale( 1 / (oldScale || 1) );
      self.toScale.scale( newScale );
    } );

    // add scale center observer
    model.scaleCenterProperty.link( function( vect ) {
      self.x = vect.x;
      self.y = vect.y;
    } );
  }

  inherit( Node, Workspace );

  return Workspace;
} );