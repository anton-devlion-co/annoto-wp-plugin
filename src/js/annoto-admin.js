jQuery(document).ready( function ( $ ) {

    'use strict';

    var nameToOutputTextMapper = {
        mappingData: {
            'widget-position': {
                right: 'Right',
                bottom: 'Bottom',
                left: 'Left'
            },
            'player-type': {
                youtube: 'YouTube',
                vimeo: 'Vimeo'
            },
            'rtl-support': {
                0: 'En',
                1: 'He'
            }
        },
        getOutputText: function(fieldName, valueName) {
            return this.mappingData[fieldName][valueName];
        }
    };

    var toggleDisabledInputs = {
        ssoSupport: function () {
            var ssoSecretInput = $('#sso-secret');
            this.isSsoSecretEnabled() ? ssoSecretInput.prop('disabled', false) : ssoSecretInput.prop('disabled', true);
        },
        ssoSecret: function () {
            var apiKeyInput = $('#api-key'),
                ssoSecretInput = $('#sso-secret');

            $('#demo-mode')[0].checked ? apiKeyInput.prop('disabled', true) : apiKeyInput.prop('disabled', false);
            this.isSsoSecretEnabled() ? ssoSecretInput.prop('disabled', false) : ssoSecretInput.prop('disabled', true);
        },
        isSsoSecretEnabled: function () {
            return false === $('#demo-mode')[0].checked && $('#sso-support')[0].checked;
        },
        all: function () {
            this.ssoSupport();
            this.ssoSecret();
        }
    };

    var settingsFromServer = JSON.parse($('#settingsFromServer').val());

    var settingForm = {
        formId: '#settingForm',
        gatheredData: function () {
            var settingData = {};

            $( this.formId ).find( 'input.setting-data' ).each( function () {
                settingData[ this.name ] = $( this ).val();

                if ( this.name === 'rtl-support' ) {
                    settingData[ this.name ] = Number( $( this ).val() );
                }

                if ( this.type === 'checkbox' ) {
                    settingData[ this.name ] = Number( $( this )[0].checked );
                }
            });

            return settingData;
        },
        isDataChanged: function () {
             return JSON.stringify(this.gatheredData()) !== JSON.stringify(settingsFromServer);
        },
        isValid: function () {
            var ssoSecreteField = $('input#sso-secret');
            var apiKeyField = $('input#api-key');

            if ( ! ssoSecreteField.prop( 'disabled' ) && ssoSecreteField.val().length !== 64) {
                return this.showValidationError( ssoSecreteField );
            }

            if ( ! apiKeyField.prop( 'disabled' ) && ! this.isJWTStringValid( apiKeyField.val() ) ) {
                return this.showValidationError( apiKeyField );
            }

            return true;
        },
        isJWTStringValid: function (input ) {
            var parts = input.split(".");

            return parts.length === 3;
        },
        getErrorText: function (inputFieldId) {
            if (inputFieldId === 'sso-secret') {
                return 'This field can not be empty and must contain 64 characters';
            }

            if (inputFieldId === 'api-key') {
                return 'This field can not be empty and must contain correct JWT string';
            }
        },
        showValidationError: function ( fieldJQueryObject ) {
            fieldJQueryObject.closest('div.input-group').addClass('has-error');

            $('#errorMessage').find('span').text(this.getErrorText(fieldJQueryObject.attr('id')));

            this.showNotification('errorMessage');
        },
        showNotification: function ( notificationId ) {
            $( '#' + notificationId ).slideDown();

            setTimeout(function() {
                $( '#' + notificationId ).slideUp();
            }, 3000);
        },
        sendToServer: function () {
            if ( this.isDataChanged() && this.isValid() ) {

                var saveOnServerDeferred = $.Deferred();

                $( '#submitSettings' ).addClass( 'disabled' );

                $.post(
                    '',
                    {
                        action   : 'save-settings',
                        dataType : 'json',
                        data     : this.gatheredData()
                    }
                )
                    .done( function ( serverResponse ) {
                        var response = JSON.parse( serverResponse );

                        if ( response.status === 'success' ) {
                            saveOnServerDeferred.resolve( response.data );
                        } else {
                            saveOnServerDeferred.reject();
                        }

                        $( '#submitSettings' ).removeClass( 'disabled' );
                    } );

                $.when( saveOnServerDeferred ).then(
                    function ( savedSettings ) {
                        settingsFromServer = savedSettings;
                        settingForm.showNotification( 'successMessage' );
                    },
                    function () {
                        settingForm.showNotification( 'failMessage' );
                    }
                );
            }
        }
    };

    (function () {
        $( '#settingForm' ).find( ':input.setting-data' ).each( function () {

            $( this ).val(settingsFromServer[this.name]);

            if ( this.type === 'checkbox' ) {
                $( this ).prop( 'checked', Boolean( Number( settingsFromServer[this.name] ) ) );
            }

            if ( $( this ).hasClass( 'is-dropdown' )) {
                $( '#' + this.name )
                    .text(nameToOutputTextMapper.getOutputText( this.name, settingsFromServer[this.name] ) );
            }
        });

        toggleDisabledInputs.all();
    }) ();

    $( '#settingForm' ).submit( function( event ) {
        event.preventDefault();

        settingForm.sendToServer();
    });

    $( '#submitSettings' ).click( function ( event ) {
        event.preventDefault();

        $( '#settingForm' ).submit();
    } );

    $( '#demo-mode' ).change( function () {
        toggleDisabledInputs.ssoSecret();
    } );

    $( '#sso-support' ).change( function () {
        toggleDisabledInputs.ssoSupport();
    } );

    $( '.dropdown-menu a' ).click( function () {
        var buttonId = $( this ).closest( 'ul' ).data( 'btnId' );
        $( '#' + buttonId ).text( this.innerText );
        $( 'input.setting-data[name=' + buttonId + ']').val( this.name );
    } );

    $('#credentialBlock').click( function () {
        $( this ).find( 'div.input-group' ).removeClass( 'has-error' );
    } );
});