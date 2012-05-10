/// <reference path="libs/jquery-1.7.2.js" />
/// <reference path="libs/knockout-2.1.0.debug.js" />
/*
=======================================================================
    Description: A Toolkit for KnockoutJS
    Author: Eric M. Barnard (https://github.com/ericmbarnard)
    License: MIT (http://www.opensource.org/licenses/mit-license.php)
=======================================================================
*/

;(function (ko, undefined) {

    if (!ko) {
        throw Error("You must load KnockoutJS before using Knockout Toolkit!");
    }

    // some quick tests to see what is supported
    var hasJQuery = (window.jQuery ? true : false);

    // in case jQuery is being used noConflict
    var $ = (hasJQuery ? window.jQuery : null);

    /*========================= Utils ============================*/

    // an enhanced version of 'ko.utils.extend'
    // this unwraps observables to use their values during extending
    // and will also 'set' observable values on the target
    ko.utils['extendObservable'] = function ( target, source ) {
        var prop,
            srcVal,
            isObservable = false;

        for ( prop in source ) {

            if ( !source.hasOwnProperty( prop ) ) {
                continue;
            }

            if ( ko.isWriteableObservable( source[prop]) ) {
                isObservable = true;
                srcVal = source[prop]();
            } else if ( typeof ( source[prop] ) !== 'function' ) {
                srcVal = source[prop];
            }

            if ( ko.isWriteableObservable(target[prop]) ) {
                target[prop]( srcVal );
            } else if ( target[prop] === null || target[prop] === undefined ) {

                target[prop] = isObservable ? ko.observable( srcVal ) : srcVal;

            } else if ( typeof ( target[prop] ) !== 'function' ) {
                target[prop] = srcVal;
            }

            // resets for the loop
            isObservable = false;
            srcVal = null;
        }
    };

    // an enhanced version of 'ko.utils.extend' that
    // ensures no memory pointers are given to the copied
    // object.
    // target -> empty instance to be populated
    // source -> hydrated object to be populated
    ko.utils['extendClone'] = function ( target, source ) {
        var json = ko.toJSON( source ),
            js = ko.utils.parseJson( json );

        return ko.utils.extendObservable( target, js );
    };


    /*========================= Extenders ============================*/

    // TODO: add extender functions here

    /*========================= Binding Handlers ============================*/

    // invisible -> the inverse of 'visible'
    ko.bindingHandlers['invisible'] = {
        update: function (element, valueAccessor) {
            var newValueAccessor = function () {
                // just return the opposite of the visible flag!
                return !ko.utils.unwrapObservable(valueAccessor());
            };
            return ko.bindingHandlers.visible.update(element, newValueAccessor);
        }
    };
    
}(window.ko));