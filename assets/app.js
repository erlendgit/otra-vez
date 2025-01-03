let throw_dice = null;
let reset_result = null;

(function () {
    throw_dice = () => {
        let dice = [
            random_number(),
            random_number(),
            random_number(),
            random_colour(),
            random_colour(),
            random_colour()];
        if ($('#extra_die').prop('checked')) {
            dice = [...dice, random_extra_die()]
        }
        const count = $('.result li').length + 1;
        let current_items = $('.result').html()
        let template = $("#dice_template").html();
        template = template.replace("{{dice}}", dice.join(''));
        template = template.replace("{{count}}", count);
        $('.result').html(template + current_items)

        if ($('#solitary_mode').prop('checked') && count >= 30) {
            const tooMuchMessage = $("#too_much_template").html();
            $("#too_much_placeholder").html(tooMuchMessage);
            $('#roll_dice_button').prop('disabled', true);

        }
    }
    reset_result = () => {
        $('.result').html("");
        $('#too_much_placeholder').html("");
        $('#roll_dice_button').prop('disabled', false);
        throw_dice();
    }

    function random_number() {
        let options = [
            "<div class='die number-die one-die'>1</div>",
            "<div class='die number-die two-die'>2</div>",
            "<div class='die number-die three-die'>3</div>",
            "<div class='die number-die four-die'>4</div>",
            "<div class='die number-die five-die'>5</div>",
            "<div class='die number-die question-die'>?</div>",
        ]
        return _.sample(options);
    }

    function random_colour() {
        let options = [
            "<div class='die colour-die green-die'>Groen</div>",
            "<div class='die colour-die yellow-die'>Geel</div>",
            "<div class='die colour-die blue-die'>Blauw</div>",
            "<div class='die colour-die red-die'>Rood</div>",
            "<div class='die colour-die orange-die'>Oranje</div>",
            "<div class='die colour-die black-die'>Zwart</div>",
        ]
        return _.sample(options);
    }

    function random_extra_die() {
        let options = [
            "<div class='die special-die bomb-die'>Bom</div>",
            "<div class='die special-die stars-die'>2 sterren</div>",
            "<div class='die special-die three-on-a-line-die'>3 op 1 regel</div>",
            "<div class='die special-die all-of-one-colour-die'>1 kleur</div>",
            "<div class='die special-die heart-die'>Hart</div>",
            "<div class='die special-die heart-die'>Hart</div>",
        ]
        return _.sample(options);
    }

    throw_dice();
})();