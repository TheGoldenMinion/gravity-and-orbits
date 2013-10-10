/**
 * Copyright 2002-2013, University of Colorado
 * view for day counter
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PushButton = require( 'SUN/PushButton' );

  var clearString = require( 'string!GRAVITY_AND_ORBITS/clear' );
  var earthDaysString = require( 'string!GRAVITY_AND_ORBITS/earthDays' );
  var earthMinutesString = require( 'string!GRAVITY_AND_ORBITS/earthMinutes' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 24 );

  function DayCounter( model, coords ) {
    var self = this, dayOffset = 0;
    Node.call( this, coords );

    // add day text counter
    this.day = new Text( '', { font: FONT, fontWeight: 'bold', fill: '#fff', pickable: false, y: 32, x: 10 } );
    this.addChild( this.day );

    // create default view for clear button
    var node = new Node( {children: [
      new Rectangle( 0, 0, 65, 25, 5, 5, {fill: '#fff'} ),
      new Text( clearString, { font: new PhetFont( 18 ), fill: '#000', pickable: false, y: 18, x: 10 } )
    ], x: 50, y: 50 } );

    // button options
    var options = {
      upNode: new Node( {children: [node]} ),
      overNode: new Node( {children: [node]} ),
      downNode: new Node( {children: [node]} ),
      disabledNode: new Node( {children: [node]} ),
      callback: function() {
        dayOffset = model.day;
        updateDay( model.day );
      }
    };

    // create button
    this.addChild( new PushButton( options.upNode, options.overNode, options.downNode, options.disabledNode, options.callback ) );

    var updateDay = function( day ) {
      self.day.setText( parseInt( (day - dayOffset) * self.multiplier, 10 ).toString() + ' ' + self.text );
    };

    model.timeModeProperty.link( function( mode ) {
      if ( mode === model.timeModes[0] ) { // days
        self.text = earthDaysString;
        self.multiplier = 1;
      }
      else if ( mode === model.timeModes[1] ) { // minutes
        self.text = earthMinutesString;
        self.multiplier = 24 * 60;
      }
      updateDay( model.day );
    } );

    model.dayProperty.link( updateDay );

    model.planetModeProperty.link( function() {
      model.dayProperty.reset();
      dayOffset = 0;
    } );
  }

  inherit( Node, DayCounter );

  return DayCounter;
} );