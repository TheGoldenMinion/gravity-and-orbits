// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsScreenView' );
  var GravityAndOrbitsColors = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColors' );
  var CartoonModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/CartoonModeList' );
  var RealModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/RealModeList' );
  var GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GlobalOptionsNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var cartoonIcon = require( 'image!GRAVITY_AND_ORBITS/cartoon_icon.png' );
  var toScaleIcon = require( 'image!GRAVITY_AND_ORBITS/to_scale_icon.png' );

  // strings
  var cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
  var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );
  var simTitle = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );


  /**
   * ToScaleModule
   * @constructor
   */
  function ToScaleModule() {
    GravityAndOrbitsModule.call( this, true, function( p ) {
      return new RealModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
    }, 0, true );
  }

  inherit( GravityAndOrbitsModule, ToScaleModule );

  /**
   * CartoonModule
   * @constructor
   */
  function CartoonModule() {
    GravityAndOrbitsModule.call( this, false, function( p ) {
      return new CartoonModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
    }, 0, false );
  }

  inherit( GravityAndOrbitsModule, CartoonModule );

  var whiteBackgroundProperty = new Property( false );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    },
    optionsNode: new GlobalOptionsNode( whiteBackgroundProperty )
  };

  var cartoonScreen = new Screen( cartoonString, new Image( cartoonIcon ),
    function() { return new CartoonModule(); },
    function( model ) { return new GravityAndOrbitsScreenView( model ); },
    { backgroundColor: GravityAndOrbitsColors.background.toCSS() }
  );

  var toScaleScreen = new Screen( toScaleString, new Image( toScaleIcon ),
    function() { return new ToScaleModule(); },
    function( model ) { return new GravityAndOrbitsScreenView( model ); },
    { backgroundColor: GravityAndOrbitsColors.background.toCSS() }
  );

  whiteBackgroundProperty.link( function( useProjectorColors ) {
    if ( useProjectorColors ) {
      GravityAndOrbitsColors.applyProfile( 'projector' );
    }
    else {
      GravityAndOrbitsColors.applyProfile( 'default' );
    }
  } );

  GravityAndOrbitsColors.link( 'background', function( color ) {
    cartoonScreen.backgroundColor = color;
    toScaleScreen.backgroundColor = color;
  } );

  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( simTitle, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );