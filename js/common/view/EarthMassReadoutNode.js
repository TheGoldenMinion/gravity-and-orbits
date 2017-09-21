// Copyright 2014-2017, University of Colorado Boulder

/**
 * Provides a textual readout of a Body's mass in "earth masses"
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MassReadoutNode = require( 'GRAVITY_AND_ORBITS/common/view/MassReadoutNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  // strings
  var earthMassesString = require( 'string!GRAVITY_AND_ORBITS/earthMasses' );
  var earthMassString = require( 'string!GRAVITY_AND_ORBITS/earthMass' );
  var pattern0Value1UnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );
  var thousandEarthMassesString = require( 'string!GRAVITY_AND_ORBITS/thousandEarthMasses' );

  function EarthMassReadoutNode( bodyNode, visible ) {
    MassReadoutNode.call( this, bodyNode, visible );
  }

  gravityAndOrbits.register( 'EarthMassReadoutNode', EarthMassReadoutNode );

  return inherit( MassReadoutNode, EarthMassReadoutNode, {

    /**
     * Create a label for the earth, but with rules to provide either exact or qualitive representations,
     * and limitations so that the label looks good in the view.
     *
     * @returns {type}  description
     */
    createText: function() {
      var massKG = this.bodyNode.body.massProperty.get();
      var earthMasses = massKG / GravityAndOrbitsConstants.EARTH_MASS;

      // Show the value in terms of earth masses (or thousands of earth masses)
      var value;
      var units;
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
      return StringUtils.format( pattern0Value1UnitsString, value, units );
    }
  } );
} );
