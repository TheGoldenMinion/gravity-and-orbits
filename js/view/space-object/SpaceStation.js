// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for space station.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SpaceObjectAbstract = require( 'view/space-object/SpaceObjectAbstract' );

  // images
  var spaceStationImg = require( 'image!GRAVITY_AND_ORBITS/space-station.png' );

  function SpaceStation( coords, radius ) {
    SpaceObjectAbstract.call( this, {image: spaceStationImg, coords: coords, scaleCoeff: 1.3} );

    this.setRadius( radius );
  }

  return inherit( SpaceObjectAbstract, SpaceStation );
} );