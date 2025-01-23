'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">olympic-games-starter documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' : 'data-bs-target="#xs-components-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' :
                                            'id="xs-components-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' : 'data-bs-target="#xs-injectables-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' :
                                        'id="xs-injectables-links-module-AppModule-64e9b664f33f6cd36dc7991a843f24448179889037537f3c74ad87ca0e4b99a1f48bd21124fa2fb3504087238280f7706c8c1107e4fa15b20b5f38b6ddabb616"' }>
                                        <li class="link">
                                            <a href="injectables/LoadingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MessagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/BoxStatsComponent.html" data-type="entity-link" >BoxStatsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetailGraphComponent.html" data-type="entity-link" >DetailGraphComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GlobalGraphComponent.html" data-type="entity-link" >GlobalGraphComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingComponent.html" data-type="entity-link" >LoadingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MessagesComponent.html" data-type="entity-link" >MessagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlympicCountryDetailComponent.html" data-type="entity-link" >OlympicCountryDetailComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesService.html" data-type="entity-link" >MessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OlympicService.html" data-type="entity-link" >OlympicService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BoxStat.html" data-type="entity-link" >BoxStat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BoxStats.html" data-type="entity-link" >BoxStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DetailGraph.html" data-type="entity-link" >DetailGraph</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GlobalGraph.html" data-type="entity-link" >GlobalGraph</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Olympic.html" data-type="entity-link" >Olympic</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Participation.html" data-type="entity-link" >Participation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SerieData.html" data-type="entity-link" >SerieData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SerieName.html" data-type="entity-link" >SerieName</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});