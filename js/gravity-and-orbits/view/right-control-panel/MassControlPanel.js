// Copyright 2015, University of Colorado Boulder

/**
 * Container for right control panel.
 *
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsConstants' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var BodyMassControl = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/BodyMassControl' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var CONTROL_FONT = new PhetFont( 14 );

  function MassControlPanel( massSettableBodies, options ) {

    options = _.extend( _.clone( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS ), options );

    var children = [];

    for ( var i = 0; i < massSettableBodies.length; i++ ) {
      var sliderNode = new Node();

      var massSettableBody = massSettableBodies[ i ];

      var label = new Text( massSettableBody.name, {
        font: CONTROL_FONT,
        fontWeight: 'bold',
        fill: GravityAndOrbitsColorProfile.panelTextProperty,
        maxWidth: 175
      } );

      var icon = massSettableBody.createRenderer( 14 );

      // Top component that shows the body's name and icon
      var labelHBox = new HBox( { children: [ label, icon ], spacing: 10 } );

      sliderNode.addChild( labelHBox );

      sliderNode.addChild( new VBox( {
        top: labelHBox.bottom + 10,
        resize: false,
        children: [
          new HStrut( 220 ),
          new BodyMassControl(
            massSettableBody,
            massSettableBody.massProperty.getInitialValue() / 2,
            massSettableBody.massProperty.getInitialValue() * 2,
            massSettableBody.tickValue,
            massSettableBody.tickLabel )
        ]
      } ) );

      children.push( sliderNode );
    }

    var vBox = new VBox( { children: children, spacing: 4, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vBox, options );
  }

  return inherit( Panel, MassControlPanel );
} );