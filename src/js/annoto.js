jQuery(function ($) {
    var getSettingsDeferred = $.Deferred();

    var configparams = "";

    // Kaltura
    setupKaltura = function () {
        var maKApp = window.moodleAnnoto.kApp;
        window.moodleAnnoto.setupKalturaKdpMap = this.setupKalturaKdpMap.bind(this);

        if (maKApp) {
            console.log("AnnotoMoodle: Kaltura loaded on init");
            this.setupKalturaKdpMap(maKApp.kdpMap);
            return true;
        } else {
            console.log("AnnotoMoodle: Kaltura not loaded on init");
        }
    };

    authKalturaPlayer = function (api) {
        // Api is the API to be used after Annoot is setup
        // It can be used for SSO auth.
        var jwt = configparams["token"];

        console.log("AnnotoMoodle: annoto ready");
        if (api && jwt && jwt !== "") {
            api.auth(jwt).catch(function () {
                console.error("AnnotoMoodle: SSO auth error");
            });
        } else {
            console.log("AnnotoMoodle: SSO auth skipped");
        }
    };

    setupKalturaKdpMap = function (kdpMap) {
        if (!kdpMap) {
            console.log("AnnotoMoodle: skip setup Kaltura players - missing map");
            return;
        }
        console.log("AnnotoMoodle: setup Kaltura players");
        for (var kdpMapKey in kdpMap) {
            if (kdpMap.hasOwnProperty(kdpMapKey)) {
                this.setupKalturaKdp(kdpMap[kdpMapKey]);
            }
        }
    };

    setupKalturaKdp = function (kdp) {
        if (!kdp.config || kdp.setupDone || !kdp.doneCb) {
            console.log("AnnotoMoodle: skip Kaltura player: " + kdp.id);
            return;
        }
        console.log("AnnotoMoodle: setup Kaltura player: " + kdp.id);
        kdp.setupDone = true;
        kdp.player.kBind("annotoPluginReady", this.authKalturaPlayer.bind(this));
        this.setupKalturaPlugin(kdp.config);
        kdp.doneCb();
    };

    setupKalturaPlugin = function (config) {
        // /*
        //  * Config will contain the annoto widget configuration.
        //  * This hook provides a chance to modify the configuration if required.
        //  * Below we use this chance to attach the ssoAuthRequestHandle and mediaDetails hooks.
        //  * https://github.com/Annoto/widget-api/blob/master/lib/config.d.ts#L128
        //  *
        //  * NOTICE: config is already setup by the Kaltura Annoto plugin,
        //  * so we need only to override the required configuration, such as
        //  * clientId, features, etc. DO NOT CHANGE THE PLAYER TYPE OR PLAYER ELEMENT CONFIG.
        // */

        var params = configparams;

        var widget = config.widgets[0];
        var playerConfig = widget.player;

        var ux = config.ux || {};
        var align = config.align || {};
        var features = config.features || {};

        config.ux = ux;
        config.align = align;
        config.features = features;

        config.clientId = params["api-key"];
        config.userToken = params["token"];
        config.position = params["position"];
        config.demoMode = Boolean(params["demo-mode"]);
        config.locale = params["locale"];

        features.tabs = Boolean(params["widget-features-tabs"]);
        align.vertical = params["alignVertical"];

        align.horizontal = "inner";

        /**
         * Attach the ssoAuthRequestHandle hook.
         * https://github.com/Annoto/widget-api/blob/master/lib/config.d.ts#L159
         */
        ux.ssoAuthRequestHandle = function () {
            // In case user is not logged in and tries to submit content
            // trigger user login
            window.location.replace(params["loginUrl"]);
        };

        playerConfig.mediaDetails = this.enrichMediaDetails.bind(this);
    };

    enrichMediaDetails = function (details) {
        // The details contains MediaDetails the plugin has managed to obtain
        // This hook gives a change to enrich the details, for example
        // providing group information for private discussions per course/playlist
        // https://github.com/Annoto/widget-api/blob/master/lib/media-details.d.ts#L6.
        // Annoto Kaltura plugin, already has some details about the media like title.
        //
        var params = configparams;

        var retVal = details || {};

        retVal.title = retVal.title || params.mediaTitle;
        retVal.description = retVal.description
            ? retVal.description
            : params.mediaDescription;
        retVal.group = {
            id: params.mediaGroupId,
            type: "playlist",
            title: params.mediaGroupTitle,
            privateThread: params.privateThread,
        };

        return retVal;
    };

    $.post("", {
        action: "get-settings",
        data: {},
    }).done(function (serverResponse) {
        var response = JSON.parse(serverResponse);

        if (response.status === "success") {
            configparams = response.data;

            getSettingsDeferred.resolve(response.data);
        } else {
            getSettingsDeferred.reject(
                "WP Server: Fetching of the Annoto settings has failed!"
            );
        }
    });

    var kaltura = setupKaltura();

    if (kaltura) {
        return;
    }

    $.when(getSettingsDeferred)
        .then(
            function (data) {
                var parent = document.body,
                    h5p = $(parent).find("iframe.h5p-iframe").first().get(0),
                    youtube = $(parent).find('iframe[src*="youtube.com"]').first().get(0),
                    vimeo = $(parent).find('iframe[src*="vimeo.com"]').first().get(0),
                    videojs = $(parent).find(".video-js").first().get(0),
                    jwplayer = $(parent).find(".jwplayer").first().get(0);
                if (videojs) {
                    data["mediaTitle"] = '';
                    playerId = videojs.id;
                    data["player-type"] = "videojs";
                } else if (jwplayer) {
                    data["mediaTitle"] = '';
                    playerId = jwplayer.id;
                    data["player-type"] = "jw";
                } else if (h5p) {
                    data["mediaTitle"] = H5PIntegration.contents['cid-1'].title;
                    playerId = h5p.id;
                    data["player-type"] = "h5p";
                } else if (youtube) {
                    data["mediaTitle"] = youtube.title;
                    playerId = youtube.id;
                    data["player-type"] = "youtube";
                } else if (vimeo) {
                    data["mediaTitle"] = vimeo.title;
                    playerId = vimeo.id;
                    data["player-type"] = "vimeo";
                }

                var postid = '';
                var cl = $(document.body)[0].classList;
                $.each( cl, function( i, val ) {
                    if (/^postid-*/.test(val)) {
                        postid = val.split('-')[1];
                    }
                });
                data["mediaGroupId"] = postid;
                data["mediaGroupTitle"] = document.title;

                return {
                    playerId: playerId,
                    settings: data,
                };
            },
            function (errText) {
                console && console.error(errText);
            }
        )
        .then(function (configData) {
            if (!configData) {
                console && console.error("Annoto Plugin: settings missing.");
                return;
            }

            if (configData.playerId.length === 0) {
                console &&
                    console.error("Annoto Plugin: Can't determine the player ID.");
                return;
            }

            if (
                !configData.settings["demo-mode"] &&
                configData.settings["api-key"].length === 0
            ) {
                console &&
                    console.error(
                        "Annoto Plugin: Plugin isn't in the Demo Mode, please, set the SSO Secret."
                    );
                return;
            }

            if (configData.settings["demo-mode"]) {
                console && console.warn("Annoto Plugin: Plugin boot in the Demo Mode.");
            }

            $("#" + configData.playerId).after('<div id="annoto-app"></div>');

            var locale = configData.settings["locale"];
            var rtl = false;
            if (locale === "he") {
                rtl = true;
            }

            var config = {
                clientId: configData.settings["api-key"],
                position: configData.settings["position"],
                widgets: [
                    {
                        player: {
                            type: configData.settings["player-type"],
                            element: configData.playerId,
                        },
                        timeline: {
                            embedded: false,
                            overlayVideo: Boolean(
                                configData.settings["annoto-timeline-overlay-switch"]
                            ),
                        },
                        mediaDetails: function() {
                            return {
                                title: configData.settings["mediaTitle"],
                                description: configData.settings["mediaTitle"],
                                group: {
                                    id: configData.settings["mediaGroupId"],
                                    type: 'playlist',
                                    title: configData.settings["mediaGroupTitle"],
                                    privateThread: configData.settings["privateThread"],
                                }
                            };
                        },
                    },
                ],
                simple: true,
                rtl: rtl,
                locale: locale,
                demoMode: Boolean(configData.settings["demo-mode"]),
                zIndex: configData.settings["zindex"],
            };

            nonOverlayTimelinePlayers = ["youtube", "vimeo"];
            innerAlignPlayers = ["h5p"];
            horizontalAlign = "element_edge";

            if (
                !configData.settings["overlayMode"] ||
                configData.settings["overlayMode"] === "auto"
            ) {
                horizontalAlign =
                    innerAlignPlayers.indexOf(configData.settings["player-type"]) !== -1
                        ? "inner"
                        : "element_edge";
            } else if (configData.settings["overlayMode"] === "inner") {
                horizontalAlign = "inner";
            }

            config.align = {
                vertical: configData.settings["alignVertical"],
                horizontal: horizontalAlign,
            };

            if (configData.settings["annoto-advanced-settings-switch"]) {
                config.width = { max: configData.settings["widget-max-width"] };
            }

            config.features = {
                tabs: Boolean(configData.settings["widget-features-tabs"]),
            };

            if (configData.settings["player-type"] === "vimeo") {
                config.widgets[0].player.params =
                    configData.settings["annoto-player-params"];
            }

            if (!window.Annoto) {
                console && console.error("Annoto: not loaded");
                return;
            }

            window.Annoto.on("ready", function (api) {
                if (configData.settings["token"].length > 0) {
                    api.auth(configData.settings["token"], function (annotoAuthError) {
                        if (annotoAuthError) {
                            console && console.error(annotoAuthError);
                        }
                    });
                }
            });

            window.Annoto.boot(config);
        });
});
