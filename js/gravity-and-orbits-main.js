// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var CartoonScreen = require( 'GRAVITY_AND_ORBITS/cartoon/CartoonScreen' );
  var ToScaleScreen = require( 'GRAVITY_AND_ORBITS/toScale/ToScaleScreen' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/common/view/GlobalOptionsNode' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Noah Podolefsky, Emily Moore',
      softwareDevelopment: 'Aaron Davis, Sam Reid, Jon Olson',
      team: 'Kathy Perkins, Trish Loeblein',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin',
      graphicArts: '',
      thanks: ''
    },
    optionsNode: new GlobalOptionsNode()
  };

  SimLauncher.launch( function() {

    var cartoonScreen = new CartoonScreen( {
      backgroundColor: GravityAndOrbitsColorProfile.background.toCSS()
    } );

    var toScaleScreen = new ToScaleScreen( {
      backgroundColor: GravityAndOrbitsColorProfile.background.toCSS()
    } );

    GravityAndOrbitsColorProfile.backgroundProperty.link( function( color ) {
      cartoonScreen.backgroundColor = color;
      toScaleScreen.backgroundColor = color;
    } );

    // create and start the sim
    new Sim( gravityAndOrbitsTitleString, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );
