// noinspection CssUnresolvedCustomProperty

import {
    LitElement,
    css,
    unsafeCSS,
    type CSSResultGroup,
    type PropertyValues,
    type TemplateResult
} from 'lit'
import { html, unsafeStatic } from 'lit/static-html.js'
import { customElement, property } from 'lit/decorators.js'

import Swiper from 'swiper'
import SwiperCSS from 'swiper/swiper-bundle.css'
import deepcopy from 'deep-clone-simple'
import { type HomeAssistant, type LovelaceCard, type LovelaceCardConfig } from 'custom-card-helpers'
import { type SwiperModule, type SwiperOptions } from 'swiper/types'
import {
    Scrollbar,
    Navigation,
    Pagination,
    Zoom,
    EffectFade,
    EffectCards,
    EffectCube,
    EffectCoverflow,
    EffectFlip,
    Parallax
} from 'swiper/modules'

const CARD_VERSION = '0.0.2'
const HELPERS = (window as any).loadCardHelpers ? (window as any).loadCardHelpers() : Promise.reject(Error('swiper-card could not load card helpers'))

// font-face extracted from swiper-bundle.css
const SwiperFontCSS = '@font-face {\n' +
  "  font-family: 'swiper-icons';\n" +
  // eslint-disable-next-line max-len
  "  src: url('data:application/font-woff;charset=utf-8;base64, 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');\n" +
  '  font-weight: 400;\n' +
  '  font-style: normal;\n' +
  '}'

declare global {
    interface Window {
        SWIPER_CARD_FONT_LOADED?: boolean
    }
}

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: 'swiper-card',
    name: 'Swiper Card',
    description: 'A card which lets you swipe through multiple Lovelace cards.'
})

const computeCardSize = (card: LovelaceCard | HTMLElement): number | Promise<number> => {
    if ('getCardSize' in card && typeof card.getCardSize === 'function') {
        return card.getCardSize()
    }
    if (customElements.get(card.localName)) {
        return 1
    }
    return customElements
        .whenDefined(card.localName)
        .then(async () => await computeCardSize(card))
}

export interface SwiperCardConfig extends LovelaceCardConfig {
    cards: LovelaceCardConfig[]
    style?: string
    script?: string
    background_html?: string
    parameters?: SwiperOptions
    reverse?: boolean
    start_card?: number
    reset_after?: number
}

@customElement('swiper-card')
export class SwiperCard extends LitElement implements LovelaceCard {
    @property({}) _config?: SwiperCardConfig
    @property({}) _cards?: Array<LovelaceCard | HTMLElement>
    #parameters: SwiperOptions = {}
    #hass?: HomeAssistant

    #swiper?: Swiper
    #loaded = false
    #updated = false
    #resetTimer = -1
    #cardPromises?: Promise<any[]>
    #ro?: ResizeObserver

    get hass (): HomeAssistant | undefined {
        return this.#hass
    }

    @property({ attribute: false })
    set hass (hass: HomeAssistant | undefined) {
        this.#hass = hass

        if (hass) {
            this.renderConfigTemplate()
        } else {
            this.#renderConfigUnsubscribe?.()
        }

        if (!this._cards) {
            return
        }

        this._cards.forEach((element) => {
            if ('hass' in element) { element.hass = this.#hass }
        })
    }

    public static getStubConfig (): Record<string, unknown> {
        return { cards: [] }
    }

    override shouldUpdate (changedProps: PropertyValues): boolean {
        if (!this._config) {
            return false
        }
        return changedProps.has('_config') || changedProps.has('_cards')
    }

    #renderConfig?: SwiperCardConfig
    #renderConfigUnsubscribe?: () => void

    private renderConfigTemplate (): void {
        this.#renderConfigUnsubscribe?.()
        this.#renderConfigUnsubscribe = undefined

        if (this.#renderConfig) {
            this.#hass?.connection.subscribeMessage(
                (response) => {
                    const msg = response as { result?: Record<string, any> | any[] }
                    if (msg.result && Array.isArray(msg.result)) {
                        if (!this._config || this._config.cards.length !== msg.result.length) { // set config with newly rendered values
                            this.setConfig(Object.assign({ __renderedConfig: true }, this.#renderConfig, { cards: msg.result }))
                        } else {
                            // replace existing rendered values without re-setting entire config
                            msg.result.forEach((card, index) => {
                                if (JSON.stringify(this._config?.cards[index]) !== JSON.stringify(card)) {
                                    void this.replaceRenderedCard(index, card as LovelaceCardConfig)
                                }
                            })
                        }
                    }
                },
                {
                    type: 'render_template',
                    template: this.#renderConfig.cards
                }
            )
                .then(unsubscribe => { this.#renderConfigUnsubscribe = () => { this.#renderConfigUnsubscribe = undefined; void unsubscribe() } })
                .catch(console.error)
        }
    }

    async replaceRenderedCard (index: number, cardConfig: LovelaceCardConfig): Promise<void> {
        if (this._cards && this._cards.length > index) {
            await this.rebuildCard(this._cards[index], cardConfig)
        }
    }

    setRenderConfig (config?: SwiperCardConfig): void {
        if (config) {
            this._config = undefined
            this.#renderConfig = deepcopy(config)
            this.renderConfigTemplate()
        } else {
            this.#renderConfig = undefined
            this.#renderConfigUnsubscribe?.()
            this.#renderConfigUnsubscribe = undefined
        }
    }

    public setConfig (config: SwiperCardConfig): void {
        if (!config?.cards || !Array.isArray(config.cards)) {
            // noinspection SuspiciousTypeOfGuard
            if (typeof config.cards === 'string') {
                console.info('swiper-card got string for cards - will try to render as template')
                this.setRenderConfig(config)
                return
            }
            throw new Error('Card config incorrect')
        }
        if (config.__renderedConfig !== true) {
            this.setRenderConfig(undefined)
        }
        this._config = config
        this.#parameters = deepcopy(this._config.parameters) || {}
        this._cards = []
        if (window.ResizeObserver) {
            this.#ro = new ResizeObserver(() => {
                this.#swiper?.update()
            })
        }

        // Set default effect (coverflow)
        let effect: any = {
            effect: 'coverflow',
            coverflowEffect: {
                depth: 200,
                stretch: 10
            }
        }
        if (this._config.effect === 'slide' || this._config.effect === 'none') {
            effect = {}
        } else if (this._config.effect === 'cube') {
            effect = {
                effect: 'cube',
                cubeEffect: {
                    shadow: false
                }
            }
        } else if (this._config.effect === 'flip') {
            effect = { effect: 'flip' }
        }

        // Merge default parameters
        this.#parameters = Object.assign(
            {
                speed: 400,
                spaceBetween: 5,
                pagination: {
                    type: 'bullets',
                    clickable: true
                },
                mousewheel: {
                    enabled: true
                },
                ...effect
            },
            this.#parameters
        )

        const modules: SwiperModule[] = []
        if ('scrollbar' in this.#parameters) {
            modules.push(Scrollbar)
        }
        if ('navigation' in this.#parameters) {
            modules.push(Navigation)
            // chrome and firefox do not load @font-face declarations from dynamically constructed css in custom elements
            // so we inject the font declaration directly into the body of the page
            if (window.SWIPER_CARD_FONT_LOADED !== true) {
                const style = document.createElement('style')
                style.innerHTML = SwiperFontCSS
                document.body.append(style)
                window.SWIPER_CARD_FONT_LOADED = true
            }
        }
        if ('pagination' in this.#parameters) {
            modules.push(Pagination)
        }
        if ('zoom' in this.#parameters) {
            modules.push(Zoom)
        }
        if ('parallax' in this.#parameters) {
            modules.push(Parallax)
        }
        if ('effect' in this.#parameters) {
            switch (this.#parameters.effect) {
                case 'fade':
                    modules.push(EffectFade)
                    break
                case 'flip':
                    modules.push(EffectFlip)
                    break
                case 'coverflow':
                    modules.push(EffectCoverflow)
                    break
                case 'cube':
                    modules.push(EffectCube)
                    break
                case 'cards':
                    modules.push(EffectCards)
                    break
            }
        }
        Swiper.use(modules)

        void this.createCards()
    }

    override connectedCallback (): void {
        super.connectedCallback()
        if (this._config && this.#hass && this.#updated && !this.#loaded) {
            void this.initialLoad()
        } else {
            // render template if any and start lsitening for re-renders
            this.renderConfigTemplate()
            this.#swiper?.update()
        }
    }

    override disconnectedCallback (): void {
        super.disconnectedCallback()
        // stop rendering template while we're not rendered
        this.#renderConfigUnsubscribe?.()
    }

    override updated (changedProperties: PropertyValues): void {
        super.updated(changedProperties)
        this.#updated = true
        if (this._config && this.#hass && this.isConnected && !this.#loaded) {
            void this.initialLoad()
        } else {
            this.#swiper?.update()
        }
    }

    static override get styles (): CSSResultGroup {
        return css`
            ${unsafeCSS(SwiperCSS)}
            :host {
                --swiper-theme-color: var(--primary-color);
            }

            :host .swiper-wrapper {
                margin: 2px 0 4px -3px;
            }

            :host .swiper-slide {
                width: calc(100% - 6px) !important;
            }
        `
    }

    override render (): TemplateResult {
        if (!this._config || !this.#hass) {
            return html``
        }

        let rtl = (this.#hass.translationMetadata.translations[this.#hass.selectedLanguage ?? this.#hass.language].isRTL || false)
        if (this._config.reverse === true) {
            rtl = !rtl
        }

        const scriptTag = this._config && 'script' in this._config && typeof this._config.script === 'string'
            ? ((): HTMLElement | undefined => {
                const tag = document.createElement('script')
                tag.innerHTML = this._config.script
                return tag
            })()
            : undefined

        return html`
            ${scriptTag}
            <div class="swiper" dir="${rtl ? 'rtl' : 'ltr'}">
                ${'background_html' in this._config && typeof this._config.background_html === 'string' ? unsafeStatic(this._config.background_html) : ''}
                <div class="swiper-wrapper">${this._cards}</div>
                ${'pagination' in this.#parameters ? html`<div class="swiper-pagination"></div>` : ''}
                ${'navigation' in this.#parameters ? html`<div class="swiper-button-next"></div><div class="swiper-button-prev"></div>` : ''}
                ${'scrollbar' in this.#parameters ? html`<div class="swiper-scrollbar"></div>` : ''}
            </div>
            ${'style' in this._config ? html`<style>${this._config.style}</style>` : html``}
        `
    }

    private async initialLoad (): Promise<void> {
        const container = this.shadowRoot?.querySelector<HTMLElement>('.swiper')
        if (!container) {
            return
        }

        this.#loaded = true

        await this.updateComplete

        if ('pagination' in this.#parameters && this.#parameters.pagination !== false) {
            if (this.#parameters.pagination === null || typeof this.#parameters.pagination !== 'object') {
                this.#parameters.pagination = {}
            }
            this.#parameters.pagination.el = this.shadowRoot?.querySelector<HTMLElement>('.swiper-pagination')
        }

        if ('navigation' in this.#parameters && this.#parameters.navigation !== false) {
            if (this.#parameters.navigation === null || typeof this.#parameters.navigation !== 'object') {
                this.#parameters.navigation = {}
            }
            this.#parameters.navigation.nextEl = this.shadowRoot?.querySelector<HTMLElement>(
                '.swiper-button-next'
            )
            this.#parameters.navigation.prevEl = this.shadowRoot?.querySelector<HTMLElement>(
                '.swiper-button-prev'
            )
        }

        if ('scrollbar' in this.#parameters && this.#parameters.scrollbar !== false) {
            if (this.#parameters.scrollbar === null || typeof this.#parameters.scrollbar !== 'object') {
                this.#parameters.scrollbar = {}
            }
            this.#parameters.scrollbar.el = this.shadowRoot?.querySelector<HTMLElement>('.swiper-scrollbar')
        }

        if (this._config && 'start_card' in this._config) {
            let index = this._config.start_card ?? 0
            if (index < 0) {
                index = Math.max(0, (this._cards?.length ?? 0) + index)
            }
            this.#parameters.initialSlide = index
        }

        this.#swiper = new Swiper(
            container,
            this.#parameters
        )

        if ((this._config?.reset_after ?? -1) > 0) {
            this.#swiper.on('slideChange', () => {
                this.startResetTimer()
            })
            this.#swiper.on('click', () => {
                this.startResetTimer()
            })
            this.#swiper.on('touchEnd', () => {
                this.startResetTimer()
            })
        }
    }

    private startResetTimer (): void {
        if (this.#resetTimer >= 0) {
            window.clearTimeout(this.#resetTimer)
        }
        this.#resetTimer = window.setTimeout(() => {
            this.#swiper?.slideTo(this.#parameters.initialSlide ?? 0)
        }, (this._config?.reset_after ?? 1) * 1000)
    }

    private async createCards (): Promise<void> {
        this.#cardPromises = Promise.all(
            (this._config?.cards ?? []).map(async (config) => await this.createCardElement(config))
        )

        this._cards = await this.#cardPromises
        const observer = this.#ro
        if (observer) {
            this._cards.forEach((card) => {
                observer.observe(card)
            })
        }
        if (this.#swiper) {
            if (this._config && 'start_card' in this._config) {
                let index = this._config.start_card ?? 0
                if (index < 0) {
                    index = Math.max(0, (this._cards?.length ?? 0) + index)
                }
                this.#parameters.initialSlide = index
                this.#swiper.params.initialSlide = index
                this.#swiper.update()
                this.#swiper.slideTo(this.#parameters.initialSlide ?? 0)
            } else {
                this.#swiper.update()
            }
        }
    }

    private async createCardElement (cardConfig: LovelaceCardConfig): Promise<LovelaceCard | HTMLElement> {
        let element: LovelaceCard | HTMLElement
        if (cardConfig.type === 'swiper-image') {
            element = document.createElement('div')
            let baseImage = `<img class="swiper-slide-image" loading="lazy" src="${cardConfig.src ?? ''}" /><div class="swiper-lazy-preloader"></div>`
            if ('zoom' in this.#parameters) {
                baseImage = `<div class="swiper-zoom-container">${baseImage}</div>`
            }
            element.innerHTML = `${baseImage}${'html' in cardConfig && typeof 'html' === 'string' ? cardConfig.html : ''}`
        } else if (cardConfig.type === 'swiper-html') {
            element = document.createElement('div')
            element.innerHTML = 'html' in cardConfig && typeof 'html' === 'string' ? cardConfig.html : ''
        } else {
            try {
                element = (await HELPERS).createCardElement(cardConfig)
            } catch (e) {
                element = document.createElement('hui-warning')
                element.innerText = (e as any).message
            }
        }
        element.className = 'swiper-slide'
        element.style.marginLeft = '6px'
        if ('card_width' in (this._config ?? {})) {
            element.style.width = this._config?.card_width
        }
        if (this.#hass) {
            if ('hass' in element) { element.hass = this.#hass }
        }
        element.addEventListener(
            'll-rebuild',
            (ev) => {
                ev.stopPropagation()
                void this.rebuildCard(element, cardConfig)
            },
            {
                once: true
            }
        )
        return element
    }

    private async rebuildCard (cardElToReplace: LovelaceCard | HTMLElement, config: LovelaceCardConfig): Promise<void> {
        let newCardEl = await this.createCardElement(config)
        try {
            if ('hass' in newCardEl) { newCardEl.hass = this.hass }
        } catch (e) {
            newCardEl = document.createElement('hui-warning')
            newCardEl.innerText = (e as any).message
        }
        if (cardElToReplace.parentElement) {
            cardElToReplace.parentElement.replaceChild(newCardEl, cardElToReplace)
        }
        this._cards = (this._cards ?? []).map((curCardEl) =>
            curCardEl === cardElToReplace ? newCardEl : curCardEl
        )
        this.#ro?.unobserve(cardElToReplace)
        this.#ro?.observe(newCardEl)
        this.#swiper?.update()
    }

    async getCardSize (): Promise<number> {
        await this.#cardPromises

        if (!this._cards || this._cards.length <= 0) {
            return 0
        }

        const results = await Promise.all(this._cards.map(async it => await computeCardSize(it)))

        return Math.max(...results)
    }
}

console.info(
    `%c  SWIPER-CARD \n%c ${CARD_VERSION}    `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray'
)
