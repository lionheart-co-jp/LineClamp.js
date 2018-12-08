interface LineClampOptionSingle {
    lines: number
    ellipses: string
    language: string
}
interface LineClampOptions {
    lines?: number
    ellipses?: string
    language?: string
    breakpoints?: {[key: number]: LineClampOptionSingle}
}

if (!(Array.prototype as any).keys){
    (Array.prototype as any).keys = (): number[] => {
        'use strict'

        const len = this.length >>> 0
        const result: number[] = []
        let i = -1

        while (++i !== len) {
            result.push(i)
        }

        return result
    }
}


(function(global) {
    "use strict";

    class LineClamp {
        private _defaultOption: LineClampOptionSingle = {
            ellipses: '...',
            lines: 1,
            language: 'en',
        }
        private _currentOption: LineClampOptionSingle = {
            ellipses: '...',
            lines: 1,
            language: 'en',
        }
        private _breakpoints: {[key: number]: LineClampOptionSingle} = []

        private targets: NodeList
        private event: EventListenerOrEventListenerObject = () => {}
        private enableFlag: Boolean = false

        private original: string[] = []

        constructor(query: string, option: LineClampOptions) {
            this.targets = document.querySelectorAll(query)

            if (option.hasOwnProperty('lines') && option.lines) {
                this.lines(option.lines)
            }
            if (option.hasOwnProperty('ellipses') && option.ellipses) {
                this.ellipses(option.ellipses)
            }
            if (option.hasOwnProperty('language') && option.language) {
                this.language(option.language)
            }
            if (option.hasOwnProperty('breakpoints') && option.breakpoints) {
                this.breakpoints(option.breakpoints)
            }

            // Finished clamping, when target element is not found
            if (! this.targets.length) {
                return;
            }

            // Save Original
            [].forEach.call(this.targets, (item: Element, index: number) => {
                this.original[index] = item.innerHTML
            })

            this.enable()
        }

        /**
         * Set limit line
         *
         * @param lines
         */
        lines(lines: number): LineClamp {
            // Assigned line number should be bigger than 1
            if (lines < 1) {
                lines = 1
            }

            this._defaultOption.lines = lines - 0
            return this
        }

        /**
         * Set ellipses text
         *
         * @param ellipses
         */
        ellipses(ellipses: string): LineClamp {
            this._defaultOption.ellipses = ellipses
            return this
        }

        /**
         * Set Language config
         *
         * @param language
         */
        language(language: string): LineClamp {
            this._defaultOption.language = language
            return this
        }

        /**
         * Set Breakpoints Config
         * @param breakpoints
         */
        breakpoints(breakpoints: {[key: number]: LineClampOptionSingle}): LineClamp {
            this._breakpoints = breakpoints
            return this
        }

        /**
         * Set Enable flag
         */
        enable(): LineClamp {
            if (! this.enableFlag) {
                this.event = this.handler.bind(this)
                window.addEventListener('resize', this.event)
                this.enableFlag = true
            }
            this.handler()

            return this
        }

        /**
         * Set Disable Flag
         */
        disable(): LineClamp {
            if (this.enableFlag) {
                window.removeEventListener('resize', this.event)
                delete this.event
                this.enableFlag = false
            }

            return this
        }

        /**
         * Clamp Handler
         */
        handler() {
            if (! this.enable) {
                return
            }
            this.currentOption()

            Array.prototype.forEach
                .call(this.targets, (item: HTMLElement, index: number) => {
                    item.innerHTML = ''
                    const original = this.original[index]

                    let line: number = 0
                    let prev: number = item.offsetHeight
                    let rows: string[] = original.split(/<br>|<br \/>|<br\/>/)
                    let currentContent: string[] = []
                    let previousContent: string = ''

                    for (let i=0; i<rows.length; i+=1) {
                        const v: string = rows[i]

                        if (i > 0) {
                            currentContent.push('<br>')
                            item.innerHTML = this.join(currentContent)

                            if (line + 1 > this._currentOption.lines) {
                                item.innerHTML = previousContent
                                break
                            }
                        }

                        const splitted: string[] = this.split(v)
                        for (let j=0; j<splitted.length; j+=1) {
                            const z = splitted[j]

                            currentContent.push(z)
                            item.innerHTML = this.join(currentContent)

                            if (item.offsetHeight > prev) {
                                line += 1
                                prev = item.offsetHeight
                            }

                            if (line > this._currentOption.lines) {
                                this.clamp(item, currentContent)
                                break
                            }
                        }

                        previousContent = item.innerHTML
                    }
                })
        }

        currentOption(): void {
            const sizes = Object.keys(this._breakpoints).sort()
            this._currentOption = {...this._defaultOption}

            const width = window.innerWidth
            for (let i = 0; i<sizes.length; i+=1) {
                const size = parseInt(sizes[i])

                if (width <= size) {
                    this._currentOption =
                        (<any>Object).assign(
                            this._currentOption,
                            this._breakpoints[size]
                        )
                    break
                }
            }
        }

        /**
         * Split Text
         *
         * @param string
         */
        split(string: string) {
            let result: string[]
            switch(this._currentOption.language) {
                case 'ja':
                    result = string.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []
                    break
                default:
                    result = string.split(' ')
                    break
            }

            // Remove Empty Items
            return result.filter(e => e !== '')
        }

        /**
         * Join Text
         *
         * @param characters
         * @param addition
         */
        join(characters: string[], addition: string | null = null) {
            if (addition !== null) {
                characters.push(addition)
            }

            switch(this._currentOption.language) {
                case 'ja':
                    return characters.join('')
                default:
                    return characters.join(' ')
            }
        }

        /**
         * Clamp Text
         *
         * @param target
         * @param characters
         */
        clamp(target: HTMLElement, characters: string[]): void {
            const overHeight: number = target.offsetHeight
            const maxCount: number = 10
            let count: number = 0

            while (
                overHeight === target.offsetHeight &&
                count < maxCount
            ) {
                characters.splice(-1)
                target.innerHTML =
                    this.join(characters.slice(), this._currentOption.ellipses)

                count += 1
            }
        }
    }

    global.LineClamp = LineClamp

})((this || 0).self || (typeof self !== "undefined") ? self : global)