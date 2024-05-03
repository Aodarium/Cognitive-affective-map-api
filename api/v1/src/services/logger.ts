const tracer = require("tracer");

const logger = tracer.dailyfile({
    root: "./logs",
    maxLogFiles: 10,
    format: [
        "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})", //default format
        {
            error: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}", // error format
        },
    ],
    dateformat: "HH:MM:ss.L",
    preprocess: function (data: any) {
        data.title = data.title.toUpperCase();
    },
});

export default logger;
