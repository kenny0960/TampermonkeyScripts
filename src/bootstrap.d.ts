declare class Tooltip {
    /**
     * Version of this plugin
     *
     * @link https://getbootstrap.com/docs/5.0/getting-started/javascript/#version-numbers
     */
    static readonly VERSION: string;

    static readonly DATA_KEY: string;

    static readonly EVENT_KEY: string;

    constructor(element: string | Element);

    /**
     * Destroys an element's.
     */
    dispose(): void;
}

export { Tooltip };
