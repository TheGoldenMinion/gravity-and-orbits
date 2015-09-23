// Copyright 2002-2015, University of Colorado Boulder

/**
 * Container for mass sliders, there should be two of them per mode.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var BodyMassControl = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/BodyMassControl' );

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function MassMenu( module, options ) {

    options = _.extend( { resize: false }, options );
    VBox.call( this, options );

    var hStrut = new HStrut( 220 );

    var thisNode = this;
    module.modeProperty.link( function( mode ) {
      thisNode.removeAllChildren();
      thisNode.addChild( hStrut );
      var bodies = mode.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        var body = bodies[ i ];
        if ( body.massSettable ) {
          thisNode.addChild(
            new BodyMassControl( body, body.massProperty.getInitialValue() / 2, body.massProperty.getInitialValue() * 2,
              body.tickValue, body.tickLabel ) );
        }
      }
      thisNode.updateLayout();
    } );
  }

  return inherit( VBox, MassMenu );
} );