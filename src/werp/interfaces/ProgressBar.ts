interface ProgressBar {
    percentage: number;
    leftBar: {
        text: string;
        class: string;
    };
    rightBar: {
        text: string;
        color: string;
    };
    textClass: string;
}

export default ProgressBar;
