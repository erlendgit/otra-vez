function Storage(key, defaultValue) {
    function read() {
        try {
            const item = window.localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (e) {
            return defaultValue;
        }
    }

    function write(value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    }

    return {read, write}
}

function choose(options) {
    return options[Math.floor(Math.random() * options.length)];
}

function PlayOnceMore() {
    this.status = new Storage("status", {
        rows: [],
        isSolitude: false,
        withSpecialDie: false,
        isStarted: false,
    });

    this.getStatus = () => this.status.read();
    this.updateStatus = (status) => this.status.write(status);

    this.isStarted = () => this.getStatus().isStarted;
    this.rows = () => this.getStatus().rows;
    this.isSolitude = () => this.getStatus().isSolitude;
    this.withSpecialDie = () => this.getStatus().withSpecialDie;
    this.canThrowDice = () => !this.isSolitude() || this.rows().length < 30;

    this.start = ({isSolitude, withSpecialDie}) => {
        this.updateStatus({
            rows: [randomDies(withSpecialDie)],
            isStarted: true,
            isSolitude,
            withSpecialDie,
        });
    }

    this.stop = () => {
        let status = this.getStatus();
        status.isStarted = false;
        status.rows = [];
        this.updateStatus(status);
    }

    this.throwDice = () => {
        let status = this.getStatus();
        if (this.canThrowDice()) {
            status.rows = [randomDies(status.withSpecialDie), ...status.rows];
            this.updateStatus(status);
        }
    }

    function randomDies(withSpecialDie) {
        return [
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomColour(),
            randomColour(),
            randomColour(),
            ...(withSpecialDie ? [randomSpecialDie()] : []),
        ];
    }

    function randomNumber() {
        return choose(["d1", "d2", "d3", "d4", "d5", "d6"]);
    }

    function randomColour() {
        return choose(["c1", "c2", "c3", "c4", "c5", "c6"]);
    }

    function randomSpecialDie() {
        return choose(["s1", "s2", "s3", "s4", "s5", "s5"]);
    }
}

(function () {
    let theGame = new PlayOnceMore();

    $.fn.visibleIf = function (condition) {
        if (condition) {
            $(this).removeClass("d-none")
        } else {
            $(this).addClass("d-none")
        }
    }

    $.fn.copyStatusFrom = function (condition) {
        $(this).prop("checked", !!condition);
    }

    $.fn.freezeIf = function (condition) {
        $(this).prop("disabled", !!condition);
    }

    function rowHtml(dies, index) {
        let html = $("#template_row").html();
        html = html.replace("{{dice}}", dies.map(die => dieHtml(die)).join(""));
        html = html.replace("{{count}}", index);
        return html;
    }

    function dieHtml(die) {
        return $(`#template_die_${die}`).html();
    }

    function refreshScreen() {
        const rows = theGame.rows();
        const count = rows.length;

        $(".start-game-button-group").visibleIf(!theGame.isStarted());
        $(".game-control-form").visibleIf(theGame.isStarted());

        $("#solitary_mode").copyStatusFrom(theGame.isSolitude());
        $("#solitary_mode").freezeIf(theGame.isStarted());
        $("#extra_die").copyStatusFrom(theGame.withSpecialDie());
        $("#extra_die").freezeIf(theGame.isStarted());

        $("#throw_dice").freezeIf(!theGame.canThrowDice());
        $("#end_of_game").visibleIf(!theGame.canThrowDice() && theGame.isStarted());

        $("#result").html(rows.map(
            (dies, index) => rowHtml(dies, count - index)
        ).join(""));
    }

    $("#start_game").click(() => {
        const isSolitude = $("#solitary_mode").prop("checked");
        const withSpecialDie = $("#extra_die").prop("checked");
        theGame.start({isSolitude, withSpecialDie});
        refreshScreen();
    });

    $("#stop_game").click(() => {
        if (confirm("Weet je het zeker?")) {
            theGame.stop();
            refreshScreen();
        }
    });

    $("#throw_dice").click(() => {
        theGame.throwDice();
        refreshScreen();
    });

    refreshScreen();
})();