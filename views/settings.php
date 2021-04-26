<div id="annoto-bootstrap" class="annoto-bootstrap">
    <div class="text-center annoto-notification">
        <div class="alert alert-success text-left display-none" id="successMessage" role="alert">
            <div class="notification-header"><strong>Success!</strong></div>
            <span> Settings was saved successfully!</span>
        </div>
        <div class="alert alert-danger text-left display-none" id="failMessage" role="alert">
            <div class="notification-header"><strong>Failed!</strong></div>
            <span> During saving Settings!</span>
        </div>
        <div class="alert alert-warning text-left display-none" id="errorMessage" role="alert">
            <div class="notification-header"><strong>Warning!</strong></div>
            <span> Error message </span>
        </div>
    </div>
    <input type="hidden" name="settings-from-server" id="settingsFromServer" value='<?php echo json_encode(get_option('
        annoto_settings')); ?>' >
    <div class="col-sm-push-2 col-sm-8">
        <div class="panel panel-primary annoto-panel">
            <div class="panel-heading text-center">
                <img class="annoto-masthead_logo"
                    src="<?php echo esc_url(plugins_url('../src/img/logo_white.svg', __FILE__)); ?>" alt="Annoto" />
            </div>
            <div class="panel-body text-center">
                <form class="form-horizontal" id="settingForm" method="post" action="">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="panel panel-white panel-right-grey">
                                <div class="panel-body panel-settings">
                                    <div class="form-group top-buffer">
                                        <label class="control-label col-lg-3 col-lg-push-1 col-xs-12 setting-label"
                                            for="widget-position">
                                            Widget Position
                                        </label>
                                        <div class="col-lg-9 col-xs-12">
                                            <div class="btn-group">
                                                <button type="button" id="widget-position"
                                                    class="btn btn-default annoto-dropdown-button">
                                                    Right
                                                </button>
                                                <button type="button" class="btn btn-default dropdown-toggle"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <span class="caret"></span>
                                                    <span class="sr-only">Toggle Dropdown</span>
                                                </button>
                                                <ul class="dropdown-menu" data-btn-id="widget-position">
                                                    <li><a href="#" name="right">Right</a></li>
                                                    <li><a href="#" name="left">Left</a></li>
                                                    <li><a href="#" name="topright">Top right</a></li>
                                                    <li><a href="#" name="topleft">Top left</a></li>
                                                    <li>
                                                        <a href="#" name="bottomright">Bottom right</a>
                                                    </li>
                                                    <li><a href="#" name="bottomleft">Bottom left</a></li>
                                                </ul>
                                            </div>
                                            <input type="hidden" class="setting-data is-dropdown" name="widget-position"
                                                value="right" />
                                        </div>
                                    </div>

                                    <div class="form-group top-buffer">
                                        <label class="control-label col-lg-3 col-lg-push-1 col-xs-12 setting-label"
                                            for="locale">
                                            Locale
                                        </label>
                                        <div class="col-lg-9 col-xs-12">
                                            <div class="btn-group">
                                                <button type="button" id="locale"
                                                    class="btn btn-default annoto-dropdown-button">
                                                    Auto
                                                </button>
                                                <button type="button" class="btn btn-default dropdown-toggle"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <span class="caret"></span>
                                                    <span class="sr-only">Toggle Dropdown</span>
                                                </button>
                                                <ul class="dropdown-menu" data-btn-id="locale">
                                                    <li><a href="#" name="auto">Auto</a></li>
                                                    <li><a href="#" name="en">En</a></li>
                                                    <li><a href="#" name="he">He</a></li>
                                                </ul>
                                            </div>
                                            <input type="hidden" class="setting-data is-dropdown" name="locale"
                                                value="auto" />
                                        </div>
                                    </div>

                                    <div class="form-group top-buffer">
                                        <label class="control-label col-lg-3 col-lg-push-1 col-xs-12 setting-label"
                                            for="overlayMode">
                                            Overlay Mode
                                        </label>
                                        <div class="col-lg-9 col-xs-12">
                                            <div class="btn-group">
                                                <button type="button" id="overlayMode"
                                                    class="btn btn-default annoto-dropdown-button">
                                                    Auto
                                                </button>
                                                <button type="button" class="btn btn-default dropdown-toggle"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <span class="caret"></span>
                                                    <span class="sr-only">Toggle Dropdown</span>
                                                </button>
                                                <ul class="dropdown-menu" data-btn-id="overlayMode">
                                                    <li><a href="#" name="auto">Auto</a></li>
                                                    <li><a href="#" name="inner">On top of Player</a></li>
                                                    <li>
                                                        <a href="#" name="element_edge">Next to Player</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <input type="hidden" class="setting-data is-dropdown" id="overlayMode-value"
                                                name="overlayMode" value="vimeo" />
                                        </div>
                                    </div>

                                    <div class="form-group top-buffer annoto-features-settings-container">
                                        <label class="control-label col-lg-3 col-lg-push-1 col-xs-12 setting-label"
                                            for="widget-features-tabs">Tabs</label>
                                        <div class="col-sm-14 text-center">
                                            <label class="annoto-switch">
                                                <input type="checkbox" class="setting-data" name="widget-features-tabs"
                                                    id="widget-features-tabs" data-type="number" value="1" />
                                                <div class="annoto-slider round"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="form-group top-buffer annoto-advanced-settings-container">
                                        <label class="control-label col-lg-3 col-lg-push-1 col-xs-12 setting-label"
                                            for="zindex">
                                            Stack order
                                        </label>
                                        <div class="col-lg-9 col-xs-12">
                                            <input type="number" class="setting-data" name="zindex" data-type="number"
                                                name="zindex" value="100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6" id="credentialBlock">
                            <div class="panel panel-white api-key">
                                <div class="panel-body">
                                    <div class="form-group">
                                        <label class="control-label col-sm-3" for="demo-mode">Demo Mode</label>
                                        <div class="col-sm-9 text-left">
                                            <label class="annoto-switch">
                                                <input type="checkbox" class="setting-data" name="demo-mode"
                                                    id="demo-mode" data-type="number" value="1" />
                                                <div class="annoto-slider round"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-addon annoto-input-group">
                                            <img src="<?php echo ANNOTO_PLUGIN_URL . 'src/img/key.png' ?>" alt=""
                                                class="annoto-icon-image" title="API key" />
                                        </span>
                                        <input type="text" class="form-control setting-data" name="api-key"
                                            placeholder="API Key..." id="api-key" disabled="" />
                                    </div>
                                </div>
                                <div class="panel-body">
                                    <div class="form-group">
                                        <label class="control-label col-sm-3" for="sso-support">SSO Support</label>
                                        <div class="col-sm-9 text-left">
                                            <label class="annoto-switch">
                                                <input class="setting-data" type="checkbox" name="sso-support"
                                                    id="sso-support" data-type="number" value="0" />
                                                <div class="annoto-slider round"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-addon annoto-input-group">
                                            <img src="<?php echo ANNOTO_PLUGIN_URL . 'src/img/lock.png' ?>" alt=""
                                                class="annoto-icon-image" title="SSO Secret" />
                                        </span>
                                        <input type="text" class="form-control setting-data" name="sso-secret"
                                            placeholder="SSO Secret..." id="sso-secret" disabled="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group submit-block">
                        <div class="text-center">
                            <button class="btn btn-primary annoto-save" id="submitSettings" type="submit">
                                Save Settings
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>