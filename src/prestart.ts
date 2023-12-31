ig.ColoredFont = ig.Image.extend({
    cacheType: "ColoredFont",

    init(path, color, replacedColor = "#ffffff") {
        this.parent(path);
        this.color = new ig.RGBColor(color);
        this.replacedColor = new ig.RGBColor(replacedColor)
    },
    
    onload() {
        this.width = this.data.width;
        this.height = this.data.height;

        let canvas = ig.$new("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        let canvasCtx = ig.system.getBufferContext(canvas);
        canvasCtx.drawImage(this.data, 0, 0, this.width, this.height);
        let data = canvasCtx.getImageData(0, 0, this.width, this.height);

        for(let i = 0; i < data.data.length; i += 4) {
            if(data.data[i]   == this.replacedColor.r
            && data.data[i+1] == this.replacedColor.g
            && data.data[i+2] == this.replacedColor.b
            ) {
                data.data[i]   = this.color.r;
                data.data[i+1] = this.color.g;
                data.data[i+2] = this.color.b;
            }
        }
        
        canvasCtx.putImageData(data, 0, 0);
        this.data = canvas;

        if (ig.system.scale != 1) {
            this.resize(ig.system.scale);
        } else {
            this.onresized();
        }
    },

    getCacheKey(path, color) {
        return `${path}-${color}`
    }
})

Object.assign(sc.FONT_COLORS, {
    WHITE: 0,
    YELLOW: 3,
    ACTUAL_PURPLE: 6,
    BLUE: 7,
    DARK_BLUE: 8,
    PINK: 9,
    TEAL: 10,
    LIME: 11,
    FUCHSIA: 12,
    OLIVE: 13,
    VIOLET: 14,
    BROWN: 15,
    GOLD: 16,
    DARK_RED: 17,
} as typeof sc.FONT_COLORS)

sc.FontSystem.inject({
    init() {
        this.parent();
        
        this.addColoredFont("actual_purple", "#8a41d8", sc.FONT_COLORS.ACTUAL_PURPLE);
        this.addColoredFont("orange", "#ff8932", sc.FONT_COLORS.ORANGE);
        this.addColoredFont("blue", "#5fc3fc", sc.FONT_COLORS.BLUE);
        this.addColoredFont("dark_blue", "#2334ed", sc.FONT_COLORS.DARK_BLUE);
        this.addColoredFont("pink", "#fc76b0", sc.FONT_COLORS.PINK);
        this.addColoredFont("teal", "#0ffcc5", sc.FONT_COLORS.TEAL);
        this.addColoredFont("lime", "#8efc20", sc.FONT_COLORS.LIME);
        this.addColoredFont("fuchsia", "#e502dd", sc.FONT_COLORS.FUCHSIA);
        this.addColoredFont("olive", "#89b73e", sc.FONT_COLORS.OLIVE);
        this.addColoredFont("violet", "#900090", sc.FONT_COLORS.VIOLET);
        this.addColoredFont("brown", "#814914", sc.FONT_COLORS.BROWN);
        this.addColoredFont("gold", "#ffa100", sc.FONT_COLORS.GOLD);
        this.addColoredFont("dark_red", "#a70000", sc.FONT_COLORS.DARK_RED);
    },

    addColoredFont(key, colorCode, fontColorKey) {
        let normFont = this.colors[key] = new ig.ColoredFont(
            "media/font/hall-fetica-bold.png",
            colorCode
        );
        let midFont = this.colors[`${key}_mid`] = new ig.ColoredFont(
            "media/font/hall-fetica-small.png",
            colorCode
        );
        let tinyFont = this.colors[`${key}_tiny`] = new ig.ColoredFont(
            "media/font/tiny.png",
            colorCode,
            "#cccccc"
        )

        this.font.pushColorSet(fontColorKey, normFont, colorCode);
        this.smallFont.pushColorSet(fontColorKey, midFont, colorCode);
        this.tinyFont.pushColorSet(fontColorKey, tinyFont, colorCode);
    }
})

sc.fontsystem = new sc.FontSystem;

sc.FONT_COLOR_ALIASES = {
    white: sc.FONT_COLORS.WHITE,
    red: sc.FONT_COLORS.RED,
    green: sc.FONT_COLORS.GREEN,
    yellow: sc.FONT_COLORS.YELLOW,
    gray: sc.FONT_COLORS.GREY, //american english for 'grey'
    grey: sc.FONT_COLORS.GREY, //british english for 'gray'
    orange: sc.FONT_COLORS.ORANGE,
    purple: sc.FONT_COLORS.ACTUAL_PURPLE,
    blue: sc.FONT_COLORS.BLUE,
    dark_blue: sc.FONT_COLORS.DARK_BLUE,
    "dark-blue": sc.FONT_COLORS.DARK_BLUE,
    pink: sc.FONT_COLORS.PINK,
    teal: sc.FONT_COLORS.TEAL,
    lime: sc.FONT_COLORS.LIME,
    fuchsia: sc.FONT_COLORS.FUCHSIA,
    olive: sc.FONT_COLORS.OLIVE,
    violet: sc.FONT_COLORS.VIOLET,
    brown: sc.FONT_COLORS.BROWN,
    gold: sc.FONT_COLORS.GOLD,
    dark_red: sc.FONT_COLORS.DARK_RED,
    "dark-red": sc.FONT_COLORS.DARK_RED,
}

ig.TextCommands.register("C", true, (argument, index, commands) => {
    let key = argument.toLowerCase()
    commands.push({
        index,
        command: {
            color: key in sc.FONT_COLOR_ALIASES 
                ? sc.FONT_COLOR_ALIASES[key]
                : sc.FONT_COLORS.WHITE
        }
    })
})

ig.TextCommands.register("l", true, argument => ig.lang.get(argument))

window.FontUtilsShowColorTestDialog = () => {
    let colors = [
        "White",
        "Red",
        "Green",
        "Yellow",
        "Gray/Grey",
        "Orange",
        "Purple",
        "Blue",
        "Dark Blue",
        "Pink",
        "Teal",
        "Lime",
        "Fuchsia",
        "Olive",
        "Violet",
        "Brown",
        "Gold",
        "Dark Red"
    ]

    let workingstr = "";
    
    for(let i = 0; i < colors.length; i++) {
        workingstr += `\\c[${i}]${i}: ${colors[i]}`;
        workingstr += i % 5 == 4 ? "\n" : " ";
    }
    sc.Dialogs.showChoiceDialog(workingstr, null, ["Close"]);
}