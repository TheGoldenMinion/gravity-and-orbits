// Copyright 2002-2015, University of Colorado

/**
 * Provides a textual readout of a Body's mass in "earth masses"
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MassReadoutNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/MassReadoutNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  // strings
  var thousandEarthMassesString = require( 'string!GRAVITY_AND_ORBITS/thousandEarthMasses' );
  var earthMassesString = require( 'string!GRAVITY_AND_ORBITS/earthMasses' );
  var earthMassString = require( 'string!GRAVITY_AND_ORBITS/earthMass' );
  var patternValueUnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );

  // constants
  var EARTH_MASS = 5.9736E24; // TODO: duplicated in ModeList

  function EarthMassReadoutNode( bodyNode, visible ) {
    MassReadoutNode.call( this, bodyNode, visible );
  }

  return inherit( MassReadoutNode, EarthMassReadoutNode, {
    createText: function() {
      var massKG = this.bodyNode.getBody().massProperty.get();
      var earthMasses = massKG / EARTH_MASS;
      //Show the value in terms of earth masses (or thousands of earth masses)
      var value, units;
      if ( earthMasses > 1E3 ) {
        value = Util.toFixed( Util.roundSymmetric( earthMasses / 1E3 ), 0 );
        units = thousandEarthMassesString;
      }
      else if ( Math.abs( earthMasses - 1 ) < 1E-2 ) {
        value = '1';
        units = earthMassString;
      }
      else if ( earthMasses < 1 ) {
        value = Util.toFixed( earthMasses, 2 );
        units = earthMassesString;
      }
      else {
        // Handle showing exactly "1 earth mass" instead of "1 earth masses"
        value = Util.toFixed( earthMasses, 2 );
        units = (earthMasses === 1) ? earthMassString : earthMassesString;
      }
      return StringUtils.format( patternValueUnitsString, value, units );
    }
  } );
} );
